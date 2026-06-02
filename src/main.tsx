import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/globals.css'
import './i18n'
import { App } from './App'

/**
 * ─── SELECCIÓN DE CONFIG POR CLIENTE ──────────────────────────────────────
 *
 * Para cada cliente nuevo, crea su config y cámbialo aquí:
 *
 *   import { siteConfig } from './config/base.config'        ← genérico
 *   import { siteConfig } from './config/restaurant.config'  ← restaurante
 *   import { siteConfig } from './config/fashion.config'     ← moda
 *   import { siteConfig } from './config/health.config'      ← salud/belleza
 *   import { siteConfig } from './config/hotel.config'       ← hotel
 *
 * O usa la variable de entorno VITE_SITE_CONFIG para cargarlo dinámicamente
 * según el entorno de Vercel (un proyecto Vercel por cliente).
 */
import { siteConfig } from './config/altamira.config'

const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((m) => ({ default: m.AdminPage }))
)

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el elemento #root en index.html')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-neutral-50" />}>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/*" element={<App config={siteConfig} />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
)
