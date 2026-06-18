import { useState, useEffect }  from 'react'
import { useNavigate }           from 'react-router-dom'
import {
  ArrowLeft, CreditCard, Smartphone, Banknote,
  Flame, ShieldCheck, Package, Utensils,
  MessageSquare, User, Phone,
} from 'lucide-react'
import useCartStore   from '@/store/cartStore'
import useOrderStore  from '@/store/orderStore'
import useUserStore   from '@/store/userStore'
import useUIStore     from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'

// ─── Config ──────────────────────────────────────────────────────────────────
const DELIVERY_OPTIONS = [
  { id: 'llevar', label: 'Para llevar', Icon: Package  },
  { id: 'local',  label: 'En local',   Icon: Utensils },
]

const PAY_METHODS = [
  { id: 'card',  Icon: CreditCard, label: 'Tarjeta'  },
  { id: 'bizum', Icon: Smartphone, label: 'Bizum'    },
  { id: 'cash',  Icon: Banknote,   label: 'Efectivo' },
]

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={14} className="text-bk-primary" />}
        <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-bk-muted">{title}</h3>
      </div>
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate()

  // ── Stores ──────────────────────────────────────────────────────────────────
  const { lines, snapshot, subtotal, tax, total } = useCartStore((s) => s.getSummary())
  const clear             = useCartStore((s) => s.clear)
  const createOrder     = useOrderStore((s) => s.createOrder)
  const addStamp        = useUserStore((s) => s.addStamp)
  const guestMode       = useUserStore((s) => s.guestMode)
  const user            = useUserStore((s) => s.user)
  const setGuestContact = useUserStore((s) => s.setGuestContact)
  const openGuestUpsell   = useUIStore((s) => s.openGuestUpsell)

  // ── Guard: empty cart ────────────────────────────────────────────────────────
  useEffect(() => {
    if (lines.length === 0) navigate('/customer/menu', { replace: true })
  }, [lines.length, navigate])

  // ── Form state ───────────────────────────────────────────────────────────────
  const [name,      setName]      = useState(user?.name ?? '')
  const [phone,     setPhone]     = useState('')
  const [delivery,  setDelivery]  = useState('llevar')
  const [notes,     setNotes]     = useState('')
  const [payMethod, setPayMethod] = useState('card')
  const [loading,   setLoading]   = useState(false)
  const [errors,    setErrors]    = useState({})

  function clearErr(field) {
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  // ── Validation ───────────────────────────────────────────────────────────────
  function validate() {
    const e = {}
    if (guestMode && !name.trim())  e.name = 'El nombre es obligatorio'
    const needsPhone = guestMode || payMethod === 'bizum'
    if (needsPhone && !phone.trim()) {
      e.phone = payMethod === 'bizum' ? 'Introduce tu número de Bizum' : 'El teléfono es obligatorio'
    }
    if (needsPhone && phone.trim() && !/^\+?[\d\s\-]{7,15}$/.test(phone.trim())) {
      e.phone = 'Introduce un teléfono válido'
    }
    return e
  }

  // ── Confirm ──────────────────────────────────────────────────────────────────
  async function handleConfirm() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)

    const METHOD_LABEL   = { card: 'Tarjeta', bizum: 'Bizum', cash: 'Efectivo' }
    const DELIVERY_LABEL = { llevar: 'Para llevar', local: 'En local' }
    const payLast4 = payMethod === 'card'  ? '4242'
                   : payMethod === 'bizum' ? phone.trim().slice(-4)
                   : ''

    await createOrder({
      customerId:   guestMode ? null : (user?.id ?? null),
      customerName: guestMode ? (name.trim() || 'Invitado') : (user?.name ?? 'Cliente'),
      table:    DELIVERY_LABEL[delivery],
      items:    snapshot,
      notes:    notes.trim() || undefined,
      subtotal, tax, total,
      payMethod: METHOD_LABEL[payMethod],
      payLast4,
    })

    if (guestMode) {
      setGuestContact({ name: name.trim(), phone: phone.trim() })
    } else {
      await addStamp()
    }

    clear()
    navigate('/customer/tracking', { replace: true })
    if (guestMode) setTimeout(() => openGuestUpsell(), 1200)
  }

  if (lines.length === 0) return null

  // ── Derived ──────────────────────────────────────────────────────────────────
  const displayName = guestMode ? name : (user?.name ?? '')

  return (
    <div className="animate-fade-in">

      {/* ── Sticky page header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3.5
                      bg-bk-bg/95 backdrop-blur-sm border-b border-bk-border">
        <button
          onClick={() => navigate('/customer/cart')}
          className="p-2 -ml-1 rounded-xl text-bk-muted hover:text-bk-text
                     hover:bg-bk-card transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-[16px] font-black tracking-tight leading-none">Confirmar pedido</h2>
          <p className="text-[10px] text-bk-muted mt-0.5">{lines.length} artículo{lines.length !== 1 ? 's' : ''} · {formatPrice(total)}</p>
        </div>
        <div className="bg-bk-primary/10 border border-bk-primary/25 rounded-xl
                        px-3 py-1.5 text-[13px] font-black text-bk-primary tabular-nums">
          {formatPrice(total)}
        </div>
      </div>

      {/* ── Two-column desktop layout ──────────────────────────────────────── */}
      <div className="md:grid md:grid-cols-[1fr_300px] md:gap-6 md:items-start md:p-5 md:pt-4">

        {/* ══ LEFT COLUMN ════════════════════════════════════════════════════ */}
        <div className="px-4 pt-4 md:px-0 md:pt-0 space-y-1">

          {/* Tu pedido ─────────────────────────────────────────────────────── */}
          <Section title="Tu pedido" icon={Package}>
            <div className="bg-bk-card border border-bk-border rounded-2xl overflow-hidden">
              {lines.map((line, i) => (
                <div
                  key={line.lineId}
                  className={`flex items-start gap-3 px-4 py-3
                              ${i < lines.length - 1 ? 'border-b border-bk-border' : ''}`}
                >
                  {/* Qty badge */}
                  <span className="w-6 h-6 rounded-lg bg-bk-primary/10 border border-bk-primary/20
                                   flex items-center justify-center text-[10px] font-black
                                   text-bk-primary flex-shrink-0 mt-0.5">
                    {line.quantity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold leading-snug truncate">{line.item.name}</p>
                    {snapshot[i]?.notes && (
                      <p className="text-[10px] text-bk-muted mt-0.5 truncate">{snapshot[i].notes}</p>
                    )}
                  </div>
                  <p className="text-[13px] font-bold text-bk-primary flex-shrink-0 tabular-nums">
                    {formatPrice(snapshot[i]?.price ?? 0)}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* Datos de contacto (solo modo invitado) ────────────────────────── */}
          {guestMode && (
            <Section title="Tus datos" icon={User}>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-bk-muted uppercase tracking-wider mb-1.5">
                    Nombre
                  </label>
                  <div className="relative">
                    <User size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none
                                                ${errors.name ? 'text-red-400' : 'text-bk-muted'}`} />
                    <input
                      type="text" value={name}
                      onChange={(e) => { setName(e.target.value); clearErr('name') }}
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

                <div>
                  <label className="block text-[11px] font-semibold text-bk-muted uppercase tracking-wider mb-1.5">
                    Teléfono de contacto
                  </label>
                  <div className="relative">
                    <Phone size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none
                                                  ${errors.phone ? 'text-red-400' : 'text-bk-muted'}`} />
                    <input
                      type="tel" value={phone}
                      onChange={(e) => { setPhone(e.target.value); clearErr('phone') }}
                      placeholder="ej. 612 345 678" autoComplete="tel" inputMode="tel"
                      className={`w-full bg-bk-card rounded-xl pl-9 pr-4 py-3
                                  text-[13px] text-bk-text placeholder:text-bk-muted2
                                  focus:outline-none transition-colors border
                                  ${errors.phone
                                    ? 'border-red-500/60 focus:border-red-500'
                                    : 'border-bk-border focus:border-bk-primary'}`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1.5 ml-1">{errors.phone}</p>}
                </div>
              </div>
            </Section>
          )}

          {/* Teléfono para Bizum (usuario autenticado) ─────────────────────── */}
          {!guestMode && payMethod === 'bizum' && (
            <Section title="Número Bizum" icon={Smartphone}>
              <div className="relative">
                <Phone size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none
                                              ${errors.phone ? 'text-red-400' : 'text-bk-muted'}`} />
                <input
                  type="tel" value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearErr('phone') }}
                  placeholder="ej. 612 345 678" autoComplete="tel" inputMode="tel"
                  className={`w-full bg-bk-card rounded-xl pl-9 pr-4 py-3
                              text-[13px] text-bk-text placeholder:text-bk-muted2
                              focus:outline-none transition-colors border
                              ${errors.phone
                                ? 'border-red-500/60 focus:border-red-500'
                                : 'border-bk-border focus:border-bk-primary'}`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-red-400 mt-1.5 ml-1">{errors.phone}</p>}
            </Section>
          )}

          {/* Entrega ────────────────────────────────────────────────────────── */}
          <Section title="Entrega" icon={Package}>
            <div className="grid grid-cols-2 gap-2.5">
              {DELIVERY_OPTIONS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDelivery(id)}
                  className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl border
                              transition-all text-[13px] font-bold
                              ${delivery === id
                                ? 'bg-bk-primary/10 border-bk-primary/50 text-bk-primary shadow-orange'
                                : 'bg-bk-card border-bk-border text-bk-muted hover:border-bk-border2 hover:text-bk-text'
                              }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </Section>

          {/* Notas para cocina ─────────────────────────────────────────────── */}
          <Section title="Notas para cocina" icon={MessageSquare}>
            <div className="relative">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alergias, preferencias, peticiones especiales… (opcional)"
                rows={3}
                maxLength={200}
                className="w-full bg-bk-card border border-bk-border rounded-xl px-4 py-3
                           text-[13px] text-bk-text placeholder:text-bk-muted2
                           focus:outline-none focus:border-bk-primary transition-colors
                           resize-none no-scroll"
              />
              <span className="absolute bottom-2.5 right-3 text-[9px] text-bk-muted2 tabular-nums">
                {notes.length}/200
              </span>
            </div>
          </Section>

          {/* Método de pago ─────────────────────────────────────────────────── */}
          <Section title="Método de pago" icon={CreditCard}>
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {PAY_METHODS.map(({ id, Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setPayMethod(id); setPhone(''); setErrors({}) }}
                  className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border
                              transition-all text-[11px] font-bold
                              ${payMethod === id
                                ? 'bg-bk-primary/10 border-bk-primary/50 text-bk-primary shadow-orange'
                                : 'bg-bk-card border-bk-border text-bk-muted hover:border-bk-border2 hover:text-bk-text'
                              }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>

            {/* Tarjeta visual */}
            {payMethod === 'card' && (
              <div className="credit-card mb-1">
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="w-9 h-6 rounded bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-90" />
                  <span className="font-mono text-[11px] text-white/30 uppercase tracking-widest">Visa</span>
                </div>
                <p className="font-mono text-[15px] tracking-[0.18em] text-white/75 mb-4 relative z-10">
                  •••• •••• •••• 4242
                </p>
                <div className="flex justify-between relative z-10">
                  <div>
                    <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Titular</p>
                    <p className="font-mono text-[11px] text-white/60">
                      {displayName ? displayName.toUpperCase() : 'NOMBRE TITULAR'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Vence</p>
                    <p className="font-mono text-[11px] text-white/60">12/27</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bizum info */}
            {payMethod === 'bizum' && (
              <div className="flex gap-3 bg-blue-500/6 border border-blue-500/20 rounded-xl px-3.5 py-3">
                <Smartphone size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-bold text-blue-300 mb-0.5">Pago por Bizum</p>
                  <p className="text-[10px] text-bk-muted leading-relaxed">
                    Recibirás una solicitud de cobro en tu app bancaria al número indicado.
                    Confirma desde tu móvil para completar el pedido.
                  </p>
                </div>
              </div>
            )}

            {/* Efectivo info */}
            {payMethod === 'cash' && (
              <div className="flex gap-3 bg-green-500/6 border border-green-500/20 rounded-xl px-3.5 py-3">
                <Banknote size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-bold text-green-300 mb-0.5">Pago en efectivo</p>
                  <p className="text-[10px] text-bk-muted leading-relaxed">
                    Paga en caja al recoger tu pedido. Ten el importe exacto si es posible.
                  </p>
                  <p className="text-[12px] font-black text-green-300 mt-1.5">{formatPrice(total)}</p>
                </div>
              </div>
            )}
          </Section>

        </div>

        {/* ══ RIGHT COLUMN (desktop sticky) / Bottom (mobile) ════════════════ */}
        <div className="px-4 pb-6 md:px-0 md:pb-0 md:sticky md:top-[68px]">

          {/* Resumen de costes */}
          <div className="bg-bk-card border border-bk-border rounded-2xl p-4 mb-3">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-bk-muted mb-3">Resumen</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[12px] text-bk-muted">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[12px] text-bk-muted">
                <span>IVA (10%)</span>
                <span className="tabular-nums">{formatPrice(tax)}</span>
              </div>
              <div className="h-px bg-bk-border" />
              <div className="flex justify-between items-baseline">
                <span className="text-[14px] font-black">Total</span>
                <span className="text-[20px] font-black text-bk-primary tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/15
                          rounded-xl px-3 py-2.5 mb-4">
            <ShieldCheck size={13} className="text-green-400 flex-shrink-0" />
            <p className="text-[10px] text-bk-muted">
              Pago seguro procesado por <strong className="text-bk-muted2">Stripe</strong>.
              Nunca almacenamos datos de pago.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-bk-primary text-black font-black text-[15px]
                       tracking-tight flex items-center justify-center gap-2
                       active:scale-[0.98] transition-all shadow-orange hover:brightness-110
                       disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Procesando…
              </>
            ) : (
              <>
                <Flame size={16} fill="currentColor" />
                {payMethod === 'cash' ? 'Confirmar pedido' : `Pagar ${formatPrice(total)}`}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
