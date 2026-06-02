import { useState, useEffect } from 'react'

/**
 * Detecta qué sección está actualmente visible en el viewport.
 * Usado por el Navbar para resaltar el enlace activo.
 * La lógica es puro JS — el hook solo conecta con React.
 */
export function useScrollSpy(sectionIds: string[], offset = 80): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: `-${offset}px 0px -60% 0px`,
        threshold: 0,
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIds, offset])

  return activeId
}
