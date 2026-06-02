import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { App } from './App'

/**
 * ─── CAMBIAR CONFIG POR CLIENTE ───────────────────────────────────────────
 * Para cada cliente, importa su config aquí.
 * O mejor: usa una variable de entorno VITE_SECTOR para cargar el config
 * dinámicamente según el dominio/entorno.
 *
 * Ejemplos:
 *   import { siteConfig } from './config/restaurant.config'
 *   import { siteConfig } from './config/fashion.config'
 *   import { siteConfig } from './config/hotel.config'
 */
import { siteConfig } from './config/restaurant.config'

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el elemento #root en index.html')

createRoot(root).render(
  <StrictMode>
    <App config={siteConfig} />
  </StrictMode>
)
