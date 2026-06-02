import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import type { SiteNav } from '@/types'
import { Button } from '@/components/ui/Button'
import { useScrollSpy } from '@/hooks/useScrollSpy'

interface NavbarProps {
  nav: SiteNav
  sectionIds: string[]
}

export function Navbar({ nav, sectionIds }: NavbarProps) {
  const [isOpen, setIsOpen]       = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const activeId                  = useScrollSpy(sectionIds)

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-gradient-to-b from-black/60 to-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <a
            href="#inicio"
            onClick={() => handleNavClick('#inicio')}
            className="font-display text-xl text-neutral-900 hover:text-primary-600 transition-colors"
          >
            {nav.logoIsImage
              ? <img src={nav.logo} alt="Logo" className="h-10 w-auto" />
              : nav.logo
            }
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {nav.links.map((link) => {
              const id = link.href.replace('#', '')
              const isActive = activeId === id
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`font-body text-sm transition-colors duration-200 ${
                    isActive
                      ? 'text-primary-600 font-semibold'
                      : 'text-neutral-600 hover:text-primary-600'
                  }`}
                >
                  {link.label}
                </button>
              )
            })}
            {nav.ctaLabel && (
              <Button
                size="sm"
                onClick={() => handleNavClick(nav.ctaHref ?? '#contacto')}
              >
                {nav.ctaLabel}
              </Button>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="lg:hidden p-2 text-neutral-600 hover:text-primary-600 transition-colors"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-100 px-4 py-6 flex flex-col gap-4 shadow-lg">
          {nav.links.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="font-body text-left text-neutral-700 hover:text-primary-600 transition-colors py-1"
            >
              {link.label}
            </button>
          ))}
          {nav.ctaLabel && (
            <Button
              size="sm"
              className="self-start mt-2"
              onClick={() => handleNavClick(nav.ctaHref ?? '#contacto')}
            >
              {nav.ctaLabel}
            </Button>
          )}
        </div>
      )}
    </header>
  )
}
