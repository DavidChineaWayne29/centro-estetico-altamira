# SKILLS — Reglas obligatorias para este proyecto

Estas reglas se aplican SIEMPRE en cada tarea, sin excepción.
Antes de escribir cualquier línea de código, lee y respeta este archivo.

---

## REGLA 1 — NADA MOCKEADO. NUNCA.

### Lo que está prohibido
- Arrays hardcodeados en componentes o hooks
- Objetos de datos escritos directamente en el código
- Funciones que simulan delays (`setTimeout`) para fingir una llamada a API
- Variables con datos de ejemplo dentro de componentes
- Cualquier dato que no venga de Supabase

### Lo que debes hacer SIEMPRE
- Todos los datos vienen de Supabase mediante hooks (`useMenu`, `useSiteConfig`, etc.)
- Mientras cargan los datos → mostrar skeleton loader o spinner
- Si hay error → mostrar mensaje de error claro al usuario
- Si no hay datos → mostrar estado vacío con mensaje descriptivo

### Patrón obligatorio para cualquier dato
```tsx
// CORRECTO
const { data, loading, error } = useAlgunDato()

if (loading) return <Spinner />
if (error)   return <ErrorMessage message={error} />
if (!data || data.length === 0) return <EmptyState />
return <ComponenteConDatos data={data} />

// INCORRECTO — NUNCA HACER ESTO
const items = [
  { name: 'Ejemplo 1', price: '10€' },
  { name: 'Ejemplo 2', price: '20€' },
]
```

### Estados UI obligatorios en cada componente con datos
Cada sección que lea de Supabase debe implementar los 4 estados:
1. **loading** — skeleton con la forma del contenido final (no spinner genérico si es posible)
2. **error** — mensaje claro + botón de reintentar
3. **empty** — mensaje descriptivo de qué hacer (útil para el admin)
4. **data** — el contenido real

---

## REGLA 2 — TODO TEXTO ES UN LITERAL DE TRADUCCIÓN

### Lo que está prohibido
```tsx
// INCORRECTO — texto hardcodeado
<h1>Bienvenido a nuestro restaurante</h1>
<button>Reservar mesa</button>
<p>No hay elementos disponibles</p>
```

### Lo que debes hacer SIEMPRE
```tsx
// CORRECTO
const { t } = useTranslation()
<h1>{t('hero.headline')}</h1>
<button>{t('nav.cta')}</button>
<p>{t('common.empty')}</p>
```

### Archivos de traducción
- `src/i18n/es.json` — español (idioma principal)
- `src/i18n/en.json` — inglés (turismo en Tenerife)
- Ambos archivos deben estar SIEMPRE sincronizados — mismas claves, distinto valor

### Estructura de claves obligatoria
```json
{
  "common": {
    "loading": "Cargando...",
    "error": "Ha ocurrido un error",
    "retry": "Intentar de nuevo",
    "empty": "No hay elementos disponibles",
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "edit": "Editar",
    "add": "Añadir",
    "confirm": "Confirmar",
    "back": "Volver"
  },
  "nav": {
    "home": "Inicio",
    "menuLink": "Menú",
    "about": "Nosotros",
    "gallery": "Galería",
    "contact": "Contacto",
    "reservations": "Reservas",
    "book": "Reservar mesa"
  },
  "hero": {
    "headline": "...",
    "subheadline": "...",
    "ctaPrimary": "...",
    "ctaSecondary": "...",
    "scroll": "Scroll"
  },
  "menu": {
    "title": "Nuestra carta",
    "allergens": "Alérgenos",
    "all": "Todos",
    "seeMore": "Ver más"
  },
  "dietary": {
    "vegetariano": "Vegetariano",
    "vegano": "Vegano",
    "singluten": "Sin gluten",
    "sinlactosa": "Sin lactosa"
  },
  "reservation": {
    "title": "Reserva tu mesa",
    "name": "Nombre",
    "email": "Email",
    "phone": "Teléfono",
    "date": "Fecha",
    "time": "Hora",
    "guests": "Comensales",
    "notes": "Notas o peticiones especiales",
    "notesPlaceholder": "Alergias, celebraciones...",
    "submit": "Confirmar reserva",
    "sending": "Enviando...",
    "successTitle": "¡Reserva recibida!",
    "successText": "Te confirmaremos por email o teléfono en menos de 2 horas.",
    "another": "Hacer otra reserva"
  },
  "contact": {
    "sectionTitle": "Encuéntranos",
    "address": "Dirección",
    "phone": "Teléfono",
    "email": "Email",
    "whatsapp": "Escríbenos por WhatsApp",
    "name": "Nombre",
    "message": "Mensaje",
    "submit": "Enviar mensaje",
    "sending": "Enviando...",
    "successTitle": "¡Mensaje enviado!",
    "successText": "Te responderemos lo antes posible."
  },
  "admin": {
    "login": {
      "title": "Acceso al panel",
      "email": "Email",
      "password": "Contraseña",
      "submit": "Entrar",
      "error": "Email o contraseña incorrectos"
    },
    "dashboard": {
      "title": "Panel de control",
      "pendingReservations": "Reservas pendientes",
      "newMessages": "Mensajes nuevos",
      "recentReservations": "Últimas reservas"
    },
    "reservations": {
      "title": "Reservas",
      "pending": "Pendiente",
      "confirmed": "Confirmada",
      "cancelled": "Cancelada",
      "confirm": "Confirmar",
      "cancel": "Cancelar",
      "export": "Exportar CSV"
    },
    "messages": {
      "title": "Mensajes",
      "markRead": "Marcar como leído",
      "reply": "Responder",
      "delete": "Eliminar"
    },
    "menu": {
      "title": "Gestión del menú",
      "addCategory": "Añadir categoría",
      "addItem": "Añadir plato",
      "available": "Disponible",
      "unavailable": "No disponible"
    },
    "gallery": {
      "title": "Galería",
      "upload": "Subir fotos",
      "delete": "Eliminar foto"
    },
    "settings": {
      "title": "Configuración",
      "businessName": "Nombre del negocio",
      "address": "Dirección",
      "phone": "Teléfono",
      "email": "Email",
      "whatsapp": "WhatsApp",
      "schedule": "Horario",
      "save": "Guardar cambios",
      "saved": "Cambios guardados"
    }
  }
}
```

### Textos dinámicos con variables
```tsx
// Con interpolación
t('menu.vegOptions', { count: vegCount })
// en es.json: "vegOptions": "{{count}} opciones vegetarianas/veganas"

// Con plurales
t('guests', { count: n })
// en es.json: "guests_one": "{{count}} persona", "guests_other": "{{count}} personas"
```

### Selector de idioma
- Siempre visible en el Navbar (icono Globe + ES/EN)
- Cambia el idioma en runtime sin recargar la página
- Guardar preferencia en localStorage (única excepción permitida para localStorage)

---

## REGLA 3 — TODO ES RESPONSIVE. MOBILE FIRST.

### Lo que está prohibido
- Diseñar primero en desktop y luego adaptar
- Clases de Tailwind sin prefijo mobile (el base es mobile)
- Textos que se salen del viewport en móvil
- Tablas sin scroll horizontal en móvil
- Botones demasiado pequeños para tocar (mínimo 44x44px táctil)
- Imágenes sin `object-fit` que se deformen
- Modales que no caben en pantalla pequeña

### Breakpoints obligatorios
```
base (0px)   → móvil → diseño principal
sm (640px)   → móvil grande / tablet pequeña
md (768px)   → tablet
lg (1024px)  → desktop
xl (1280px)  → desktop grande
```

### Patrones responsive obligatorios
```tsx
// Grid responsive
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"

// Texto responsive
className="text-2xl sm:text-3xl lg:text-5xl"

// Padding responsive
className="px-4 sm:px-6 lg:px-8"

// Flex que colapsa en móvil
className="flex flex-col sm:flex-row gap-4"

// Tabla con scroll en móvil
<div className="overflow-x-auto">
  <table className="min-w-full">...</table>
</div>

// Modal responsive — bottom sheet en móvil, centrado en desktop
className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center"
```

### Navegación responsive
- Desktop: links horizontales en Navbar
- Móvil: menú hamburguesa con drawer
- Admin desktop: sidebar fijo
- Admin móvil: sidebar como drawer con overlay

### Imágenes responsive
```tsx
// Siempre con object-cover y dimensiones controladas
<img className="w-full h-48 sm:h-64 object-cover rounded-lg" />

// Lazy loading siempre
<img loading="lazy" />
```

### Prueba obligatoria antes de cada commit
Verificar en DevTools con estos viewports:
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (iPad)
- 1280px (Desktop)

---

## REGLA 4 — TODO TIENE PANEL ADMIN

### Principio
Si un dato se muestra en la web pública, el cliente debe poder editarlo desde /admin sin tocar código ni llamarte a ti.

### Lo que SIEMPRE debe ser editable desde el admin
| Dato en la web | Página en admin |
|---|---|
| Platos del menú | /admin/menu |
| Fotos de galería | /admin/galeria |
| Info de contacto y horarios | /admin/configuracion |
| Reservas recibidas | /admin/reservas |
| Mensajes de contacto | /admin/mensajes |
| Testimonios | /admin/testimonios |
| Disponibilidad de platos | /admin/menu (toggle) |

### Patrón CRUD obligatorio en admin
Cada entidad editable debe tener:
1. **Lista** — tabla o grid con todos los elementos
2. **Crear** — botón + modal o página con formulario
3. **Editar** — botón editar en cada fila + mismo formulario precargado
4. **Eliminar** — botón eliminar + modal de confirmación (nunca eliminar sin confirmar)
5. **Feedback** — toast de éxito o error tras cada acción

```tsx
// Patrón modal de confirmación obligatorio para eliminar
<ConfirmModal
  isOpen={deleteModal}
  title={t('common.confirmDelete')}
  body={t('admin.menu.confirmDeleteItem', { name: item.name })}
  onConfirm={handleDelete}
  onCancel={() => setDeleteModal(false)}
/>
```

### Protección de rutas admin
```tsx
// Todas las rutas /admin/* deben estar protegidas
<Route path="/admin/*" element={
  <PrivateRoute>
    <AdminLayout />
  </PrivateRoute>
} />
```

### Acciones en admin que disparan emails
- Confirmar reserva → email de confirmación al cliente
- Cancelar reserva → email de cancelación al cliente
- Estas acciones llaman a Supabase Edge Functions, no a Resend directamente

---

## REGLA 5 — SEPARACIÓN DE CAPAS

### Services (src/services/)
- Puro TypeScript, sin imports de React
- Toda la lógica de comunicación con Supabase, Resend, etc.
- Exporta funciones async, no hooks
- Portable a cualquier framework

```ts
// CORRECTO — service puro
export async function getMenuItems(categoryId: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category_id', categoryId)
    .eq('available', true)
  if (error) throw new Error(error.message)
  return data
}

// INCORRECTO — lógica de negocio en un componente
function MenuSection() {
  const [items, setItems] = useState([])
  useEffect(() => {
    supabase.from('menu_items').select('*').then(...)
  }, [])
}
```

### Hooks (src/hooks/)
- Usan los services y conectan con React
- Gestionan loading, error y data
- Nunca llaman a Supabase directamente — siempre a través de services

```ts
// CORRECTO
export function useMenuItems(categoryId: string) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMenuItems(categoryId)  // llama al service
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [categoryId])

  return { data, loading, error }
}
```

### Components (src/components/)
- Solo renderizado y eventos de UI
- No llaman a Supabase directamente
- Reciben datos por props o usan hooks
- No contienen lógica de negocio

---

## REGLA 6 — SEGURIDAD

- Nunca commitear `.env.local` (está en .gitignore)
- La API key de Resend nunca va al frontend — solo en Supabase Edge Functions
- La service_role key de Supabase nunca va al frontend — solo en Edge Functions
- RLS activado en todas las tablas de Supabase
- Solo la publishable key (anon) va en las variables de entorno del frontend
- Inputs de formularios siempre validados en cliente Y en Supabase (constraints)

---

## RESUMEN — Checklist antes de cada commit

Antes de hacer git commit, verificar:

- [ ] ¿Hay algún texto hardcodeado en un componente? → moverlo a i18n/es.json y i18n/en.json
- [ ] ¿Hay algún dato mockeado o hardcodeado? → conectarlo a Supabase
- [ ] ¿Se implementaron los 4 estados (loading, error, empty, data)?
- [ ] ¿Se probó en móvil (375px) y desktop (1280px)?
- [ ] ¿El dato nuevo es editable desde el panel admin?
- [ ] ¿Se añadió la ruta admin correspondiente si es necesario?
- [ ] ¿Las credenciales están en .env.local y no en el código?
- [ ] ¿Los services están separados de los hooks y componentes?
