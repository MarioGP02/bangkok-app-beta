import { X, ChefHat, PackageCheck } from 'lucide-react'
import useToastStore from '@/store/toastStore'
import { ORDER_STATUS } from '@/lib/constants'

// ─── Status → visual config ────────────────────────────────────────────────────
const STATUS_CONFIG = {
  [ORDER_STATUS.PREPARING]: {
    Icon:      ChefHat,
    title:     '¡Tu pedido está en cocina!',
    sub:       'El chef ya está preparándolo 🍜',
    border:    'border-bk-primary/30',
    bg:        'bg-bk-primary/10',
    iconColor: 'text-bk-primary',
    dot:       'bg-bk-primary',
  },
  [ORDER_STATUS.READY]: {
    Icon:      PackageCheck,
    title:     '¡Tu pedido está listo!',
    sub:       'Pasa a recogerlo cuando quieras 🎉',
    border:    'border-green-500/30',
    bg:        'bg-green-500/10',
    iconColor: 'text-green-400',
    dot:       'bg-green-400',
  },
}

// ─── Single Toast ──────────────────────────────────────────────────────────────
function Toast({ toast, onDismiss }) {
  const cfg = STATUS_CONFIG[toast.type]

  // Generic fallback (shouldn't normally appear in order flow)
  if (!cfg) {
    return (
      <div className="flex items-start gap-3 bg-bk-card border border-bk-border
                      rounded-2xl px-4 py-3.5 shadow-lg backdrop-blur-md max-w-xs w-full
                      animate-toast-in">
        <p className="flex-1 text-[13px] text-bk-text">{toast.message}</p>
        <button onClick={() => onDismiss(toast.id)} className="text-bk-muted hover:text-bk-text">
          <X size={14} />
        </button>
      </div>
    )
  }

  const { Icon, title, sub, border, bg, iconColor, dot } = cfg

  return (
    <div className={`flex items-start gap-3 border rounded-2xl px-4 py-3.5
                     shadow-lg backdrop-blur-md max-w-xs w-full animate-toast-in
                     ${bg} ${border}`}>
      {/* Pulsing status dot */}
      <div className="relative flex-shrink-0 mt-1">
        <span className={`block w-2 h-2 rounded-full ${dot}`} />
        <span className={`absolute inset-0 rounded-full ${dot} opacity-40 animate-ping`} />
      </div>

      {/* Icon + text */}
      <div className="flex-1 min-w-0">
        <div className={`flex items-center gap-1.5 mb-0.5 ${iconColor}`}>
          <Icon size={14} />
          <p className="text-[13px] font-black text-bk-text leading-tight">{title}</p>
        </div>
        <p className="text-[11px] text-bk-muted leading-snug">{sub}</p>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 mt-0.5 text-bk-muted hover:text-bk-text transition-colors"
        aria-label="Cerrar notificación"
      >
        <X size={14} />
      </button>
    </div>
  )
}

// ─── Provider (place once inside BrowserRouter in App.jsx) ────────────────────
// Notifications are now triggered directly by orderStore's Realtime subscription —
// no localStorage polling needed.
export default function ToastProvider() {
  const toasts  = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 pointer-events-none"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  )
}
