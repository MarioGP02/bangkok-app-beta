import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ShieldCheck, CreditCard, User, Smartphone, Banknote, Flame } from 'lucide-react'
import useUIStore    from '@/store/uiStore'
import useCartStore  from '@/store/cartStore'
import useOrderStore from '@/store/orderStore'
import useUserStore  from '@/store/userStore'
import Input  from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

const DELIVERY_OPTIONS = ['A domicilio', 'Para llevar']

const PAY_METHODS = [
  { id: 'card',  Icon: CreditCard, label: 'Tarjeta' },
  { id: 'bizum', Icon: Smartphone,  label: 'Bizum' },
  { id: 'cash',  Icon: Banknote,    label: 'Efectivo' },
]

export default function PaymentModal() {
  const closePayment    = useUIStore((s) => s.closePayment)
  const openGuestUpsell = useUIStore((s) => s.openGuestUpsell)
  const { total, tax, subtotal, snapshot } = useCartStore((s) => s.getSummary())
  const clear           = useCartStore((s) => s.clear)
  const createOrder = useOrderStore((s) => s.createOrder)
  const addStamp    = useUserStore((s) => s.addStamp)
  const guestMode          = useUserStore((s) => s.guestMode)
  const user               = useUserStore((s) => s.user)
  const setGuestContact    = useUserStore((s) => s.setGuestContact)
  const navigate        = useNavigate()

  // Pre-fill name for authenticated users
  const [name,      setName]      = useState(user?.name ?? '')
  const [phone,     setPhone]     = useState('')
  const [table,     setTable]     = useState('A domicilio')
  const [payMethod, setPayMethod] = useState('card')
  const [loading,   setLoading]   = useState(false)
  const [errors,    setErrors]    = useState({})

  // ─── Validation ────────────────────────────────────────────────────────────
  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'El nombre es obligatorio'

    const needsPhone = guestMode || payMethod === 'bizum'
    if (needsPhone && !phone.trim()) {
      e.phone = payMethod === 'bizum'
        ? 'Introduce tu número de Bizum'
        : 'El teléfono es obligatorio'
    }
    if (needsPhone && phone.trim() && !/^\+?[\d\s\-]{7,15}$/.test(phone.trim())) {
      e.phone = 'Introduce un teléfono válido'
    }
    return e
  }

  // ─── Submit ────────────────────────────────────────────────────────────────
  async function handlePay() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    const methodLabel = { card: 'Tarjeta', bizum: 'Bizum', cash: 'Efectivo' }
    const payLast4    = payMethod === 'card'
      ? '4242'
      : payMethod === 'bizum'
        ? phone.trim().slice(-4)
        : ''

    await createOrder({
      customerId:   guestMode ? null : (user?.id ?? null),
      customerName: name.trim(),
      table,
      items:    snapshot,
      subtotal,
      tax,
      total,
      payMethod: methodLabel[payMethod],
      payLast4,
    })

    if (guestMode) {
      setGuestContact({ name: name.trim(), phone: phone.trim() })
    } else {
      await addStamp()
    }

    clear()
    closePayment()
    navigate('/customer/tracking')

    if (guestMode) {
      setTimeout(() => openGuestUpsell(), 1200)
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-end"
      onClick={(e) => { if (e.target === e.currentTarget) closePayment() }}
    >
      <div className="w-full bg-bk-card rounded-t-3xl border-t border-bk-border
                      animate-slide-up max-h-[90%] overflow-y-auto no-scroll p-5 pb-8">

        {/* Handle + close */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-1 rounded-full bg-bk-border2 mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
          <div>
            <h2 className="text-lg font-black tracking-tight">Confirmar pago</h2>
            <p className="text-[11px] text-bk-muted mt-0.5">
              {guestMode ? 'Modo invitado · Pago seguro' : 'Pago seguro · SSL/TLS'}
            </p>
          </div>
          <button onClick={closePayment}
                  className="p-1.5 rounded-lg hover:bg-bk-card2 text-bk-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Guest banner */}
        {guestMode && (
          <div className="flex items-center gap-2 bg-bk-primary/8 border border-bk-primary/20
                          rounded-xl px-3 py-2.5 mb-4">
            <User size={13} className="text-bk-primary flex-shrink-0" />
            <p className="text-[11px] text-bk-muted leading-snug">
              Necesitamos tus datos de contacto para confirmar el pedido.
            </p>
          </div>
        )}

        {/* Name */}
        <div className="mb-3">
          <Input
            label="Tu nombre"
            placeholder="ej. Mario García"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors({}) }}
            error={errors.name}
            autoComplete="name"
          />
        </div>

        {/* Phone — guests always, Bizum users too */}
        {(guestMode || payMethod === 'bizum') && (
          <div className="mb-3">
            <Input
              label={payMethod === 'bizum' ? 'Número de Bizum' : 'Teléfono de contacto'}
              placeholder="ej. 612 345 678"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrors({}) }}
              error={errors.phone}
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
        )}

        {/* Delivery type */}
        <div className="mb-5">
          <Input
            as="select"
            label="Tipo de entrega"
            value={table}
            onChange={(e) => setTable(e.target.value)}
          >
            {DELIVERY_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </Input>
        </div>

        {/* ── Payment method selector ──────────────────────── */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-bk-muted2 mb-2.5">Método de pago</p>
          <div className="grid grid-cols-3 gap-2">
            {PAY_METHODS.map(({ id, Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setPayMethod(id); setErrors({}) }}
                className={`flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-xl border
                            transition-all text-[11px] font-bold
                            ${payMethod === id
                              ? 'bg-bk-primary/10 border-bk-primary/50 text-bk-primary shadow-orange'
                              : 'bg-bk-card2 border-bk-border text-bk-muted hover:border-bk-border2'
                            }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Payment method details ───────────────────────── */}

        {/* Card visual */}
        {payMethod === 'card' && (
          <div className="credit-card mb-4">
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
                  {name ? name.toUpperCase() : 'NOMBRE TITULAR'}
                </p>
              </div>
              <div>
                <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Vence</p>
                <p className="font-mono text-[11px] text-white/60">12/27</p>
              </div>
            </div>
          </div>
        )}

        {/* Bizum info */}
        {payMethod === 'bizum' && (
          <div className="flex gap-3 bg-blue-500/6 border border-blue-500/20 rounded-xl
                          px-3.5 py-3 mb-4">
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

        {/* Cash info */}
        {payMethod === 'cash' && (
          <div className="flex gap-3 bg-green-500/6 border border-green-500/20 rounded-xl
                          px-3.5 py-3 mb-4">
            <Banknote size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-bold text-green-300 mb-0.5">Pago en efectivo</p>
              <p className="text-[10px] text-bk-muted leading-relaxed">
                Paga en caja al recoger tu pedido. Ten preparado el importe exacto si es posible.
              </p>
              <p className="text-[11px] font-black text-green-300 mt-1.5">
                Total: {formatPrice(total)}
              </p>
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-black/30 border border-bk-border rounded-xl p-3 mb-4 space-y-1.5">
          <div className="flex justify-between text-[11px] text-bk-muted">
            <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-bk-muted">
            <span>IVA (10%)</span><span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-[14px] font-black pt-1.5 border-t border-bk-border mt-1">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Security notice */}
        <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/15
                        rounded-lg px-3 py-2 mb-4">
          <ShieldCheck size={13} className="text-green-400 flex-shrink-0" />
          <p className="text-[10px] text-bk-muted">
            Procesado por <strong className="text-bk-muted2">Stripe</strong>.
            Nunca almacenamos datos de pago.
          </p>
        </div>

        {/* CTA */}
        <Button size="full" onClick={handlePay} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Procesando…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Flame size={16} fill="currentColor" />
              {payMethod === 'cash' ? 'Confirmar pedido' : `Pagar ${formatPrice(total)}`}
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
