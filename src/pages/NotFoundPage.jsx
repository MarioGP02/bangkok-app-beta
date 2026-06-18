import { useNavigate } from 'react-router-dom'
import { Flame }       from 'lucide-react'
import BKGorilla       from '@/components/ui/BKGorilla'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(255,107,0,0.10) 0%, #080808 55%)' }}
    >
      {/* Gorilla */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-bk-primary/10 blur-2xl" />
        <BKGorilla className="w-28 h-28 relative opacity-80 animate-gorilla-sway" />
        <span className="absolute -bottom-1 -right-2 text-[26px] select-none">🤔</span>
      </div>

      {/* 404 */}
      <p className="text-[80px] font-black leading-none tracking-[-0.04em]
                    text-transparent bg-clip-text
                    bg-gradient-to-b from-bk-text to-bk-muted2 mb-1 select-none">
        404
      </p>

      <h1 className="text-[22px] font-black tracking-tight mb-2">
        Página no encontrada
      </h1>
      <p className="text-[13px] text-bk-muted max-w-[260px] leading-relaxed mb-8">
        El gorila ha buscado por todo el wok y no ha encontrado lo que pediste.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-[220px]">
        <button
          onClick={() => navigate('/customer/menu')}
          className="flex items-center justify-center gap-2 w-full
                     py-3 rounded-2xl bg-bk-primary text-black font-black text-[14px]
                     active:scale-[0.98] transition-transform shadow-orange hover:brightness-110"
        >
          <Flame size={15} fill="currentColor" />
          Ver la carta
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 rounded-2xl border border-bk-border
                     text-[13px] font-semibold text-bk-muted
                     hover:border-bk-border2 hover:text-bk-text transition-colors"
        >
          ← Volver atrás
        </button>
      </div>
    </div>
  )
}
