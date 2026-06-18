import { MENU_ITEMS }     from '@/data/menu'
import { MENU_CATEGORY }  from '@/lib/constants'
import MenuItem           from '@/components/customer/MenuItem'
import CustomizationModal from '@/components/customer/CustomizationModal'
import BKGorilla          from '@/components/ui/BKGorilla'
import useUIStore         from '@/store/uiStore'
import { Flame }          from 'lucide-react'

const CATEGORIES = [
  MENU_CATEGORY.ALL,
  MENU_CATEGORY.NOODLES,
  MENU_CATEGORY.ARROZ,
  MENU_CATEGORY.ENSALADA,
  MENU_CATEGORY.ENTRANTE,
  MENU_CATEGORY.BEBIDA,
  MENU_CATEGORY.POSTRE,
]

export default function MenuPage() {
  const activeCategory  = useUIStore((s) => s.menuCategory)
  const setMenuCategory = useUIStore((s) => s.setMenuCategory)
  const customizingItem = useUIStore((s) => s.customizingItem)

  const filtered = activeCategory
    ? MENU_ITEMS.filter((m) => m.category === activeCategory)
    : MENU_ITEMS

  return (
    <div className="animate-fade-in">

      {/* ── Hero banner ──────────────────────────────────── */}
      <div
        className="relative overflow-hidden border-b border-bk-border px-5 py-5
                    flex items-center gap-4 md:px-6 md:py-6"
        style={{ background: 'linear-gradient(135deg, rgba(255,107,0,0.09) 0%, transparent 65%)' }}
      >
        {/* Ambient glow */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-bk-primary/12 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute right-16 bottom-0 w-20 h-20 bg-bk-primary/6 rounded-full blur-2xl pointer-events-none"/>

        <BKGorilla className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] flex-shrink-0 animate-gorilla-sway relative z-10" />

        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-1">
            <Flame size={9} className="text-bk-primary fill-bk-primary" />
            <span className="text-[8.5px] font-black uppercase tracking-[0.22em] text-bk-primary">
              Fire on the Wok
            </span>
          </div>
          <h2 className="text-[22px] md:text-[26px] font-black tracking-[-0.03em] leading-none">
            Nuestra Carta
          </h2>
          <p className="text-[11px] text-bk-muted mt-1">
            Noodles · Arroz · Baos · Entrantes
          </p>
        </div>
      </div>

      {/* ── Category chips ─────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto no-scroll px-4 pt-3.5 pb-2 md:flex-wrap md:overflow-x-visible">
        {CATEGORIES.map((cat) => {
          const isActive = cat === MENU_CATEGORY.ALL
            ? !activeCategory
            : activeCategory === cat

          return (
            <button
              key={cat}
              onClick={() => setMenuCategory(cat === MENU_CATEGORY.ALL ? null : cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold
                          border transition-all duration-150
                          ${isActive
                            ? 'bg-bk-primary text-black border-bk-primary shadow-orange'
                            : 'bg-bk-card border-bk-border text-bk-muted hover:border-bk-border2'
                          }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* ── Items — 1 col mobile, 2 col desktop ────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 py-3">
        {filtered.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>

      {/* Customization bottom sheet */}
      {customizingItem && <CustomizationModal />}
    </div>
  )
}
