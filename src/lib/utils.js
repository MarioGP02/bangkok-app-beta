import { clsx } from 'clsx'

/** Merge Tailwind class names safely */
export function cn(...inputs) {
  return clsx(inputs)
}

/** Format a number as currency (€) */
export function formatPrice(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount)
}

/** Format a Date as HH:MM */
export function formatTime(date = new Date()) {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

/** Generate a Bangkok order ID */
export function generateOrderId() {
  return `BK-${Math.floor(Math.random() * 8000 + 1000)}`
}

/** Compute the estimated queue wait in minutes.
 *  activeOrders = orders that are not yet "ready".
 *  queuePosition = 1-based position in that queue.
 */
export function calcETA(queuePosition, prepTimePerOrder) {
  return queuePosition * prepTimePerOrder
}
