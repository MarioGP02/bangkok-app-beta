import { Check, ChefHat, PackageCheck } from 'lucide-react'
import { ORDER_STATUS } from '@/lib/constants'

const STEPS = [
  {
    key:   ORDER_STATUS.RECEIVED,
    label: 'Pedido recibido',
    sub:   'Tu pedido ha llegado a cocina',
    Icon:  Check,
  },
  {
    key:   ORDER_STATUS.PREPARING,
    label: 'En preparación',
    sub:   'El equipo está cocinando tu pedido',
    Icon:  ChefHat,
  },
  {
    key:   ORDER_STATUS.READY,
    label: '¡Listo para recoger!',
    sub:   'Pasa a recoger en el mostrador',
    Icon:  PackageCheck,
  },
]

const STATUS_ORDER = [ORDER_STATUS.RECEIVED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY]

/**
 * @param {{ status: string }} props
 */
export default function OrderTimeline({ status }) {
  const curIdx = STATUS_ORDER.indexOf(status)

  return (
    <div className="flex flex-col gap-4">
      {STEPS.map((step, i) => {
        const done   = i < curIdx
        const active = i === curIdx
        const pending = i > curIdx

        return (
          <div key={step.key} className="flex items-start gap-3 relative">
            {/* Vertical connector */}
            {i < STEPS.length - 1 && (
              <div
                className="absolute left-[11px] top-6 w-0.5 h-[calc(100%+8px)]"
                style={{ background: done ? '#ff6b00' : '#1e1e1e' }}
              />
            )}

            {/* Dot */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10
                ${done   ? 'bg-bk-primary text-black' : ''}
                ${active ? 'bg-bk-primary/10 border-2 border-bk-primary text-bk-primary' : ''}
                ${pending ? 'bg-bk-card2 border-2 border-bk-border2 text-bk-muted2' : ''}`}
            >
              <step.Icon size={11} strokeWidth={2.5} />
            </div>

            {/* Label */}
            <div className="pt-0.5">
              <p className={`text-[13px] font-${active ? '700' : '500'}
                             ${pending ? 'text-bk-muted2' : done ? 'text-bk-muted' : 'text-bk-text'}`}>
                {step.label}
              </p>
              {active && (
                <p className="text-[10px] text-bk-muted mt-0.5">{step.sub}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
