import { cn } from '@/lib/utils'

const TABS = [
  { key: 'all',       label: 'Todos'         },
  { key: 'pending',   label: 'Pago pendiente' },
  { key: 'preparing', label: 'En cocina'      },
  { key: 'ready',     label: 'Listos'         },
]

/**
 * @param {{ active: string, onChange: (key: string) => void, counts: Record<string, number> }} props
 */
export default function FilterTabs({ active, onChange, counts = {} }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {TABS.map(({ key, label }) => {
        const count = counts[key] ?? 0
        const isActive = active === key

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 rounded-xl text-[12px] font-semibold',
              'border transition-all duration-150',
              isActive
                ? 'bg-bk-primary/10 border-bk-primary/30 text-bk-primary'
                : 'bg-bk-card border-bk-border text-bk-muted hover:border-bk-border2 hover:text-bk-text'
            )}
          >
            {label}
            {count > 0 && (
              <span
                className={cn(
                  'text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center',
                  isActive ? 'bg-bk-primary text-black' : 'bg-bk-card2 text-bk-muted'
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
