import { create } from 'zustand'

let _nextId = 1

/**
 * @typedef {'preparing'|'ready'|'info'|'error'} ToastType
 *
 * @typedef {Object} Toast
 * @property {number}    id
 * @property {string}    message  - fallback text (used for generic toasts)
 * @property {ToastType} type
 */

const useToastStore = create((set) => ({
  /** @type {Toast[]} */
  toasts: [],

  /**
   * Add a toast. Auto-removes after `duration` ms (0 = manual dismiss only).
   * @param {{ message?: string, type?: ToastType, duration?: number }} opts
   * @returns {number} toast id
   */
  show({ message = '', type = 'info', duration = 5500 } = {}) {
    const id = _nextId++
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    if (duration > 0) {
      setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), duration)
    }
    return id
  },

  /**
   * Manually remove a toast by id.
   * @param {number} id
   */
  dismiss(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  },
}))

export default useToastStore
