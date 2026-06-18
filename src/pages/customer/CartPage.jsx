import { useNavigate }  from 'react-router-dom'
import { ShoppingBag, Clock, Flame } from 'lucide-react'
import CartItem         from '@/components/customer/CartItem'
import BKGorilla        from '@/components/ui/BKGorilla'
import useCartStore     from '@/store/cartStore'
import useOrderStore    from '@/store/orderStore'
import { formatPrice }  from '@/lib/utils'
import { ORDER_STATUS, PREP_TIME_PER_ORDER } from '@/lib/constants'

export default function CartPage() {
  const { lines, itemCount, subtotal, tax, total } = useCartStore((s) => s.getSummary())
  const orders   = useOrderStore((s) => s.orders)
  const navigate = useNavigate()

  const activeCount = orders.filter((o) => o.status !== ORDER_STATUS.READY).length
  const etaMinutes  = (activeCount + 1) * PREP_TIME_PER_ORDER

  // ── Empty state ──────────────────────────────────────────────────────────
  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] px-6 text-center animate-fade-in">
        <div className="relative mb-5">
          <BKGorilla className="w-24 h-24 opacity-50" />
          <span className="absolute -bottom-1 -right-1 text-[22px] animate-bounce select-none">😴</span>
        </div>

        <h3 className="text-[18px] font-black tracking-tight mb-1">¡El wok te espera!</h3>
        <p className="text-[12px] text-bk-muted max-w-[230px] leading-relaxed mb-6">
          Tu carrito está vacío. Echa un vistazo a la carta y añade tus platos favoritos.
        </p>

        <button
          onClick={() => navigate('/customer/menu')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-bk-primary text-black font-black text-[13px]
                     active:scale-[0.98] transition-transform shadow-orange"
        >
          <Flame size={14} fill="currentColor" />
          Ver la carta
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">

      {/* ── Mobile: single column / Desktop: two columns ── */}
      <div className="md:grid md:grid-cols-[1fr_300px] md:gap-6 md:items-start md:p-4">

        {/* ── Left: header + cart items ─────────────────── */}
        <div className="px-4 pt-4 md:px-0 md:pt-0">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={17} className="text-bk-primary" />
            <h2 className="text-[18px] font-black tracking-tight">Tu pedido</h2>
            <span className="ml-auto text-[10px] font-bold text-bk-muted
                             bg-bk-card border border-bk-border px-2.5 py-1 rounded-full">
              {itemCount} {itemCount === 1 ? 'plato' : 'platos'}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {lines.map((line) => (
              <CartItem key={line.lineId} line={line} />
            ))}
          </div>
        </div>

        {/* ── Right (desktop sticky) / Bottom (mobile) ── */}
        <div className="px-4 pb-4 mt-4 md:px-0 md:pb-0 md:mt-0 md:sticky md:top-4">

          {/* ETA */}
          <div className="flex items-center gap-2.5 bg-bk-primary/8 border border-bk-primary/20
                          rounded-xl px-3.5 py-3 mb-3">
            <Clock size={15} className="text-bk-primary flex-shrink-0" />
            <div>
              <p className="text-[12px] font-bold text-bk-primary">~{etaMinutes} min de espera</p>
              <p className="text-[10px] text-bk-muted mt-0.5">
                {activeCount} pedido{activeCount !== 1 ? 's' : ''} en cola antes que el tuyo
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-bk-card border border-bk-border rounded-2xl p-4 mb-4">
            <div className="flex justify-between text-[12px] text-bk-muted mb-2">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[12px] text-bk-muted mb-3">
              <span>IVA (10%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="h-px bg-bk-border mb-3" />
            <div className="flex justify-between items-baseline">
              <span className="text-[14px] font-black">Total</span>
              <span className="text-[18px] font-black text-bk-primary">{formatPrice(total)}</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/customer/checkout')}
            className="w-full py-4 rounded-2xl bg-bk-primary text-black font-black text-[15px]
                       tracking-tight flex items-center justify-center gap-2
                       active:scale-[0.98] transition-transform shadow-orange hover:brightness-110"
          >
            <Flame size={16} fill="currentColor" />
            Ir a pagar · {formatPrice(total)}
          </button>
        </div>
      </div>
    </div>
  )
}
