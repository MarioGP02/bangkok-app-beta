import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Flame, Zap, UtensilsCrossed } from 'lucide-react'
import useUserStore from '@/store/userStore'
import BKGorilla    from '@/components/ui/BKGorilla'

const PERKS = [
  { icon: '🍜', label: 'Carta completa',    desc: 'Todos los platos disponibles' },
  { icon: '⚡', label: 'Sin registro',      desc: 'Empieza a pedir al instante'  },
  { icon: '🔥', label: 'Personaliza',       desc: 'Ajusta cada plato a tu gusto' },
]

export default function QRLandingPage() {
  const navigate        = useNavigate()
  const enterGuestMode  = useUserStore((s) => s.enterGuestMode)
  const isAuthenticated = useUserStore((s) => s.isAuthenticated)

  // Already logged-in users go straight to menu
  useEffect(() => {
    if (isAuthenticated) navigate('/customer/menu', { replace: true })
  }, [isAuthenticated, navigate])

  function handleEnter() {
    enterGuestMode()
    navigate('/customer/menu', { replace: true })
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.16) 0%, #080808 55%)' }}
    >
      {/* ── Gorilla hero ───────────────────────────────── */}
      <div className="relative mb-5">
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full border border-bk-primary/25 scale-125 animate-ping opacity-40" />
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-bk-primary/20 blur-2xl scale-110" />
        <BKGorilla className="w-28 h-28 relative animate-gorilla-bob
                              drop-shadow-[0_0_28px_rgba(255,107,0,0.4)]" />
      </div>

      {/* ── Brand ──────────────────────────────────────── */}
      <h1 className="text-[46px] font-black tracking-[-0.04em] leading-none mb-1">
        BANGKOK<span className="text-bk-primary">.</span>
      </h1>
      <div className="flex items-center justify-center gap-1.5 mb-2">
        <Flame size={11} className="text-bk-primary fill-bk-primary" />
        <span className="text-[11px] font-black uppercase tracking-[0.22em] text-bk-primary">
          Fire on the Wok
        </span>
        <Flame size={11} className="text-bk-primary fill-bk-primary" />
      </div>
      <p className="text-[12px] text-bk-muted max-w-[260px] mx-auto leading-relaxed mb-7">
        Bienvenido. Puedes pedir directamente sin registrarte.
      </p>

      {/* ── Divider ────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5 w-full max-w-xs">
        <div className="flex-1 h-px bg-bk-border" />
        <span className="text-[9px] text-bk-muted2 font-mono uppercase tracking-widest">
          Modo invitado
        </span>
        <div className="flex-1 h-px bg-bk-border" />
      </div>

      {/* ── Perks ──────────────────────────────────────── */}
      <div className="w-full max-w-xs mb-7 flex flex-col gap-2">
        {PERKS.map(({ icon, label, desc }) => (
          <div
            key={label}
            className="flex items-center gap-3.5 bg-bk-card border border-bk-border
                       rounded-xl px-4 py-3 text-left"
          >
            <span className="text-[20px] flex-shrink-0">{icon}</span>
            <div>
              <p className="text-[12px] font-bold text-bk-text">{label}</p>
              <p className="text-[10px] text-bk-muted mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA ────────────────────────────────────────── */}
      <button
        onClick={handleEnter}
        className="w-full max-w-xs py-4 rounded-2xl bg-bk-primary text-black
                   font-black text-[15px] tracking-tight shadow-orange
                   active:scale-[0.97] transition-transform hover:brightness-110
                   flex items-center justify-center gap-2"
      >
        <Zap size={16} fill="currentColor" />
        Empezar a pedir
      </button>

      {/* ── Auth link ──────────────────────────────────── */}
      <p className="mt-5 text-[12px] text-bk-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/auth/login" className="text-bk-primary font-semibold hover:underline">
          Iniciar sesión
        </Link>
      </p>

      <div className="mt-8 flex items-center gap-1.5 text-[9px] text-bk-muted2 font-mono">
        <UtensilsCrossed size={9} />
        Bangkok Noodles & Bao
      </div>
    </div>
  )
}
