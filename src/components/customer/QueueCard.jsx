import { Clock, Users } from 'lucide-react'
import { ORDER_STATUS } from '@/lib/constants'

/**
 * Shows queue position and ETA when order is active (not yet ready).
 *
 * @param {{ order: import('@/store/orderStore').Order }} props
 */
export default function QueueCard({ order }) {
  if (order.status === ORDER_STATUS.READY) {
    return (
      <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-4 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <p className="text-[15px] font-bold text-indigo-300">¡Tu pedido está listo!</p>
        <p className="text-[11px] text-bk-muted mt-1">Pasa a recogerlo en el mostrador</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Queue position */}
      <div className="bg-bk-card border border-bk-border rounded-2xl p-3 text-center">
        <Users size={14} className="text-bk-muted mx-auto mb-1.5" />
        <p className="text-[28px] font-black font-mono text-bk-primary leading-none">
          #{order.queuePosition}
        </p>
        <p className="text-[10px] text-bk-muted mt-1.5">Posición en cola</p>
      </div>

      {/* ETA */}
      <div className="bg-bk-card border border-bk-border rounded-2xl p-3 text-center">
        <Clock size={14} className="text-bk-muted mx-auto mb-1.5" />
        <p className="text-[28px] font-black font-mono text-bk-text leading-none">
          ~{order.estimatedMinutes}'
        </p>
        <p className="text-[10px] text-bk-muted mt-1.5">Tiempo estimado</p>
      </div>
    </div>
  )
}
