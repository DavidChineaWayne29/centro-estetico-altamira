import { useEffect, useRef } from 'react'
import type { HeroConfig } from '@/types'
import { Button } from '@/components/ui/Button'

interface HeroProps {
  hero: HeroConfig
}

export function Hero({ hero }: HeroProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.9s ease, transform 0.9s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const handleClick = (href: string) => {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      {hero.backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--color-primary-900), var(--color-primary-600))' }} />
      )}

      {/* Overlay con gradiente sofisticado */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,${(hero.overlayOpacity ?? 0.5) + 0.2}) 0%, rgba(0,0,0,${hero.overlayOpacity ?? 0.5}) 50%, rgba(0,0,0,0.2) 100%)`,
        }}
      />

      {/* Línea decorativa lateral */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
        <div className="w-px h-16 bg-white/20" />
        <span className="font-body text-white/30 text-xs tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl' }}>
          Desde 1987
        </span>
        <div className="w-px h-16 bg-white/20" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p className="font-body text-xs sm:text-sm tracking-[0.25em] uppercase mb-6" style={{ color: 'var(--color-primary-200)' }}>
          Cocina canaria tradicional
        </p>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white leading-tight mb-6">
          {hero.headline}
        </h1>

        {/* Separador decorativo */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-px bg-white/30" />
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary-400)' }} />
          <div className="w-12 h-px bg-white/30" />
        </div>

        <p className="font-body text-lg sm:text-xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
          {hero.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => handleClick(hero.ctaPrimary.href)}>
            {hero.ctaPrimary.label}
          </Button>
          {hero.ctaSecondary && (
            <Button
              size="lg"
              variant="outline"
              className="!border-white/50 !text-white hover:!bg-white/10"
              onClick={() => handleClick(hero.ctaSecondary!.href)}
            >
              {hero.ctaSecondary.label}
            </Button>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-body text-white/40 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}