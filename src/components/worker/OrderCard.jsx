import { MapPin, CreditCard, AlertTriangle, ChefHat, PackageCheck, CheckCheck, MessageSquare } from 'lucide-react'
import Badge  from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import useOrderStore from '@/store/orderStore'
import { ORDER_STATUS, PAY_STATUS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'

/**
 * Full order card for the worker dashboard.
 * Renders the correct action button based on (payStatus, status) state machine.
 *
 * @param {{ order: import('@/store/orderStore').Order }} props
 */
export default function OrderCard({ order }) {
  const confirmPayment = useOrderStore((s) => s.confirmPayment)
  const startPreparing = useOrderStore((s) => s.startPreparing)
  const markReady      = useOrderStore((s) => s.markReady)
  const deliverOrder   = useOrderStore((s) => s.deliverOrder)

  const isReady = order.status === ORDER_STATUS.READY

  return (
    <div
      className={`bg-bk-card border rounded-2xl p-4 transition-colors
        ${isReady ? 'border-indigo-500/25 bg-indigo-500/4' : 'border-bk-border hover:border-bk-border2'}`}
    >
      {/* ── Row 1: ID + customer + badges ─────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Order ID block */}
          <div className="bg-black/40 border border-bk-border rounded-xl px-3 py-2 text-center">
            <p className="text-[9px] text-bk-muted font-mono uppercase">ID</p>
            <p className="text-[15px] font-black font-mono text-bk-primary leading-tight">{order.id}</p>
          </div>

          {/* Customer info */}
          <div>
            <p className="text-[15px] font-bold">{order.customerName}</p>
            <div className="flex items-center gap-1 mt-0.5 text-bk-muted text-[11px]">
              <MapPin size={10} />
              <span>{order.table}</span>
              <span className="opacity-40">·</span>
              <span className="font-mono">{order.time}</span>
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex gap-2 items-center flex-wrap">
          <Badge variant={order.payStatus === PAY_STATUS.PAID ? 'paid' : 'pending'}>
            {order.payStatus === PAY_STATUS.PAID ? 'Pagado' : 'Pago pend.'}
          </Badge>
          <Badge
            variant={
              order.status === ORDER_STATUS.READY     ? 'ready'     :
              order.status === ORDER_STATUS.PREPARING ? 'preparing' : 'pending'
            }
          >
            {order.status === ORDER_STATUS.READY
              ? 'Listo'
              : order.status === ORDER_STATUS.PREPARING
              ? 'Preparando'
              : 'Recibido'}
          </Badge>
        </div>
      </div>

      {/* ── Row 2: Items ──────────────────────────────────────────────────── */}
      <div className="bg-black/25 border border-bk-border rounded-xl p-3 mb-3">
        <p className="text-[9px] font-bold text-bk-muted uppercase tracking-widest mb-2">Artículos</p>
        <div className="flex flex-col gap-1.5">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col bg-bk-card2 border border-bk-border2 rounded-lg px-2.5 py-1.5"
            >
              <div className="flex items-center gap-1">
                <span className="text-bk-primary text-[9px] font-bold font-mono">·</span>
                <span className="text-[11px] font-semibold text-bk-text">{item.name}</span>
                <span className="ml-auto text-[11px] font-mono text-bk-muted">{formatPrice(item.price)}</span>
              </div>
              {item.notes ? (
                <p className="text-[10px] text-orange-300/80 mt-0.5 pl-3">{item.notes}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* ── Row 2b: Order notes (kitchen instructions) ────────────────────── */}
      {order.notes && (
        <div className="flex items-start gap-2 bg-bk-primary/8 border border-bk-primary/20
                        rounded-xl px-3 py-2.5 mb-3">
          <MessageSquare size={12} className="text-bk-primary flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-bk-primary/90 leading-relaxed">{order.notes}</p>
        </div>
      )}

      {/* ── Row 3: Payment + actions ──────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Total + payment method */}
        <div className="flex items-center gap-3">
          <div className="bg-black/25 border border-bk-border rounded-xl px-3 py-2">
            <p className="text-[9px] text-bk-muted mb-0.5">Total</p>
            <p className="text-[15px] font-black">{formatPrice(order.total)}</p>
          </div>

          {order.payStatus === PAY_STATUS.PAID ? (
            <div className="flex items-center gap-1.5 text-[11px] text-bk-muted">
              <CreditCard size={12} />
              <span className="font-mono">{order.payMethod} ···{order.payLast4}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-yellow-500/8 border border-yellow-500/20
                            rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-yellow-400">
              <AlertTriangle size={11} />
              Esperando pago
            </div>
          )}
        </div>

        {/* Action buttons — state machine */}
        <div className="flex gap-2">
          {/* 1. Confirm payment */}
          {order.payStatus === PAY_STATUS.PENDING && (
            <Button
              variant="secondary"
              size="sm"
              className="border-yellow-500/25 text-yellow-400 hover:bg-yellow-500/10"
              onClick={() => confirmPayment(order.id)}
            >
              Confirmar pago
            </Button>
          )}

          {/* 2. Start preparing (only when paid + received) */}
          {order.payStatus === PAY_STATUS.PAID &&
           order.status === ORDER_STATUS.RECEIVED && (
            <Button size="sm" onClick={() => startPreparing(order.id)}>
              <ChefHat size={13} />
              Iniciar preparación
            </Button>
          )}

          {/* 3. Mark ready */}
          {order.status === ORDER_STATUS.PREPARING && (
            <Button variant="indigo" size="sm" onClick={() => markReady(order.id)}>
              <PackageCheck size={13} />
              Marcar listo
            </Button>
          )}

          {/* 4. Deliver (remove from queue) */}
          {order.status === ORDER_STATUS.READY && (
            <Button
              variant="ghost"
              size="sm"
              className="border-green-500/20 text-green-400 hover:bg-green-500/10"
              onClick={() => deliverOrder(order.id)}
            >
              <CheckCheck size={13} />
              Entregado
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
