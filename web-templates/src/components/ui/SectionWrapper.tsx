import type { ReactNode } from 'react'

interface SectionWrapperProps {
  id?: string
  className?: string
  children: ReactNode
  bg?: 'white' | 'neutral' | 'primary'
}

const bgClasses: Record<string, string> = {
  white:   'bg-white',
  neutral: 'bg-neutral-50',
  primary: 'bg-primary-50',
}

export function SectionWrapper({ id, className = '', children, bg = 'white' }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`py-20 px-4 sm:px-6 lg:px-8 ${bgClasses[bg]} ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionHeader({ title, subtitle, align = 'center' }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'
  return (
    <div className={`mb-12 ${alignClass}`}>
      <h2 className="font-display text-3xl sm:text-4xl text-neutral-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-neutral-600 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
