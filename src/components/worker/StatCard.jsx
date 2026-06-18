import { cn } from '@/lib/utils'

/**
 * @param {{
 *   label: string,
 *   value: string | number,
 *   sub?: string,
 *   highlight?: boolean,
 *   className?: string
 * }} props
 */
export default function StatCard({ label, value, sub, highlight = false, className }) {
  return (
    <div
      className={cn(
        'bg-bk-card border rounded-2xl p-5',
        highlight ? 'border-yellow-500/25' : 'border-bk-border',
        className
      )}
    >
      <p className="text-[10px] font-bold text-bk-muted uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className={cn(
        'text-3xl font-black tracking-tight leading-none',
        highlight ? 'text-yellow-400' : 'text-bk-text'
      )}>
        {value}
      </p>
      {sub && (
        <p className="text-[10px] text-bk-muted mt-2">{sub}</p>
      )}
    </div>
  )
}
