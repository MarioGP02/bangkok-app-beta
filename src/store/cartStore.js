import { create } from 'zustand'
import { TAX_RATE } from '@/lib/constants'

/**
 * @typedef {Object} Customization
 * @property {{ id: string, label: string, chilis: number }} spicy
 * @property {{ id: string, label: string, price: number } | null} protein
 * @property {{ id: string, label: string, price: number }[]} toppings
 */

/**
 * @typedef {Object} CartLine
 * @property {string}  lineId       - unique per line (allows duplicate items with different customizations)
 * @property {import('@/data/menu').MenuItem} item
 * @property {number}  quantity
 * @property {Customization | null} customization
 * @property {number}  unitPrice    - item.price + extras (pre-computed for display)
 */

/**
 * @typedef {Object} CartSummary
 * @property {CartLine[]} lines
 * @property {number}     itemCount
 * @property {number}     subtotal
 * @property {number}     tax
 * @property {number}     total
 * @property {{ name: string, price: number, notes: string }[]} snapshot
 */

/** Compute the extra cost from a customization */
function extrasPrice(customization) {
  if (!customization) return 0
  const protein  = customization.protein?.price ?? 0
  const toppings = (customization.toppings ?? []).reduce((s, t) => s + t.price, 0)
  return protein + toppings
}

/** Human-readable customization summary (for worker / order snapshot) */
export function customizationLabel(customization) {
  if (!customization) return ''
  const parts = []
  if (customization.spicy?.id !== 'none') parts.push(customization.spicy.label)
  if (customization.protein) parts.push(`+${customization.protein.label}`)
  if (customization.toppings?.length) parts.push(customization.toppings.map((t) => t.label).join(', '))
  return parts.join(' · ')
}

let _nextId = 1

const useCartStore = create((set, get) => ({
  /** @type {CartLine[]} */
  lines: [],

  // ─── Mutations ───────────────────────────────────────────────────────────

  /**
   * @param {import('@/data/menu').MenuItem} item
   * @param {Customization | null} customization
   */
  addItem(item, customization = null) {
    // Non-customizable items: merge quantity on existing line
    if (!item.customizable) {
      const existing = get().lines.find((l) => l.item.id === item.id)
      if (existing) {
        set((state) => ({
          lines: state.lines.map((l) =>
            l.lineId === existing.lineId ? { ...l, quantity: l.quantity + 1 } : l
          ),
        }))
        return
      }
    }
    // Customizable items (or new non-customizable): always new line
    const lineId    = String(_nextId++)
    const unitPrice = +(item.price + extrasPrice(customization)).toFixed(2)
    set((state) => ({
      lines: [...state.lines, { lineId, item, quantity: 1, customization, unitPrice }],
    }))
  },

  removeItem(lineId) {
    set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) }))
  },

  updateQuantity(lineId, quantity) {
    if (quantity <= 0) {
      get().removeItem(lineId)
      return
    }
    set((state) => ({
      lines: state.lines.map((l) => (l.lineId === lineId ? { ...l, quantity } : l)),
    }))
  },

  clear() {
    set({ lines: [] })
  },

  // ─── Computed ────────────────────────────────────────────────────────────
  // ⚠️ Use inside selector: `useCartStore(s => s.getSummary())`

  /** @returns {CartSummary} */
  getSummary() {
    const lines    = get().lines
    const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0)
    const tax      = subtotal * TAX_RATE
    const total    = subtotal + tax

    return {
      lines,
      itemCount: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal:  +subtotal.toFixed(2),
      tax:       +tax.toFixed(2),
      total:     +total.toFixed(2),
      snapshot: lines.map((l) => {
        const label = customizationLabel(l.customization)
        return {
          name:  l.quantity > 1 ? `${l.quantity}× ${l.item.name}` : l.item.name,
          price: +(l.unitPrice * l.quantity).toFixed(2),
          notes: label,
        }
      }),
    }
  },
}))

export default useCartStore
