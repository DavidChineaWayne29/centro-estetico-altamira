import type { FooterConfig, SiteNav } from '@/types'

interface FooterProps {
  siteName: string
  nav: SiteNav
  footer: FooterConfig
}

export function Footer({ siteName, nav, footer }: FooterProps) {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Marca */}
          <div>
            <p className="font-display text-xl text-white mb-3">{siteName}</p>
            {footer.tagline && (
              <p className="font-body text-sm text-neutral-400">{footer.tagline}</p>
            )}
          </div>

          {/* Links nav */}
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-neutral-500 mb-4">Navegación</p>
            <ul className="space-y-2">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links legales */}
          {footer.links && footer.links.length > 0 && (
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-neutral-500 mb-4">Legal</p>
              <ul className="space-y-2">
                {footer.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="font-body text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-800 pt-6 text-center">
          <p className="font-body text-xs text-neutral-600">
            {footer.legalText ?? `© ${new Date().getFullYear()} ${siteName}. Todos los derechos reservados.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
