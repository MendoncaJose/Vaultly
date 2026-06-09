import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'none'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
}

export function Card({ padding = 'md', className = '', children, ...props }: CardProps) {
  return (
    <div
      className={['bg-slate border border-iron rounded-lg', paddingClasses[padding], className].join(
        ' ',
      )}
      {...props}
    >
      {children}
    </div>
  )
}
