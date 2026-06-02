import type { SiteTheme } from '@/types'

/**
 * Aplica las variables CSS del tema al :root del documento.
 * Puro JS — sin dependencia de React, portable a cualquier framework.
 */
export function applyTheme(theme: SiteTheme): void {
  const root = document.documentElement

  // Colores primary
  Object.entries(theme.colors.primary).forEach(([stop, value]) => {
    root.style.setProperty(`--color-primary-${stop}`, value)
  })

  // Colores accent
  Object.entries(theme.colors.accent).forEach(([stop, value]) => {
    root.style.setProperty(`--color-accent-${stop}`, value)
  })

  // Colores neutral
  Object.entries(theme.colors.neutral).forEach(([stop, value]) => {
    root.style.setProperty(`--color-neutral-${stop}`, value)
  })

  // Border radius
  root.style.setProperty('--radius-brand', theme.radius)

  // Fuentes
  root.style.setProperty('--font-display', `'${theme.fonts.display}', serif`)
  root.style.setProperty('--font-body', `'${theme.fonts.body}', sans-serif`)

  // Inyectar Google Fonts si no están ya cargadas
  injectGoogleFont(theme.fonts.displayUrl)
  injectGoogleFont(theme.fonts.bodyUrl)
}

function injectGoogleFont(url: string): void {
  if (!url) return
  const id = btoa(url).slice(0, 20)
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id   = id
  link.rel  = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
}

/**
 * Actualiza el <title> y <meta name="description"> del documento.
 * Portable — sin React.
 */
export function applyMeta(siteName: string, description: string): void {
  document.title = siteName
  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (meta) meta.content = description
}
