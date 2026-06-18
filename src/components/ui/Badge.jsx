import { cn } from '@/lib/utils'

const variants = {
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  paid:      'bg-green-500/10  text-green-400  border-green-500/20',
  preparing: 'bg-bk-primary/10 text-bk-primary border-bk-primary/20',
  ready:     'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  neutral:   'bg-white/5       text-bk-muted   border-white/10',
}

/**
 * @param {{ variant?: keyof variants, children: React.ReactNode, className?: string }} props
 */
export default function Badge({ variant = 'neutral', children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full',
        'text-[10px] font-bold uppercase tracking-wider border',
        variants[variant] ?? variants.neutral,
        className
      )}
    >
      {children}
    </span>
  )
}
