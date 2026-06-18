import { useNavigate } from 'react-router-dom'
import { ChefHat, ArrowRight, Flame } from 'lucide-react'
import useUserStore from '@/store/userStore'
import BKGorilla    from '@/components/ui/BKGorilla'

export default function RoleSelectorPage() {
  const navigate        = useNavigate()
  const isAuthenticated = useUserStore((s) => s.isAuthenticated)

  function handleCustomer() {
    navigate(isAuthenticated ? '/customer/menu' : '/auth/login')
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.20) 0%, #080808 58%)',
      }}
    >
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="text-center mb-10">
        {/* Glow ring behind gorilla */}
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 rounded-full bg-bk-primary/20 blur-2xl scale-110" />
          <BKGorilla className="w-36 h-36 relative animate-gorilla-bob drop-shadow-[0_0_32px_rgba(255,107,0,0.4)]" />
        </div>

        <h1 className="text-[54px] font-black tracking-[-0.04em] leading-none">
          BANGKOK<span className="text-bk-primary">.</span>
        </h1>

        {/* "Fire on the Wok" tagline */}
        <div className="inline-flex items-center gap-2 mt-2 mb-1">
          <Flame size={12} className="text-bk-primary fill-bk-primary" />
          <span className="text-[12px] font-black uppercase tracking-[0.25em] text-bk-primary">
            Fire on the Wok
          </span>
          <Flame size={12} className="text-bk-primary fill-bk-primary" />
        </div>

        <p className="text-bk-muted text-[12px] mt-1.5 font-mono tracking-wide">
          Noodles · Arroz · Baos
        </p>
      </div>

      {/* ── Role cards ───────────────────────────────────────── */}
      <div className="w-full max-w-sm flex flex-col gap-3">

        {/* ── Cliente card (primary / orange) ─────────────── */}
        <button
          onClick={handleCustomer}
          className="group relative overflow-hidden w-full rounded-2xl
                     bg-bk-primary text-black p-5 text-left
                     transition-all duration-200 active:scale-[0.98]
                     hover:brightness-110 shadow-orange"
        >
          {/* Ghost gorilla watermark */}
          <div className="absolute -right-3 -bottom-3 opacity-15 pointer-events-none">
            <BKGorilla className="w-24 h-24" />
          </div>

          <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">
            Accede como
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[24px] font-black tracking-tight">Cliente</span>
            <ArrowRight
              size={20}
              className="translate-x-0 group-hover:translate-x-1 transition-transform"
            />
          </div>
          <p className="text-[11px] opacity-70 mt-1">
            Pide, sigue tu pedido y acumula sellos
          </p>
        </button>

        {/* ── Trabajador card (dark) ────────────────────── */}
        <button
          onClick={() => navigate('/worker/dashboard')}
          className="group relative overflow-hidden w-full rounded-2xl
                     bg-bk-card border border-bk-border text-bk-text p-5 text-left
                     transition-all duration-200 active:scale-[0.98]
                     hover:border-bk-border2"
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
            <ChefHat size={48} />
          </div>

          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-bk-muted mb-1">
            Accede como
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[24px] font-black tracking-tight">Trabajador</span>
            <ArrowRight
              size={20}
              className="text-bk-muted translate-x-0 group-hover:translate-x-1 transition-transform"
            />
          </div>
          <p className="text-[11px] text-bk-muted mt-1">
            Panel de cocina · Comandas en tiempo real
          </p>
        </button>
      </div>

      <p className="mt-10 text-[9px] text-bk-muted2 font-mono uppercase tracking-widest">
        Demo v2 · Bangkok Noodles & Bao
      </p>
    </div>
  )
}
