import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-caption text-silver">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full bg-carbon border rounded-sm px-3 py-2.5 text-caption text-chalk',
          'placeholder:text-steel',
          'focus:outline-none focus:border-ember-gold',
          'transition-colors',
          error ? 'border-loss' : 'border-iron',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-caption text-loss">{error}</p>}
    </div>
  )
}
