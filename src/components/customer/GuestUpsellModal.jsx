import { useNavigate } from 'react-router-dom'
import { Gift, Star, Clock, X } from 'lucide-react'
import useUIStore   from '@/store/uiStore'
import useUserStore from '@/store/userStore'
import BKGorilla    from '@/components/ui/BKGorilla'

const BENEFITS = [
  {
    icon: Gift,
    color: 'text-bk-primary',
    bg:    'bg-bk-primary/10 border-bk-primary/20',
    title: 'Tarjeta de sellos',
    desc:  '8 pedidos = 1 plato gratis. Se acumulan automáticamente.',
  },
  {
    icon: Clock,
    color: 'text-blue-400',
    bg:    'bg-blue-500/10 border-blue-500/20',
    title: 'Historial de pedidos',
    desc:  'Repite tus favoritos en un toque.',
  },
  {
    icon: Star,
    color: 'text-yellow-400',
    bg:    'bg-yellow-500/10 border-yellow-500/20',
    title: 'Ofertas exclusivas',
    desc:  'Acceso a descuentos y promociones para miembros.',
  },
]

export default function GuestUpsellModal() {
  const navigate        = useNavigate()
  const closeGuestUpsell = useUIStore((s) => s.closeGuestUpsell)
  const exitGuestMode    = useUserStore((s) => s.exitGuestMode)
  const guestContact     = useUserStore((s) => s.guestContact)

  function handleRegister() {
    closeGuestUpsell()
    exitGuestMode()
    // Pass guest's name to pre-fill the register form
    navigate('/auth/register', { state: { prefill: { name: guestContact?.name ?? '' } } })
  }

  function handleDismiss() {
    closeGuestUpsell()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/75 backdrop-blur-sm">
      <div className="w-full bg-bk-card border-t border-bk-border rounded-t-3xl
                      animate-slide-up p-5 pb-8 md:max-w-md md:mx-auto md:mb-8
                      md:rounded-3xl md:border">

        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-bk-card2
                     text-bk-muted transition-colors"
        >
          <X size={16} />
        </button>

        {/* Gorilla + header */}
        <div className="flex flex-col items-center text-center mb-5">
          <BKGorilla className="w-16 h-16 mb-3 animate-gorilla-bob" />

          <h2 className="text-[18px] font-black tracking-tight">
            ¡Únete a Bangkok<span className="text-bk-primary">.</span>
          </h2>
          <p className="text-[12px] text-bk-muted mt-1 max-w-[240px] leading-relaxed">
            Crea una cuenta gratis y empieza a acumular beneficios desde tu próximo pedido.
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-5">
          {BENEFITS.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title}
                 className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 ${bg}`}>
              <div className={`mt-0.5 flex-shrink-0 ${color}`}>
                <Icon size={15} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-bk-text">{title}</p>
                <p className="text-[11px] text-bk-muted mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <button
          onClick={handleRegister}
          className="w-full py-3.5 rounded-2xl bg-bk-primary text-black font-black
                     text-[14px] shadow-orange active:scale-[0.97] transition-transform mb-2.5"
        >
          Crear cuenta gratis 🦍
        </button>
        <button
          onClick={handleDismiss}
          className="w-full py-2.5 rounded-2xl text-[12px] font-semibold text-bk-muted
                     hover:text-bk-text transition-colors"
        >
          No gracias, seguir como invitado
        </button>
      </div>
    </div>
  )
}
