import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  as?: 'button' | 'a'
  href?: string
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-800 focus-visible:ring-primary-400',
  secondary:
    'bg-accent-400 text-white hover:bg-accent-600 focus-visible:ring-accent-400',
  ghost:
    'bg-transparent text-primary-800 hover:bg-primary-50 focus-visible:ring-primary-400',
  outline:
    'border border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-400',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  as: Tag = 'button',
  href,
  ...props
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center gap-2 font-body font-semibold',
    'rounded-brand transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ')

  if (Tag === 'a' && href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
