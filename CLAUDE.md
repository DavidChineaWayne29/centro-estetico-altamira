# CONTEXTO DEL PROYECTO — Web Templates para Negocios Locales

## Modelo de negocio
Ofrezco páginas web profesionales a negocios locales en Tenerife (Canarias, España).
El flujo es: prospecto sin web → demo personalizada → 50% adelanto → desarrollo → entrega + 50% restante → mantenimiento mensual recurrente.

## Stack tecnológico
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Base de datos:** Supabase (una instancia por cliente, aisladas entre sí)
- **Deploy:** Vercel (un proyecto por cliente, dominio propio)
- **Email:** Resend (confirmaciones de reservas, mensajes de contacto)
- **DNS:** Cloudflare
- **Monitorización:** UptimeRobot
- **Facturación:** Holded
- **Analytics:** Vercel Analytics (gratis) + Plausible (plan premium)

## Principios de arquitectura — NO negociables
1. **Cero datos mockeados** — todo viene de Supabase, nada hardcodeado en el código
2. **i18n desde el principio** — react-i18next, literales en archivos de traducción ES/EN, nunca texto hardcodeado en componentes
3. **Separación total de capas:**
   - `services/` — lógica pura JS/TS sin dependencia de React (portable a Angular u otro framework)
   - `hooks/` — conectan los services con React
   - `components/` — solo renderizado, sin lógica de negocio
   - `config/` — configuración visual por cliente (colores, fuentes, secciones activas)
4. **Responsive obligatorio** — mobile first, probado en iPhone y Android
5. **Escalable** — añadir un nuevo cliente = copiar config + apuntar a su Supabase

## Estructura de carpetas
```
src/
├── components/
│   ├── ui/          → Button, SectionWrapper, Badge, Spinner, Toast, Modal...
│   ├── layout/      → Navbar, Footer, AdminSidebar
│   └── sections/    → Hero, Services, About, Gallery, Menu, Reservation, Contact...
├── hooks/           → useMenu, useTestimonials, useSiteConfig, useContactForm, useScrollSpy
├── services/        → supabase.ts, theme.service.ts, restaurant.service.ts, resend.service.ts
├── types/           → index.ts con todas las interfaces TypeScript
├── config/          → restaurant.config.ts (y futuros: fashion.config.ts, hotel.config.ts...)
├── locales/         → es.json, en.json
├── pages/
│   ├── Site.tsx     → web pública del cliente
│   └── admin/       → panel de administración del cliente
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── Reservas.tsx
│       ├── Mensajes.tsx
│       ├── Menu.tsx
│       ├── Galeria.tsx
│       └── Configuracion.tsx
├── email-templates/ → plantillas HTML para Resend
└── styles/          → globals.css con variables CSS
```

## Supabase
- **Modelo:** una base de datos por cliente (proyectos Supabase separados)
- **Tablas ya creadas:** site_config, menu_categories, menu_items, gallery, testimonials, reservations, contact_messages
- **RLS activado:** lectura pública para datos del sitio, escritura pública solo para reservas y contacto
- **Credenciales del restaurante demo:**
  - URL: https://dydciqniifiyybbwooux.supabase.co
  - Publishable key: sb_publishable_kACLb8JNVlQPXREznxsdng_6fr9l1av
  - Variables de entorno en .env.local (nunca commitear este archivo)

## Sectores de clientes previstos
Cada sector tiene su propio config file y puede activar/desactivar secciones:

| Sector | Config | Secciones extra |
|---|---|---|
| Restaurante | restaurant.config.ts | Menú con alérgenos, Reservas |
| Moda | fashion.config.ts | Tienda (WhatsApp/Stripe) |
| Salud y belleza | health.config.ts | Citas online, Servicios |
| Hotel | hotel.config.ts | Galería, Reservas |
| Mascotas | pets.config.ts | Servicios, Productos |
| Taller | workshop.config.ts | Servicios, Presupuesto |

## Sistema de temas
Los colores, fuentes y border-radius se definen en el config de cada cliente y se aplican como variables CSS en runtime mediante `theme.service.ts`. Tailwind lee esas variables. Cambiar el tema de un cliente = editar su config, sin tocar componentes.

## i18n
- Librería: react-i18next
- Idiomas: ES (principal) y EN (turismo en Tenerife)
- Archivos: src/i18n/es.json y src/i18n/en.json
- Regla: NUNCA escribir texto visible al usuario directamente en un componente. Siempre usar t('clave')
- Estructura de claves: nav.home, hero.headline, menu.title, contact.address...

---

## Panel admin del cliente
Ruta: /admin (protegida con Supabase Auth — email + contraseña)
El cliente accede con sus credenciales y gestiona su web sin tocar código.

### Autenticación
- Supabase Auth con email + contraseña
- Ruta protegida con PrivateRoute → redirige a /admin/login si no autenticado
- Sesión persistente con refresh token automático
- El cliente nunca ve el código ni el dashboard de Supabase

### Páginas del admin
```
/admin/login          → Formulario de acceso
/admin                → Dashboard con resumen (reservas pendientes, mensajes nuevos, visitas)
/admin/reservas       → Lista de reservas con filtros por fecha y estado
/admin/mensajes       → Bandeja de mensajes de contacto (marcar como leído)
/admin/menu           → Gestión completa del menú (CRUD de categorías y platos)
/admin/galeria        → Subir/reordenar/eliminar fotos (Supabase Storage)
/admin/configuracion  → Editar info del negocio (horarios, teléfono, dirección, email)
```

### Funcionalidades por página

**Dashboard:**
- Contador de reservas pendientes de confirmar
- Contador de mensajes no leídos
- Últimas 5 reservas
- Gráfico de reservas de los últimos 30 días (recharts)
- Acceso rápido a las secciones más usadas

**Reservas:**
- Tabla con: nombre, fecha, hora, comensales, estado, notas
- Filtros: por fecha, por estado (pendiente/confirmada/cancelada)
- Acciones: confirmar, cancelar → dispara email automático al cliente
- Exportar a CSV

**Mensajes:**
- Lista con nombre, email, fecha, preview del texto
- Marcar como leído/no leído
- Responder directamente por email (abre cliente de correo)
- Eliminar

**Menú:**
- Tabs por categoría igual que la web pública
- Añadir/editar/eliminar categorías
- Por cada plato: nombre, descripción ES + EN (auto-traducción MyMemory API), precio, imagen, alérgenos, diet_tags, disponibilidad (toggle)
- Subida de imagen directa a Supabase Storage
- Preview en tiempo real del plato

**Galería:**
- Grid de imágenes subidas
- Subida múltiple de fotos a Supabase Storage
- Reordenar y eliminar con confirmación

**Configuración:**
- Formulario con: nombre del negocio, dirección, teléfono, email, WhatsApp, horarios
- Guardar cambios → actualiza tabla site_config en Supabase

### Diseño del admin
- Sidebar fijo en desktop, drawer en móvil
- Paleta neutra (grises) independiente del tema del cliente
- Componentes: tabla, modal de confirmación, toast de éxito/error, skeleton loader
- Totalmente responsive — el cliente puede gestionar desde el móvil

---

## Notificaciones por email (Resend)
- **Servicio:** Resend (resend.com) — gratuito hasta 3.000 emails/mes
- **Implementación:** Supabase Edge Functions — la API key de Resend NUNCA va al frontend

### Emails automáticos

**Reserva recibida (al restaurante):**
- Asunto: Nueva reserva — [nombre] para [fecha] a las [hora]
- Contenido: datos completos + botón Confirmar + botón Cancelar

**Confirmación (al cliente):**
- Se envía cuando el restaurante confirma desde el admin o desde el email
- Asunto: Tu reserva en [nombre restaurante] está confirmada

**Cancelación (al cliente):**
- Asunto: Información sobre tu reserva en [nombre restaurante]
- Contenido: notificación + invitación a reservar otra fecha

**Mensaje de contacto (al restaurante):**
- Asunto: Nuevo mensaje de [nombre]
- Contenido: nombre, email, teléfono, mensaje completo + botón responder

### Plantillas de email
- HTML simple con inline CSS (compatible con todos los clientes de correo)
- Logo y colores del cliente en la cabecera
- Versión ES y EN según idioma del visitante
- Guardadas en: src/email-templates/

### Supabase Edge Functions
```
supabase/functions/
├── send-reservation-notification/   → dispara al insertar en reservations
├── send-confirmation/               → dispara al confirmar reserva
├── send-cancellation/               → dispara al cancelar reserva
└── send-contact-notification/       → dispara al insertar en contact_messages
```
Activadas con Supabase Database Webhooks — automáticas, sin llamada manual desde el frontend.

---

## Analytics — Vercel Analytics + Plausible

### Vercel Analytics (incluido gratis)
- Activar con: `import { Analytics } from '@vercel/analytics/react'` en main.tsx
- Métricas: páginas vistas, visitantes únicos, países, dispositivos
- Sin cookies — compatible con RGPD sin banner de cookies
- Visible en el dashboard de Vercel

### Plausible (plan premium, ~9€/mes)
- Dashboard más completo y personalizable
- Link público para compartir estadísticas con el cliente
- Eventos personalizados: reservas realizadas, clics en WhatsApp, descargas de carta PDF
- Sin cookies — compatible con RGPD

### Estrategia comercial
- **Plan básico/estándar:** Vercel Analytics (gratis, incluido)
- **Plan premium:** Plausible como upgrade — el cliente ve sus visitas en detalle → percibe más valor → menos cancelaciones de mantenimiento

### Implementación Vercel Analytics
```tsx
// main.tsx
import { Analytics } from '@vercel/analytics/react'
// Añadir dentro del render: <Analytics />
```

### Implementación Plausible
```html
<!-- index.html -->
<script defer data-domain="dominiocliente.com" src="https://plausible.io/js/script.js"></script>
```

---

## Deploy en Vercel

### Estructura de proyectos
- Un proyecto Vercel por cliente
- Mismo repo GitHub, branches por cliente — o repo independiente por cliente (recomendado)
- Variables de entorno distintas por proyecto

### Variables de entorno por proyecto
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxx
VITE_SITE_CONFIG=restaurant
```

### Dominio personalizado
1. DNS en Cloudflare → CNAME apuntando a cname.vercel-dns.com
2. En Vercel: Settings → Domains → añadir dominio del cliente
3. SSL automático con Let's Encrypt — Vercel lo gestiona solo

### vercel.json (obligatorio para SPA con React Router)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Flujo de deploy
- Push a branch del cliente → Vercel despliega automáticamente en ~30 segundos
- Preview deployments para mostrar cambios al cliente antes de publicar
- Rollback instantáneo desde el dashboard de Vercel

### Checklist antes de entregar al cliente
- [ ] Dominio configurado y SSL activo
- [ ] Variables de entorno correctas en Vercel (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] Emails de prueba enviados y recibidos
- [ ] Admin probado con credenciales del cliente
- [ ] Analytics activado y mostrando datos
- [ ] UptimeRobot configurado con email de alerta
- [ ] Web probada en iOS Safari, Chrome Android, Chrome Desktop, Firefox
- [ ] Formularios de reserva y contacto probados end-to-end
- [ ] Lighthouse score > 90 en todas las métricas

---

## Flujo de trabajo para un nuevo cliente
1. Crear proyecto Supabase → ejecutar schema.sql → insertar datos iniciales
2. Crear usuario admin en Supabase Auth para el cliente
3. Copiar config existente → adaptar colores, fuentes, textos, secciones activas
4. Crear proyecto en Vercel → conectar repo → añadir variables de entorno
5. Configurar dominio en Cloudflare → apuntar a Vercel
6. Configurar Resend con dominio del cliente
7. Desplegar Edge Functions de Supabase
8. Activar Vercel Analytics
9. Configurar UptimeRobot para monitorización
10. Entregar acceso admin al cliente + guía de uso

---

## Normas de trabajo con Claude Code

### Arquitectura de proyectos por cliente
- Cada cliente = repo GitHub independiente + proyecto Vercel propio
- `web-templates` es la plantilla base — nunca se despliega directamente a un cliente
- Al crear un proyecto nuevo, clonar `web-templates` y adaptar solo el config y los datos en Supabase
- `SolimarPage` enlaza a las URLs de Vercel desplegadas de cada cliente (nunca rutas locales)

### Uso eficiente de contexto
- **Antes de leer archivos del template, asumir que la estructura es la documentada en este CLAUDE.md**
- Solo leer un archivo si hay duda concreta sobre su implementación actual
- Para proyectos de cliente nuevos: usar `web-templates` como referencia sin releer todo el código
- Evitar explorar node_modules o archivos generados

---

## Lo que NO hacer
- No hardcodear textos en componentes (usar i18n siempre)
- No poner datos de clientes en el código (todo en Supabase)
- No commitear .env.local ni credenciales
- No mezclar lógica de negocio en componentes
- No crear componentes que sepan de qué sector son (genéricos siempre)
- No usar localStorage para datos de negocio
- No instalar librerías pesadas si hay alternativa nativa o ligera
- No poner la API key de Resend en el frontend (usar Edge Functions)
- No añadir rutas demo dentro del repo template (cada cliente tiene su propio repo)

---

## Comandos útiles
```bash
npm run dev          # Desarrollo local (puerto 5173 o siguiente disponible)
npm run build        # Build de producción
npm run preview      # Preview del build
git add . && git commit -m "feat: descripción" && git push  # Subir cambios → Vercel auto-despliega
npx supabase functions deploy send-reservation-notification  # Deploy edge function
```

---

## Estado actual del proyecto
- [x] Estructura de carpetas creada
- [x] Sistema de tipos TypeScript completo
- [x] Config del restaurante demo (El Rincón Canario) con imágenes Unsplash
- [x] Theme service (aplica CSS variables en runtime)
- [x] Componentes base: Navbar, Footer, Hero, Services, About, Gallery, MenuSection, ReservationSection, Testimonials, Contact
- [x] Hooks: useScrollSpy, useContactForm, useMenuData, useGalleryData, useTestimonialsData
- [x] Supabase client (src/lib/supabase.ts) con fallback graceful si faltan env vars
- [x] Schema SQL completo (supabase/schema.sql) con RLS y datos demo
- [x] i18n con react-i18next — ES/EN completo en todos los componentes
- [x] Menú bilingüe: description (ES) + description_en (EN, auto-traducción en admin)
- [x] Formularios de contacto y reserva guardando en Supabase
- [x] Panel admin /admin con Supabase Auth (login, menú CRUD, reservas, mensajes)
- [x] Auto-traducción ES→EN en admin (MyMemory API, debounce 900ms)
- [x] Deploy en Vercel con vercel.json para SPA routing
- [x] CLAUDE.md actualizado con arquitectura completa
- [ ] Supabase Storage para imágenes de galería y menú (subida desde admin)
- [ ] Notificaciones por email con Resend + Edge Functions
- [ ] Vercel Analytics en main.tsx
- [ ] Dashboard admin con métricas y gráficos (recharts)
- [ ] Variantes de otros sectores (moda, salud, hotel, mascotas, taller)
