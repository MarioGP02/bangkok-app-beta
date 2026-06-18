import { useState, useEffect } from 'react'
import { X, Flame } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import useUIStore   from '@/store/uiStore'
import { SPICY_LEVELS, EXTRA_PROTEINS, EXTRA_TOPPINGS } from '@/lib/constants'

/** Render N chili emojis */
function Chilis({ n }) {
  if (n === 0) return <span className="text-bk-muted text-[11px]">—</span>
  return <span className="text-[11px] leading-none">{'🌶'.repeat(n)}</span>
}

export default function CustomizationModal() {
  const item             = useUIStore((s) => s.customizingItem)
  const closeCustomization = useUIStore((s) => s.closeCustomization)
  const addItem          = useCartStore((s) => s.addItem)

  // ── Local state ───────────────────────────────────────────────────────────
  const [spicy,    setSpicy]    = useState(SPICY_LEVELS[0])
  const [protein,  setProtein]  = useState(null)
  const [toppings, setToppings] = useState([])

  // Reset selections whenever the modal opens for a new item
  useEffect(() => {
    if (item) {
      setSpicy(SPICY_LEVELS[0])
      setProtein(null)
      setToppings([])
    }
  }, [item])

  if (!item) return null

  // ── Derived price ─────────────────────────────────────────────────────────
  const extrasTotal = (protein?.price ?? 0) + toppings.reduce((s, t) => s + t.price, 0)
  const total       = +(item.price + extrasTotal).toFixed(2)

  // ── Handlers ──────────────────────────────────────────────────────────────
  function toggleTopping(t) {
    setToppings((prev) =>
      prev.find((x) => x.id === t.id)
        ? prev.filter((x) => x.id !== t.id)
        : [...prev, t]
    )
  }

  function handleConfirm() {
    addItem(item, { spicy, protein, toppings })
    closeCustomization()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 z-30 animate-fade-in"
        onClick={closeCustomization}
      />

      {/* Bottom sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-bk-card rounded-t-3xl
                      border-t border-bk-border2 animate-slide-up overflow-hidden">

        {/* Handle + close */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="w-8 h-1 rounded-full bg-bk-border2 mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-bk-text leading-tight">{item.name}</p>
              <p className="text-[11px] text-bk-muted">Precio base: {item.price.toFixed(2)} €</p>
            </div>
          </div>
          <button
            onClick={closeCustomization}
            className="w-7 h-7 rounded-full bg-bk-card2 flex items-center justify-center
                       text-bk-muted hover:text-bk-text transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh] pb-2">

          {/* ── Spicy level ─────────────────────────────────────────────── */}
          <section className="px-5 pt-3 pb-4 border-b border-bk-border">
            <div className="flex items-center gap-1.5 mb-3">
              <Flame size={13} className="text-orange-400" />
              <h3 className="text-[12px] font-bold text-bk-text uppercase tracking-wider">
                Nivel de picante
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SPICY_LEVELS.map((level) => {
                const active = spicy.id === level.id
                return (
                  <button
                    key={level.id}
                    onClick={() => setSpicy(level)}
                    className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border
                                transition-all duration-150 active:scale-95
                                ${active
                                  ? 'bg-bk-primary/15 border-bk-primary text-bk-primary'
                                  : 'bg-bk-card2 border-bk-border text-bk-muted hover:border-bk-border2'
                                }`}
                  >
                    <Chilis n={level.chilis} />
                    <span className={`text-[9px] font-bold uppercase tracking-wide leading-tight text-center
                                      ${active ? 'text-bk-primary' : 'text-bk-muted'}`}>
                      {level.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Extra proteína ───────────────────────────────────────────── */}
          <section className="px-5 pt-3 pb-4 border-b border-bk-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-bold text-bk-text uppercase tracking-wider">
                Extra proteína 100g
              </h3>
              <span className="text-[10px] text-bk-muted">Opcional</span>
            </div>
            <div className="flex gap-2">
              {EXTRA_PROTEINS.map((p) => {
                const active = protein?.id === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setProtein(active ? null : p)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border
                                transition-all duration-150 active:scale-95
                                ${active
                                  ? 'bg-bk-primary/15 border-bk-primary'
                                  : 'bg-bk-card2 border-bk-border hover:border-bk-border2'
                                }`}
                  >
                    <span className={`text-[12px] font-bold ${active ? 'text-bk-primary' : 'text-bk-text'}`}>
                      {p.label}
                    </span>
                    <span className={`text-[10px] font-mono ${active ? 'text-bk-primary' : 'text-bk-muted'}`}>
                      +{p.price.toFixed(2)} €
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Extras (+0.50€) ──────────────────────────────────────────── */}
          <section className="px-5 pt-3 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-bold text-bk-text uppercase tracking-wider">
                Extras
              </h3>
              <span className="text-[10px] text-bk-muted">+0.50 € c/u · Opcional</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXTRA_TOPPINGS.map((t) => {
                const active = !!toppings.find((x) => x.id === t.id)
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopping(t)}
                    className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold
                                transition-all duration-150 active:scale-95
                                ${active
                                  ? 'bg-bk-primary/15 border-bk-primary text-bk-primary'
                                  : 'bg-bk-card2 border-bk-border text-bk-muted hover:border-bk-border2 hover:text-bk-text'
                                }`}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        {/* ── Confirm button ───────────────────────────────────────────────── */}
        <div className="px-5 pb-6 pt-2 border-t border-bk-border bg-bk-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-bk-muted">Total del plato</span>
            <span className="text-[20px] font-black text-bk-primary">{total.toFixed(2)} €</span>
          </div>
          {extrasTotal > 0 && (
            <p className="text-[10px] text-bk-muted mb-2 text-right">
              {item.price.toFixed(2)} € base + {extrasTotal.toFixed(2)} € extras
            </p>
          )}
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-2xl bg-bk-primary text-black font-black
                       text-[14px] tracking-wide active:scale-[0.98] transition-all
                       shadow-orange hover:brightness-110"
          >
            Añadir al carrito · {total.toFixed(2)} €
          </button>
        </div>
      </div>
    </>
  )
}
