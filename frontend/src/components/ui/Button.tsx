import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-ember-gold text-obsidian hover:bg-molten-gold disabled:opacity-50',
  ghost:
    'border border-iron text-chalk hover:border-steel hover:text-chalk-glow disabled:opacity-40',
  danger:
    'border border-loss text-loss hover:bg-loss hover:text-paper disabled:opacity-40',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-caption',
  md: 'px-5 py-2.5 text-caption',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
