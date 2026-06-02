import { useState, useEffect } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SiteNav } from '@/types'
import { Button } from '@/components/ui/Button'
import { useScrollSpy } from '@/hooks/useScrollSpy'

// Map each section href to its i18n key
const NAV_KEY: Record<string, string> = {
  '#inicio':   'nav.home',
  '#menu':     'nav.menuLink',
  '#nosotros': 'nav.about',
  '#galeria':  'nav.gallery',
  '#contacto': 'nav.contact',
  '#reservas': 'nav.reservations',
  '#tienda':   'nav.shop',
}

interface NavbarProps {
  nav: SiteNav
  sectionIds: string[]
}

export function Navbar({ nav, sectionIds }: NavbarProps) {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const activeId = useScrollSpy(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language.startsWith('en') ? 'es' : 'en')
  }

  const isEn = i18n.language.startsWith('en')

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <a
            href="#inicio"
            onClick={() => handleNavClick('#inicio')}
            className={`font-display text-xl font-semibold transition-colors drop-shadow-lg ${
              scrolled ? 'text-neutral-900 hover:text-primary-600' : 'text-white hover:text-primary-200'
            }`}
          >
            {nav.logoIsImage ? <img src={nav.logo} alt="Logo" className="h-10 w-auto" /> : nav.logo}
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {nav.links.map((link) => {
              const id = link.href.replace('#', '')
              const isActive = activeId === id
              const label = NAV_KEY[link.href] ? t(NAV_KEY[link.href]) : link.label
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`font-body text-sm transition-colors duration-200 ${
                    isActive
                      ? scrolled ? 'text-primary-600 font-semibold' : 'text-white font-semibold'
                      : scrolled ? 'text-neutral-600 hover:text-primary-600' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              )
            })}

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className={`flex items-center gap-1 font-body text-sm transition-colors ${
                scrolled ? 'text-neutral-600 hover:text-primary-600' : 'text-white/80 hover:text-white'
              }`}
              aria-label={t('nav.language')}
            >
              <Globe size={15} />
              {isEn ? 'ES' : 'EN'}
            </button>

            {nav.ctaLabel && (
              <Button size="sm" onClick={() => handleNavClick(nav.ctaHref ?? '#contacto')}>
                {t('nav.book')}
              </Button>
            )}
          </nav>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={toggleLang}
              className={`flex items-center gap-1 font-body text-sm transition-colors ${
                scrolled ? 'text-neutral-600' : 'text-white/80'
              }`}
              aria-label={t('nav.language')}
            >
              <Globe size={15} />
              {isEn ? 'ES' : 'EN'}
            </button>
            <button
              onClick={() => setIsOpen((o) => !o)}
              className={`p-2 transition-colors ${
                scrolled ? 'text-neutral-600 hover:text-primary-600' : 'text-white/80 hover:text-white'
              }`}
              aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-100 px-4 py-6 flex flex-col gap-4 shadow-lg">
          {nav.links.map((link) => {
            const label = NAV_KEY[link.href] ? t(NAV_KEY[link.href]) : link.label
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="font-body text-left text-neutral-700 hover:text-primary-600 transition-colors py-1"
              >
                {label}
              </button>
            )
          })}
          {nav.ctaLabel && (
            <Button
              size="sm"
              className="self-start mt-2"
              onClick={() => handleNavClick(nav.ctaHref ?? '#contacto')}
            >
              {t('nav.book')}
            </Button>
          )}
        </div>
      )}
    </header>
  )
}
