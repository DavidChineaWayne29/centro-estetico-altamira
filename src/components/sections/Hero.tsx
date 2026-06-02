import { useTranslation } from 'react-i18next'
import type { HeroConfig } from '@/types'
import { Button } from '@/components/ui/Button'

interface HeroProps {
  hero: HeroConfig
}

export function Hero({ hero }: HeroProps) {
  const { t } = useTranslation()

  const handleClick = (href: string) => {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {hero.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
        />
      )}

      <div
        className="absolute inset-0 bg-neutral-900"
        style={{ opacity: hero.overlayOpacity ?? 0.5 }}
      />

      {!hero.backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-600" />
      )}

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
          {t('hero.headline', { defaultValue: hero.headline })}
        </h1>
        <p className="font-body text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          {t('hero.subheadline', { defaultValue: hero.subheadline })}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => handleClick(hero.ctaPrimary.href)}>
            {t('hero.ctaPrimary', { defaultValue: hero.ctaPrimary.label })}
          </Button>
          {hero.ctaSecondary && (
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => handleClick(hero.ctaSecondary!.href)}
            >
              {t('hero.ctaSecondary', { defaultValue: hero.ctaSecondary.label })}
            </Button>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="font-body text-xs tracking-widest uppercase">{t('hero.scroll')}</span>
        <div className="w-px h-8 bg-white/30 animate-pulse" />
      </div>
    </section>
  )
}
