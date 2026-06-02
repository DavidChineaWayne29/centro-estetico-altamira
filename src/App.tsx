import { useEffect } from 'react'
import type { SiteConfig } from '@/types'
import { applyTheme, applyMeta } from '@/services/theme.service'

// Layout
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

// Secciones
import { Hero }              from '@/components/sections/Hero'
import { Services }          from '@/components/sections/Services'
import { About }             from '@/components/sections/About'
import { Gallery }           from '@/components/sections/Gallery'
import { BookingWizard }    from '@/components/sections/BookingWizard'
import { Testimonials }      from '@/components/sections/Testimonials'
import { Contact }           from '@/components/sections/Contact'

interface AppProps {
  config: SiteConfig
}

/**
 * App es un ensamblador puro.
 * No contiene lógica de negocio — solo renderiza secciones según config.
 * Agregar un nuevo sector = añadir secciones condicionales aquí.
 */
export function App({ config }: AppProps) {
  useEffect(() => {
    applyTheme(config.theme)
    applyMeta(config.siteName, config.metaDescription)
  }, [config])

  // IDs de secciones para el scroll spy del navbar
  const sectionIds = [
    'inicio',
    'servicios',
    'nosotros',
    config.gallery ? 'galeria' : null,
    'cita',
    'contacto',
  ].filter(Boolean) as string[]

  return (
    <div className="font-body text-neutral-900 antialiased">
      <Navbar nav={config.nav} sectionIds={sectionIds} />

      <main>
        <Hero hero={config.hero} />
        <Services services={config.services} />
        <About about={config.about} />

        {config.gallery && (
          <Gallery gallery={config.gallery} />
        )}

        {config.testimonials?.enabled && (
          <Testimonials testimonials={config.testimonials} />
        )}

        <BookingWizard />

        <Contact contact={config.contact} />
      </main>

      <Footer
        siteName={config.siteName}
        nav={config.nav}
        footer={config.footer}
      />
    </div>
  )
}
