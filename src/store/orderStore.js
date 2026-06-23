import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase }           from '@/lib/supabaseClient'
import useToastStore          from '@/store/toastStore'
import { playNotificationSound } from '@/lib/audioUtils'
import { ORDER_STATUS, PAY_STATUS, PREP_TIME_PER_ORDER } from '@/lib/constants'
import { generateOrderId, calcETA } from '@/lib/utils'

/**
 * @typedef {Object} OrderLine
 * @property {string} name
 * @property {number} price
 * @property {string} [notes]
 */

/**
 * @typedef {Object} Order
 * @property {string}      id
 * @property {string}      customerName
 * @property {string}      table
 * @property {OrderLine[]} items
 * @property {string}      [notes]
 * @property {number}      subtotal
 * @property {number}      tax
 * @property {number}      total
 * @property {string}      payMethod
 * @property {string}      payLast4
 * @property {string}      payStatus    - 'pending' | 'paid'
 * @property {string}      status       - 'received' | 'preparing' | 'ready'
 * @property {number}      queuePosition
 * @property {number}      estimatedMinutes
 * @property {string}      time         - display HH:MM
 * @property {Date}        createdAt
 */

// ─── DB row → app shape ───────────────────────────────────────────────────────
function mapRow(row) {
  return {
    id:               row.id,
    customerName:     row.customer_name,
    table:            row.table_type,
    items:            (row.order_items ?? []).map((i) => ({
      name:  i.name,
      price: parseFloat(i.price),
      notes: i.notes ?? '',
    })),
    notes:            row.notes ?? '',
    subtotal:         parseFloat(row.subtotal),
    tax:              parseFloat(row.tax),
    total:            parseFloat(row.total),
    payMethod:        row.pay_method,
    payLast4:         row.pay_last4 ?? '',
    payStatus:        row.pay_status,
    status:           row.status,
    queuePosition:    row.queue_position,
    estimatedMinutes: row.estimated_minutes,
    time:             new Date(row.created_at)
                        .toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    createdAt:        new Date(row.created_at),
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────
const useOrderStore = create(
  persist(
    (set, get) => ({
      /** @type {Order[]} */
      orders: [],

      /** ID of the order the current customer session placed */
      currentOrderId: null,

      /** Loading flag while fetching from Supabase */
      loading: false,

      /** Revenue accumulated from delivered (deleted) orders today */
      deliveredRevenue: 0,

      /** ISO date string 'YYYY-MM-DD' — used to reset deliveredRevenue each day */
      deliveredDate: null,

      // ─── Data fetching ────────────────────────────────────────────────────────

      /** Fetch all orders from Supabase (RLS ensures admin sees all, customer sees own) */
      async fetchOrders() {
        // Reset delivered revenue if it's a new day
        const today = new Date().toISOString().slice(0, 10)
        if (get().deliveredDate !== today) {
          set({ deliveredRevenue: 0, deliveredDate: today })
        }

        set({ loading: true })
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false })

        if (!error && data) {
          set({ orders: data.map(mapRow) })
        }
        set({ loading: false })
      },

      /**
       * Subscribe to real-time order changes.
       * Returns an unsubscribe function — call it on component unmount.
       */
      subscribeToOrders() {
        const channel = supabase
          .channel('orders-realtime')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'orders' },
            async (payload) => {
              const { eventType, new: updated, old } = payload

              if (eventType === 'INSERT') {
                // Fetch with items since Realtime payload doesn't include joined tables
                const { data } = await supabase
                  .from('orders')
                  .select('*, order_items(*)')
                  .eq('id', payload.new.id)
                  .single()
                if (data) {
                  set((s) => ({ orders: [mapRow(data), ...s.orders] }))
                }
              }

              if (eventType === 'UPDATE') {
                // Merge changed fields; keep existing items (they don't change on status update)
                set((s) => ({
                  orders: s.orders.map((o) =>
                    o.id === updated.id
                      ? {
                          ...o,
                          status:           updated.status,
                          payStatus:        updated.pay_status,
                          estimatedMinutes: updated.estimated_minutes,
                          queuePosition:    updated.queue_position,
                        }
                      : o
                  ),
                }))

                // Customer notification when their order status changes
                const { currentOrderId } = get()
                if (
                  updated.id === currentOrderId &&
                  old?.status !== updated.status &&
                  (updated.status === ORDER_STATUS.PREPARING ||
                   updated.status === ORDER_STATUS.READY)
                ) {
                  useToastStore.getState().show({ type: updated.status, duration: 6000 })
                  playNotificationSound()
                }
              }

              if (eventType === 'DELETE') {
                set((s) => ({
                  orders: s.orders.filter((o) => o.id !== old.id),
                  currentOrderId:
                    s.currentOrderId === old.id ? null : s.currentOrderId,
                }))
              }
            }
          )
          .subscribe()

        return () => supabase.removeChannel(channel)
      },

      // ─── Customer actions ─────────────────────────────────────────────────────

      /**
       * Insert a new order + its items into Supabase.
       *
       * @param {{
       *   customerId?: string,
       *   customerName: string,
       *   table: string,
       *   items: OrderLine[],
       *   notes?: string,
       *   subtotal: number, tax: number, total: number,
       *   payMethod: string, payLast4: string,
       *   payStatus?: 'pending' | 'paid',   // default: 'paid'
       * }} payload
       * @returns {Promise<{ id: string, queuePosition: number, estimatedMinutes: number }>}
       */
      async createOrder(payload) {
        const orderId = generateOrderId()

        // Queue position = count of non-ready orders + 1
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .neq('status', ORDER_STATUS.READY)

        const queuePosition    = (count ?? 0) + 1
        const estimatedMinutes = calcETA(queuePosition, PREP_TIME_PER_ORDER)

        const { error: orderErr } = await supabase.from('orders').insert({
          id:                orderId,
          customer_id:       payload.customerId ?? null,
          customer_name:     payload.customerName,
          table_type:        payload.table,
          notes:             payload.notes ?? '',
          subtotal:          payload.subtotal,
          tax:               payload.tax,
          total:             payload.total,
          pay_method:        payload.payMethod,
          pay_last4:         payload.payLast4 ?? '',
          pay_status:        payload.payStatus ?? PAY_STATUS.PAID,
          status:            ORDER_STATUS.RECEIVED,
          queue_position:    queuePosition,
          estimated_minutes: estimatedMinutes,
        })

        if (orderErr) throw orderErr

        const { error: itemsErr } = await supabase.from('order_items').insert(
          payload.items.map((item) => ({
            order_id: orderId,
            name:     item.name,
            price:    item.price,
            notes:    item.notes ?? '',
          }))
        )

        if (itemsErr) throw itemsErr

        set({ currentOrderId: orderId })

        // The Realtime INSERT event will add the order to the local list
        return { id: orderId, queuePosition, estimatedMinutes }
      },

      // ─── Worker actions ───────────────────────────────────────────────────────

      async confirmPayment(orderId) {
        await supabase
          .from('orders')
          .update({ pay_status: PAY_STATUS.PAID })
          .eq('id', orderId)
        // Realtime UPDATE will merge the change into local state
      },

      async startPreparing(orderId) {
        await supabase
          .from('orders')
          .update({ status: ORDER_STATUS.PREPARING })
          .eq('id', orderId)
      },

      async markReady(orderId) {
        await supabase
          .from('orders')
          .update({ status: ORDER_STATUS.READY, estimated_minutes: 0 })
          .eq('id', orderId)
      },

      /** Remove order after delivery (optimistic UI + DB delete) */
      async deliverOrder(orderId) {
        // Capture total before removing so we can accumulate daily revenue
        const order = get().orders.find((o) => o.id === orderId)
        const today = new Date().toISOString().slice(0, 10)

        // Optimistic remove so the admin panel updates immediately
        set((s) => ({
          orders: s.orders.filter((o) => o.id !== orderId),
          currentOrderId:
            s.currentOrderId === orderId ? null : s.currentOrderId,
          // Accumulate revenue of delivered orders (only paid ones)
          deliveredRevenue:
            s.deliveredRevenue + (order?.payStatus === PAY_STATUS.PAID ? (order?.total ?? 0) : 0),
          deliveredDate: today,
        }))
        await supabase.from('orders').delete().eq('id', orderId)
      },

      // ─── Selectors ────────────────────────────────────────────────────────────

      getCurrentOrder() {
        const { orders, currentOrderId } = get()
        return orders.find((o) => o.id === currentOrderId) ?? null
      },

      getStats() {
        const { orders, deliveredRevenue } = get()
        return {
          total:          orders.length,
          pendingPayment: orders.filter((o) => o.payStatus === PAY_STATUS.PENDING).length,
          inKitchen:      orders.filter((o) => o.status === ORDER_STATUS.PREPARING).length,
          ready:          orders.filter((o) => o.status === ORDER_STATUS.READY).length,
          // Active orders revenue + already-delivered orders revenue today
          revenue:        orders
            .filter((o) => o.payStatus === PAY_STATUS.PAID)
            .reduce((sum, o) => sum + o.total, 0)
            + deliveredRevenue,
        }
      },
    }),
    {
      name: 'bk-current-order',
      // Persist currentOrderId (customer tracking) + daily revenue counter (admin dashboard)
      partialize: (s) => ({
        currentOrderId:   s.currentOrderId,
        deliveredRevenue: s.deliveredRevenue,
        deliveredDate:    s.deliveredDate,
      }),
    }
  )
)

export default useOrderStore
