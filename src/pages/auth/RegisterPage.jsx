import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { User, Mail, Lock, UserPlus, Flame, Eye, EyeOff } from 'lucide-react'
import useUserStore from '@/store/userStore'
import BKGorilla    from '@/components/ui/BKGorilla'

export default function RegisterPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const register  = useUserStore((s) => s.register)

  // Pre-fill name if coming from GuestUpsellModal
  const prefillName = location.state?.prefill?.name ?? ''

  const [name,     setName]     = useState(prefillName)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPass, setShowPass] = useState(false)
  const [errors,   setErrors]   = useState({})   // { name?, email?, password?, confirm?, global? }
  const [loading,  setLoading]  = useState(false)

  function clearFieldError(field) {
    setErrors((prev) => { const next = { ...prev }; delete next[field]; delete next.global; return next })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = {}
    if (!name.trim())       e2.name     = 'El nombre es obligatorio'
    if (!email)             e2.email    = 'El email es obligatorio'
    if (!password)          e2.password = 'La contraseña es obligatoria'
    else if (password.length < 6) e2.password = 'Mínimo 6 caracteres'
    if (password && !confirm)           e2.confirm = 'Confirma tu contraseña'
    else if (password && password !== confirm) e2.confirm = 'Las contraseñas no coinciden'
    if (Object.keys(e2).length) { setErrors(e2); return }

    setErrors({})
    setLoading(true)
    const result = await register({ name: name.trim(), email, password })
    setLoading(false)
    if (result.error) { setErrors({ global: result.error }); return }
    navigate('/customer/menu', { replace: true })
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(255,107,0,0.12) 0%, #080808 55%)' }}
    >
      {/* ── Brand header ─────────────────────────────────── */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 rounded-full bg-bk-primary/15 blur-xl" />
          <BKGorilla className="w-[76px] h-[76px] relative animate-gorilla-bob" />
        </div>

        <h1 className="text-[40px] font-black tracking-[-0.04em] leading-none mb-1">
          BANGKOK<span className="text-bk-primary">.</span>
        </h1>
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <Flame size={10} className="text-bk-primary fill-bk-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-bk-primary">
            Fire on the Wok
          </span>
          <Flame size={10} className="text-bk-primary fill-bk-primary" />
        </div>
        <p className="text-bk-muted text-[12px]">Crea tu cuenta y empieza a acumular sellos</p>
      </div>

      {/* ── Loyalty teaser ───────────────────────────────── */}
      <div className="w-full max-w-sm bg-bk-primary/8 border border-bk-primary/20 rounded-2xl
                      px-4 py-3 mb-4 flex items-center gap-3">
        <BKGorilla className="w-10 h-10 flex-shrink-0" />
        <div>
          <p className="text-[12px] font-bold text-bk-primary">Tarjeta de fidelización</p>
          <p className="text-[11px] text-bk-muted">Completa 8 pedidos y gana un plato gratis</p>
        </div>
      </div>

      {/* ── Form ─────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">

        {/* Nombre */}
        <div>
          <label className="block text-[11px] font-semibold text-bk-muted uppercase tracking-wider mb-1.5">
            Nombre
          </label>
          <div className="relative">
            <User size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none
                                        ${errors.name ? 'text-red-400' : 'text-bk-muted'}`} />
            <input
              type="text" value={name}
              onChange={(e) => { setName(e.target.value); clearFieldError('name') }}
              placeholder="Tu nombre" autoComplete="name"
              className={`w-full bg-bk-card rounded-xl pl-9 pr-4 py-3
                          text-[13px] text-bk-text placeholder:text-bk-muted2
                          focus:outline-none transition-colors border
                          ${errors.name
                            ? 'border-red-500/60 focus:border-red-500'
                            : 'border-bk-border focus:border-bk-primary'}`}
            />
          </div>
          {errors.name && <p className="text-[11px] text-red-400 mt-1.5 ml-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[11px] font-semibold text-bk-muted uppercase tracking-wider mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none
                                        ${errors.email ? 'text-red-400' : 'text-bk-muted'}`} />
            <input
              type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); clearFieldError('email') }}
              placeholder="tu@email.com" autoComplete="email"
              className={`w-full bg-bk-card rounded-xl pl-9 pr-4 py-3
                          text-[13px] text-bk-text placeholder:text-bk-muted2
                          focus:outline-none transition-colors border
                          ${errors.email
                            ? 'border-red-500/60 focus:border-red-500'
                            : 'border-bk-border focus:border-bk-primary'}`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-red-400 mt-1.5 ml-1">{errors.email}</p>}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-[11px] font-semibold text-bk-muted uppercase tracking-wider mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <Lock size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none
                                        ${errors.password ? 'text-red-400' : 'text-bk-muted'}`} />
            <input
              type={showPass ? 'text' : 'password'} value={password}
              onChange={(e) => { setPassword(e.target.value); clearFieldError('password') }}
              placeholder="Mínimo 6 caracteres" autoComplete="new-password"
              className={`w-full bg-bk-card rounded-xl pl-9 pr-10 py-3
                          text-[13px] text-bk-text placeholder:text-bk-muted2
                          focus:outline-none transition-colors border
                          ${errors.password
                            ? 'border-red-500/60 focus:border-red-500'
                            : 'border-bk-border focus:border-bk-primary'}`}
            />
            <button
              type="button" onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bk-muted hover:text-bk-text transition-colors"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-red-400 mt-1.5 ml-1">{errors.password}</p>}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label className="block text-[11px] font-semibold text-bk-muted uppercase tracking-wider mb-1.5">
            Confirmar contraseña
          </label>
          <div className="relative">
            <Lock size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none
                                        ${errors.confirm ? 'text-red-400' : 'text-bk-muted'}`} />
            <input
              type={showPass ? 'text' : 'password'} value={confirm}
              onChange={(e) => { setConfirm(e.target.value); clearFieldError('confirm') }}
              placeholder="Repite tu contraseña" autoComplete="new-password"
              className={`w-full bg-bk-card rounded-xl pl-9 pr-4 py-3
                          text-[13px] text-bk-text placeholder:text-bk-muted2
                          focus:outline-none transition-colors border
                          ${errors.confirm
                            ? 'border-red-500/60 focus:border-red-500'
                            : 'border-bk-border focus:border-bk-primary'}`}
            />
          </div>
          {errors.confirm && <p className="text-[11px] text-red-400 mt-1.5 ml-1">{errors.confirm}</p>}
        </div>

        {/* Global error (email ya registrado, etc.) */}
        {errors.global && (
          <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20
                          rounded-xl px-4 py-3 text-[12px] text-red-400 animate-fade-in">
            <svg viewBox="0 0 16 16" className="w-4 h-4 flex-shrink-0" fill="currentColor">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
            {errors.global}
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-bk-primary text-black font-black text-[14px]
                     tracking-wide transition-all active:scale-[0.98] shadow-orange
                     hover:brightness-110 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
        >
          {loading
            ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            : <><UserPlus size={16} /> Crear cuenta</>
          }
        </button>

        <p className="text-center text-[12px] text-bk-muted pt-2">
          ¿Ya tienes cuenta?{' '}
          <Link to="/auth/login" className="text-bk-primary font-bold hover:underline">Iniciar sesión</Link>
        </p>
        <p className="text-center text-[11px] text-bk-muted2 pt-1">
          <Link to="/" className="hover:text-bk-muted transition-colors">← Volver al inicio</Link>
        </p>
      </form>
    </div>
  )
}
