import { useEffect, useState } from 'react'
import { Gift, LogOut, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useUserStore, { STAMPS_REQUIRED } from '@/store/userStore'

/** Single stamp slot */
function Stamp({ filled, index }) {
  return (
    <div
      className={`w-full aspect-square rounded-2xl border-2 flex flex-col items-center
                  justify-center transition-all duration-500
                  ${filled
                    ? 'border-bk-primary bg-bk-primary/15 scale-100'
                    : 'border-bk-border2 bg-bk-card2 scale-95 opacity-50'
                  }`}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      {filled ? (
        <svg viewBox="0 0 40 40" className="w-7 h-7">
          {/* Simplified gorilla head */}
          <circle cx="20" cy="22" r="13" fill="#1a1a1a"/>
          <ellipse cx="20" cy="26" rx="7" ry="5" fill="#252525"/>
          <circle cx="16" cy="19" r="3" fill="white"/>
          <circle cx="24" cy="19" r="3" fill="white"/>
          <circle cx="16.8" cy="19.5" r="1.8" fill="#111"/>
          <circle cx="24.8" cy="19.5" r="1.8" fill="#111"/>
          <ellipse cx="13" cy="21" r="4" fill="#1a1a1a"/>
          <ellipse cx="27" cy="21" r="4" fill="#1a1a1a"/>
          {/* Hat */}
          <path d="M8 17 Q20 6 32 17 L32 20 Q20 10 8 20Z" fill="#ff6b00"/>
          <rect x="7" y="17" width="26" height="5" rx="2.5" fill="#ff6b00"/>
          <rect x="7" y="20" width="26" height="2" rx="1" fill="#cc5500"/>
        </svg>
      ) : (
        <span className="text-[9px] font-bold text-bk-muted2 font-mono">{index + 1}</span>
      )}
    </div>
  )
}

export default function LoyaltyPage() {
  const navigate  = useNavigate()
  const user      = useUserStore((s) => s.user)
  const logout    = useUserStore((s) => s.logout)
  const pendingReward    = useUserStore((s) => s.pendingReward)
  const clearPendingReward = useUserStore((s) => s.clearPendingReward)
  const [showReward, setShowReward] = useState(false)

  useEffect(() => {
    if (pendingReward) {
      setShowReward(true)
      clearPendingReward()
    }
  }, [pendingReward, clearPendingReward])

  if (!user) return null

  const stamps     = user.stamps ?? 0
  const remaining  = STAMPS_REQUIRED - stamps
  const pct        = Math.round((stamps / STAMPS_REQUIRED) * 100)

  return (
    <div className="px-4 py-5 animate-fade-in">

      {/* User header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[11px] text-bk-muted uppercase tracking-wider">Hola,</p>
          <p className="text-[18px] font-black tracking-tight">{user.name} 👋</p>
        </div>
        <button
          onClick={() => { logout(); navigate('/') }}
          className="flex items-center gap-1.5 text-[11px] text-bk-muted hover:text-red-400
                     transition-colors px-3 py-1.5 rounded-lg border border-bk-border
                     hover:border-red-500/30"
        >
          <LogOut size={12} />
          Salir
        </button>
      </div>

      {/* Loyalty card */}
      <div className="bg-gradient-to-br from-bk-card to-bk-card2 border border-bk-border
                      rounded-3xl p-5 mb-4 overflow-hidden relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ff6b00 0, #ff6b00 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

        {/* Card header */}
        <div className="flex items-center justify-between mb-4 relative">
          <div>
            <p className="text-[10px] text-bk-muted uppercase tracking-widest">Tarjeta de fidelización</p>
            <p className="text-[16px] font-black tracking-tight">BANGKOK<span className="text-bk-primary">.</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-bk-muted">Pedidos</p>
            <p className="text-[20px] font-black text-bk-primary leading-none">{user.completedOrders ?? 0}</p>
          </div>
        </div>

        {/* Stamp grid */}
        <div className="grid grid-cols-4 gap-2.5 mb-4">
          {Array.from({ length: STAMPS_REQUIRED }).map((_, i) => (
            <Stamp key={i} filled={i < stamps} index={i} />
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-bk-bg/50 rounded-full h-2 overflow-hidden mb-2">
          <div
            className="h-full bg-bk-primary rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-bk-muted">
            {stamps > 0 ? `${stamps} / ${STAMPS_REQUIRED} sellos` : `Haz tu primer pedido`}
          </p>
          {remaining > 0 ? (
            <p className="text-[10px] text-bk-primary font-semibold">
              {remaining} para el regalo
            </p>
          ) : null}
        </div>
      </div>

      {/* Reward info */}
      <div className="bg-bk-primary/8 border border-bk-primary/20 rounded-2xl p-4 mb-4
                      flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-bk-primary/15 border border-bk-primary/25
                        flex items-center justify-center flex-shrink-0">
          <Gift size={18} className="text-bk-primary" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-bk-text">Plato gratis al completar</p>
          <p className="text-[11px] text-bk-muted mt-0.5">
            Cualquier noodle o arroz de la carta. Sin mínimo.
          </p>
        </div>
      </div>

      {/* Rewards claimed */}
      {(user.rewardsClaimed ?? 0) > 0 && (
        <div className="bg-bk-card border border-bk-border rounded-2xl p-4 flex items-center gap-3">
          <Trophy size={16} className="text-yellow-400 flex-shrink-0" />
          <p className="text-[12px] text-bk-muted">
            Has conseguido <span className="text-yellow-400 font-bold">{user.rewardsClaimed} regalo{user.rewardsClaimed > 1 ? 's' : ''}</span> hasta ahora. ¡Sigue así!
          </p>
        </div>
      )}

      {/* Reward popup */}
      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
             onClick={() => setShowReward(false)}>
          <div className="bg-bk-card border border-bk-primary/40 rounded-3xl p-8 mx-6 text-center
                          animate-slide-up shadow-orange"
               onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-2xl font-black mb-2">¡Tarjeta completada!</h2>
            <p className="text-bk-muted text-[14px] mb-6">
              ¡Enhorabuena! Has ganado un <span className="text-bk-primary font-bold">plato gratis</span>. Muéstraselo al trabajador.
            </p>
            <button
              onClick={() => setShowReward(false)}
              className="w-full py-3 rounded-2xl bg-bk-primary text-black font-black text-[14px]"
            >
              ¡Genial, gracias! 🦍
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
