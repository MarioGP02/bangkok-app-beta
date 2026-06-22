import { Outlet, useNavigate } from 'react-router-dom'
import { ChefHat, LogOut } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import { useState, useEffect } from 'react'
import useUserStore from '@/store/userStore'

export default function WorkerLayout() {
  const [time, setTime]  = useState(formatTime())
  const navigate         = useNavigate()
  const logout           = useUserStore((s) => s.logout)

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-bk-bg flex flex-col overflow-x-hidden w-full">

      {/* ── Topbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between
                         px-6 h-14 border-b border-bk-border
                         bg-bk-bg/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <ChefHat size={18} className="text-bk-primary" />
          <span className="text-base font-black tracking-tighter">
            BANGKOK<span className="text-bk-primary">.</span>
          </span>
          <span className="text-xs text-bk-muted border-l border-bk-border pl-3">
            Panel de Cocina
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
            <span className="text-[11px] text-bk-muted font-mono">En línea · {time}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[11px] text-bk-muted
                       hover:text-bk-text transition-colors"
          >
            <LogOut size={13} />
            Salir
          </button>
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
