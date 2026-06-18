import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Controlled text / select input with Bangkok dark theme.
 */
const Input = forwardRef(function Input(
  { label, error, className, as: Tag = 'input', children, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-semibold text-bk-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      <Tag
        ref={ref}
        className={cn(
          'w-full rounded-xl bg-black border border-bk-border2',
          'px-3.5 py-2.5 text-sm text-bk-text placeholder:text-bk-muted2',
          'outline-none transition-colors',
          'focus:border-bk-primary',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        {children}
      </Tag>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
})

export default Input
