<<<<<<< HEAD
# Web Templates — Sistema de webs para negocios locales

Sistema de templates React + Vite + Tailwind para crear webs profesionales para negocios locales de forma rápida y escalable.

## Arquitectura

```
src/
├── components/
│   ├── ui/          → Componentes genéricos (Button, SectionWrapper)
│   ├── layout/      → Navbar, Footer
│   └── sections/    → Hero, Services, About, Gallery, Menu, Reservation, Contact...
├── hooks/           → Lógica reutilizable (useScrollSpy, useContactForm)
├── services/        → Servicios puros JS (theme.service, meta)
├── types/           → Interfaces TypeScript compartidas
├── config/          → Un archivo por cliente (restaurant.config.ts, etc.)
└── styles/          → globals.css con variables CSS
```

## Añadir un nuevo cliente

1. Copia `src/config/restaurant.config.ts` → `src/config/nuevo-cliente.config.ts`
2. Cambia los valores (nombre, colores, textos, secciones activas)
3. En `src/main.tsx`, cambia el import al nuevo config
4. `npm run build` → sube a Vercel/Netlify con su dominio

## Comandos

```bash
npm install        # Instalar dependencias
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
```

## Sectores disponibles

| Sector     | Config ejemplo          | Secciones extra             |
|------------|-------------------------|-----------------------------|
| Restaurante | restaurant.config.ts   | Menú, Reservas              |
| Moda       | fashion.config.ts       | Tienda (WhatsApp/Stripe)    |
| Salud      | health.config.ts        | Citas, Servicios            |
| Hotel      | hotel.config.ts         | Galería, Reservas           |
| Mascotas   | pets.config.ts          | Servicios, Productos        |
| Taller     | workshop.config.ts      | Servicios, Presupuesto      |

## Personalización rápida

Cada config define:
- **Colores**: `theme.colors.primary` y `theme.colors.accent`
- **Fuentes**: `theme.fonts.display` y `theme.fonts.body` (Google Fonts)
- **Border radius**: `theme.radius` (más cuadrado = más formal, más redondo = más moderno)
- **Secciones activas**: cada sección opcional tiene `enabled: true/false`

## Deploy en Vercel (recomendado)

```bash
npm i -g vercel
vercel --prod
```

Cada cliente tiene su propio proyecto en Vercel con su dominio personalizado.
=======
# web-templates
Templates
>>>>>>> cb57c0bfa40f199a9fac83cc159fb492d386e8da
