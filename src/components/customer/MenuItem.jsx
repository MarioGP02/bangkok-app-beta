import { useState } from 'react'
import { Check, Flame, Leaf, ChevronRight, Plus } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import useUIStore   from '@/store/uiStore'

/**
 * @param {{ item: import('@/data/menu').MenuItem }} props
 */
export default function MenuItem({ item }) {
  const addItem           = useCartStore((s) => s.addItem)
  const lines             = useCartStore((s) => s.lines)
  const openCustomization = useUIStore((s) => s.openCustomization)
  const [added, setAdded] = useState(false)

  // Total quantity of this item in cart (across all customization variants)
  const qty = lines
    .filter((l) => l.item.id === item.id)
    .reduce((s, l) => s + l.quantity, 0)

  function handleAdd() {
    if (item.customizable) {
      openCustomization(item)
    } else {
      addItem(item, null)
      setAdded(true)
      setTimeout(() => setAdded(false), 700)
    }
  }

  return (
    <div className={`flex bg-bk-card rounded-2xl overflow-hidden border transition-colors
                     ${qty > 0
                       ? 'border-bk-primary/35'
                       : 'border-bk-border hover:border-bk-border2'
                     }`}>

      {/* ── Image ────────────────────────────────────────── */}
      <div className="relative w-[96px] flex-shrink-0 bg-bk-card2 self-stretch">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Popular badge */}
        {item.popular && (
          <span className="absolute top-1.5 left-1.5 text-[7px] font-black text-black
                           uppercase tracking-wider bg-bk-primary px-1.5 py-[3px]
                           rounded-full leading-none">
            TOP
          </span>
        )}

        {/* In-cart qty bubble */}
        {qty > 0 && !added && (
          <div className="absolute bottom-1.5 right-1.5 min-w-[18px] h-[18px] px-1
                          rounded-full bg-bk-primary flex items-center justify-center">
            <span className="text-[9px] font-black text-black leading-none">×{qty}</span>
          </div>
        )}
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-3 min-w-0">

        {/* Top: name + badges */}
        <div>
          <div className="flex items-start gap-1.5 flex-wrap">
            <span className="text-[13px] font-bold text-bk-text leading-tight">
              {item.name}
            </span>
            {item.vegan && (
              <Leaf size={11} className="text-green-400 flex-shrink-0 mt-0.5" />
            )}
          </div>

          <p className="text-[10px] text-bk-muted mt-1 leading-relaxed line-clamp-2">
            {item.description}
          </p>

          {item.customizable && (
            <div className="flex items-center gap-1 mt-1.5">
              <Flame size={9} className="text-bk-primary" />
              <span className="text-[9px] text-bk-primary font-bold">Personalizable</span>
            </div>
          )}
        </div>

        {/* Bottom: price + CTA ─────────────────────────── */}
        <div className="flex items-center justify-between mt-2.5 gap-2">
          <span className="text-[15px] font-black text-bk-text leading-none">
            {item.price.toFixed(2)}
            <span className="text-[10px] text-bk-muted font-bold ml-0.5">€</span>
          </span>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 h-8 rounded-xl flex-shrink-0
                        transition-all duration-200 active:scale-90 text-[11px] font-black
                        ${added
                          ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                          : item.customizable
                            ? 'bg-bk-primary/10 border border-bk-primary/30 text-bk-primary hover:bg-bk-primary/20'
                            : 'bg-bk-primary text-black hover:brightness-110'
                        }`}
          >
            {added ? (
              <>
                <Check size={12} strokeWidth={3} />
                <span>Añadido</span>
              </>
            ) : item.customizable ? (
              <>
                <span>Personalizar</span>
                <ChevronRight size={11} strokeWidth={3} />
              </>
            ) : (
              <>
                <Plus size={12} strokeWidth={3} />
                <span>Añadir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
