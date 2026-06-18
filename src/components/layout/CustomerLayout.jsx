import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, ShoppingBag, MapPin, User, Flame, ArrowRight } from 'lucide-react'
import useCartStore      from '@/store/cartStore'
import useOrderStore     from '@/store/orderStore'
import useUIStore        from '@/store/uiStore'
import useUserStore      from '@/store/userStore'
import PaymentModal      from '@/components/customer/PaymentModal'
import GuestUpsellModal  from '@/components/customer/GuestUpsellModal'
import BKGorilla         from '@/components/ui/BKGorilla'
import { formatPrice }   from '@/lib/utils'

// ─── Navigation tabs ──────────────────────────────────────────────────────────
const NAV_TABS = [
  { to: '/customer/menu',     icon: BookOpen,    label: 'Carta'     },
  { to: '/customer/cart',     icon: ShoppingBag, label: 'Carrito'   },
  { to: '/customer/tracking', icon: MapPin,      label: 'Mi Pedido' },
  { to: '/customer/profile',  icon: User,        label: 'Perfil',   guestHide: true },
]

export default function CustomerLayout() {
  const navigate             = useNavigate()
  const location             = useLocation()
  const { itemCount, total } = useCartStore((s) => s.getSummary())
  const currentOrderId       = useOrderStore((s) => s.currentOrderId)
  const showPayment          = useUIStore((s) => s.showPayment)
  const showGuestUpsell      = useUIStore((s) => s.showGuestUpsell)
  const guestMode            = useUserStore((s) => s.guestMode)
  const user                 = useUserStore((s) => s.user)

  const isMenuPage  = location.pathname === '/customer/menu'
  const showCartBar = isMenuPage && itemCount > 0
  const visibleTabs = NAV_TABS.filter((t) => !(t.guestHide && guestMode))

  return (
    <div
      className="min-h-screen flex bg-bk-bg"
      style={{ background: 'radial-gradient(ellipse at 60% 0%, rgba(255,107,0,0.06) 0%, #080808 50%)' }}
    >
      {/* ── Desktop sidebar ──────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-64
                         border-r border-bk-border z-30 overflow-y-auto"
               style={{ background: 'linear-gradient(180deg, #0d0d0d 0%, #090909 100%)' }}>

        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-bk-border flex-shrink-0">
          <BKGorilla className="w-11 h-11 flex-shrink-0 animate-gorilla-sway" />
          <div>
            <h1 className="text-[18px] font-black tracking-[-0.04em] leading-none">
              BANGKOK<span className="text-bk-primary">.</span>
            </h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Flame size={8} className="text-bk-primary fill-bk-primary" />
              <p className="text-[7px] font-black uppercase tracking-[0.18em] text-bk-primary">
                Fire on the Wok
              </p>
            </div>
          </div>
        </div>

        {/* Status badges */}
        {(guestMode || currentOrderId) && (
          <div className="px-4 py-2.5 border-b border-bk-border flex flex-wrap gap-1.5 flex-shrink-0">
            {guestMode && (
              <span className="px-2.5 py-1 rounded-full bg-bk-primary/10 border border-bk-primary/20
                               text-[8px] font-bold text-bk-primary uppercase tracking-wider">
                Invitado
              </span>
            )}
            {currentOrderId && (
              <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20
                               text-[8px] font-bold text-green-400 uppercase tracking-wider animate-pulse">
                En cocina
              </span>
            )}
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {visibleTabs.map(({ to, icon: Icon, label }) => {
            const isTracking = to.includes('tracking')
            const isCart     = to.includes('cart')
            const disabled   = isTracking && !currentOrderId

            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                   text-[13px] font-semibold relative
                   ${disabled ? 'pointer-events-none opacity-25' : ''}
                   ${isActive
                     ? 'bg-bk-primary/10 text-bk-primary border border-bk-primary/20'
                     : 'text-bk-muted hover:bg-bk-card hover:text-bk-text border border-transparent'
                   }`
                }
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {isCart && itemCount > 0 && (
                  <span className="bg-bk-primary text-black text-[9px] font-black
                                   w-5 h-5 rounded-full flex items-center justify-center leading-none">
                    {itemCount}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Cart CTA */}
        {itemCount > 0 && (
          <div className="px-3 pb-3 flex-shrink-0">
            <button
              onClick={() => navigate('/customer/cart')}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl
                         bg-bk-primary text-black font-black text-[12px]
                         shadow-orange active:scale-[0.98] transition-transform"
            >
              <span className="w-6 h-6 rounded-lg bg-black/15 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-black">{itemCount}</span>
              </span>
              <span className="flex-1 text-left">Ver carrito</span>
              <span>{formatPrice(total)}</span>
            </button>
          </div>
        )}

        {/* User info */}
        {!guestMode && user && (
          <div className="px-5 py-4 border-t border-bk-border flex-shrink-0">
            <p className="text-[12px] font-bold text-bk-text truncate">{user.name}</p>
            <p className="text-[10px] text-bk-muted truncate">{user.email}</p>
          </div>
        )}
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">

        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3
                            border-b border-bk-border bg-bk-bg sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <BKGorilla className="w-8 h-8 flex-shrink-0" />
            <div>
              <h1 className="text-[16px] font-black tracking-[-0.04em] leading-none">
                BANGKOK<span className="text-bk-primary">.</span>
              </h1>
              <div className="flex items-center gap-1 mt-0.5">
                <Flame size={7} className="text-bk-primary fill-bk-primary" />
                <p className="text-[6.5px] font-black uppercase tracking-[0.18em] text-bk-primary">
                  Fire on the Wok
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {guestMode && (
              <span className="px-2 py-1 rounded-full bg-bk-primary/10 border border-bk-primary/20
                               text-[8px] font-bold text-bk-primary uppercase tracking-wider">
                Invitado
              </span>
            )}
            {currentOrderId && (
              <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20
                               text-[8px] font-bold text-green-400 uppercase tracking-wider">
                En cocina
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-y-auto no-scroll
          ${showCartBar ? 'pb-[136px] md:pb-8' : 'pb-[68px] md:pb-8'}`}>
          <div className="md:max-w-4xl md:mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Floating cart bar — mobile only */}
        {showCartBar && (
          <div className="fixed md:hidden left-3 right-3 bottom-[72px] z-20 animate-fade-in">
            <button
              onClick={() => navigate('/customer/cart')}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl
                         bg-bk-primary text-black shadow-orange
                         active:scale-[0.98] transition-transform"
            >
              <div className="w-7 h-7 rounded-xl bg-black/15 flex items-center
                              justify-center flex-shrink-0">
                <span className="text-[11px] font-black">{itemCount}</span>
              </div>
              <span className="font-black text-[13px] flex-1 text-left">
                Ver mi pedido · {itemCount === 1 ? '1 plato' : `${itemCount} platos`}
              </span>
              <span className="font-black text-[14px]">{formatPrice(total)}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Bottom nav — mobile only */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bk-bg border-t border-bk-border
                        flex justify-around items-center px-2 py-2.5 z-20">
          {visibleTabs.map(({ to, icon: Icon, label }) => {
            const isTracking = to.includes('tracking')
            const isCart     = to.includes('cart')
            const disabled   = isTracking && !currentOrderId

            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl relative
                   ${disabled ? 'pointer-events-none opacity-25' : ''}
                   ${isActive ? 'text-bk-primary' : 'text-bk-muted'}`
                }
              >
                <div className="relative">
                  <Icon size={20} />
                  {isCart && itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-bk-primary text-black
                                     text-[8px] font-black w-4 h-4 rounded-full
                                     flex items-center justify-center leading-none">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-wider">{label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* ── Modals — fixed, cover full viewport ──────────────────────────────── */}
      {showPayment     && <PaymentModal />}
      {showGuestUpsell && <GuestUpsellModal />}
    </div>
  )
}
