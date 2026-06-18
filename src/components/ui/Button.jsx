import { cn } from '@/lib/utils'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold ' +
  'transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:pointer-events-none'

const variants = {
  primary:
    'bg-bk-primary text-black shadow-orange hover:opacity-90',
  secondary:
    'bg-bk-card2 text-bk-text border border-bk-border2 hover:bg-bk-border2',
  ghost:
    'bg-transparent text-bk-muted border border-bk-border hover:bg-bk-card2 hover:text-bk-text',
  danger:
    'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
  indigo:
    'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 shadow-indigo',
}

const sizes = {
  sm:   'h-8  px-3  text-xs',
  md:   'h-10 px-4  text-sm',
  lg:   'h-12 px-5  text-base',
  full: 'h-14 px-5  text-base w-full',
}

/**
 * @param {{
 *   variant?: keyof variants,
 *   size?: keyof sizes,
 *   className?: string,
 *   children: React.ReactNode
 * } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
