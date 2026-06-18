import { Minus, Plus, Trash2 } from 'lucide-react'
import useCartStore, { customizationLabel } from '@/store/cartStore'

/**
 * @param {{ line: import('@/store/cartStore').CartLine }} props
 */
export default function CartItem({ line }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  const { lineId, item, quantity, customization, unitPrice } = line
  const label = customizationLabel(customization)

  return (
    <div className="flex items-center gap-3 bg-bk-card border border-bk-border rounded-xl p-3
                    transition-colors hover:border-bk-border2">

      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-bk-card2">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Name + customization + price */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-bk-text truncate">{item.name}</p>
        {label && (
          <p className="text-[10px] text-bk-muted mt-0.5 truncate">{label}</p>
        )}
        <p className="text-[13px] font-bold text-bk-primary mt-0.5">
          {(unitPrice * quantity).toFixed(2)} €
          {quantity > 1 && (
            <span className="text-[10px] font-normal text-bk-muted ml-1">
              ({unitPrice.toFixed(2)} × {quantity})
            </span>
          )}
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => updateQuantity(lineId, quantity - 1)}
          className="w-7 h-7 rounded-full bg-bk-card2 border border-bk-border2
                     flex items-center justify-center text-bk-muted
                     hover:text-bk-text hover:border-bk-border transition-colors active:scale-90"
        >
          {quantity === 1
            ? <Trash2 size={12} className="text-red-400" />
            : <Minus size={12} />
          }
        </button>

        <span className="text-[13px] font-bold w-4 text-center">{quantity}</span>

        <button
          onClick={() => updateQuantity(lineId, quantity + 1)}
          className="w-7 h-7 rounded-full bg-bk-card2 border border-bk-border2
                     flex items-center justify-center text-bk-muted
                     hover:text-bk-text hover:border-bk-border transition-colors active:scale-90"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  )
}
