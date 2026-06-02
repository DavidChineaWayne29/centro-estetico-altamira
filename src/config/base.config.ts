import type { SiteConfig } from '@/types'

/**
 * TEMPLATE BASE — Punto de partida para cualquier sector
 * -------------------------------------------------------
 * Copia este archivo, renómbralo (fashion.config.ts, health.config.ts, etc.)
 * y adapta: colores, fuentes, textos, secciones activas.
 * El 80% del código se reutiliza — solo cambia el config y los datos en Supabase.
 *
 * Sectores disponibles:
 *   restaurant → restaurant.config.ts  (menú + reservas)
 *   fashion    → fashion.config.ts     (catálogo + tienda)
 *   health     → health.config.ts      (citas + servicios)
 *   hotel      → hotel.config.ts       (galería + reservas)
 *   pets       → pets.config.ts        (servicios + info)
 *   workshop   → workshop.config.ts    (servicios + presupuesto)
 *   generic    → base.config.ts        ← este archivo
 */

export const siteConfig: SiteConfig = {
  // ─── Meta ────────────────────────────────────────────────────────────────
  siteName: 'Tu Negocio',
  siteUrl: 'https://tunegocio.com',
  metaDescription: 'Profesionales en Tenerife. Calidad, confianza y atención personalizada.',
  sector: 'generic',

  // ─── Tema visual ─────────────────────────────────────────────────────────
  // Paleta azul/slate — profesional y neutra, válida para cualquier sector
  theme: {
    colors: {
      primary: {
        50:  '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        400: '#60a5fa',
        600: '#2563eb',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      accent: {
        400: '#f59e0b',
        600: '#d97706',
      },
      neutral: {
        50:  '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        400: '#94a3b8',
        600: '#475569',
        800: '#1e293b',
        900: '#0f172a',
      },
    },
    fonts: {
      display: 'Inter',
      body: 'Inter',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
      bodyUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    },
    radius: '0.5rem',
  },

  // ─── Navegación ───────────────────────────────────────────────────────────
  nav: {
    logo: 'Tu Negocio',
    logoIsImage: false,
    links: [
      { label: 'Inicio',    href: '#inicio' },
      { label: 'Servicios', href: '#servicios' },
      { label: 'Nosotros',  href: '#nosotros' },
      { label: 'Galería',   href: '#galeria' },
      { label: 'Contacto',  href: '#contacto' },
    ],
    ctaLabel: 'Contactar',
    ctaHref: '#contacto',
  },

  // ─── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    headline: 'Profesionales que marcan la diferencia',
    subheadline: 'Llevamos años ayudando a negocios de Tenerife a crecer. Calidad, confianza y resultados.',
    ctaPrimary:   { label: 'Contactar ahora', href: '#contacto' },
    ctaSecondary: { label: 'Conocer más',     href: '#nosotros' },
    backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    overlayOpacity: 0.55,
  },

  // ─── Servicios ────────────────────────────────────────────────────────────
  services: {
    title: 'Lo que ofrecemos',
    subtitle: 'Soluciones adaptadas a tu negocio',
    items: [
      {
        icon: 'Star',
        title: 'Calidad garantizada',
        description: 'Trabajamos con los mejores materiales y procesos para asegurar resultados duraderos.',
      },
      {
        icon: 'Clock',
        title: 'Puntualidad',
        description: 'Respetamos tu tiempo. Cumplimos plazos y horarios en cada proyecto.',
      },
      {
        icon: 'Shield',
        title: 'Confianza',
        description: 'Más de 10 años de experiencia respaldan cada trabajo que realizamos.',
      },
      {
        icon: 'MessageCircle',
        title: 'Atención personalizada',
        description: 'Trato directo y cercano. Siempre hay alguien disponible para atenderte.',
      },
    ],
  },

  // ─── Sobre nosotros ───────────────────────────────────────────────────────
  about: {
    title: 'Quiénes somos',
    body: 'Somos un equipo de profesionales comprometidos con la excelencia. Desde nuestros inicios en Tenerife, hemos ayudado a cientos de clientes a conseguir sus objetivos con un servicio de calidad y atención personalizada.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  },

  // ─── Galería ──────────────────────────────────────────────────────────────
  gallery: {
    title: 'Nuestro trabajo',
    subtitle: 'Algunos de nuestros proyectos recientes',
    images: [
      { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80', alt: 'Oficina moderna' },
      { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80', alt: 'Equipo trabajando' },
      { src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80', alt: 'Reunión de trabajo' },
      { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80', alt: 'Presentación' },
      { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80', alt: 'Resultado final' },
      { src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80', alt: 'Proyecto completado' },
    ],
  },

  // ─── Testimonios ──────────────────────────────────────────────────────────
  testimonials: {
    enabled: true,
    title: 'Lo que dicen nuestros clientes',
    items: [
      {
        author: 'Ana Martín',
        role: 'Empresaria',
        text: 'Profesionales como pocos. Cumplieron con todo lo prometido y el resultado superó mis expectativas.',
        rating: 5,
      },
      {
        author: 'Roberto Silva',
        role: 'Autónomo',
        text: 'Trato cercano, precios justos y calidad excelente. Los recomiendo sin dudarlo.',
        rating: 5,
      },
      {
        author: 'Laura Pérez',
        role: 'Directora comercial',
        text: 'Llevamos 3 años trabajando juntos y siempre superan nuestras expectativas.',
        rating: 5,
      },
    ],
  },

  // ─── Contacto ─────────────────────────────────────────────────────────────
  contact: {
    title: 'Encuéntranos',
    subtitle: 'Lunes a viernes, de 9:00 a 18:00',
    address: 'Calle Ejemplo 1, Santa Cruz de Tenerife',
    phone: '+34 922 000 000',
    email: 'hola@tunegocio.com',
    whatsapp: '+34 600 000 000',
    showForm: true,
  },

  // ─── Footer ───────────────────────────────────────────────────────────────
  footer: {
    tagline: 'Profesionales en Tenerife. Desde 2014.',
    links: [
      { label: 'Aviso legal',          href: '/legal' },
      { label: 'Política de cookies',  href: '/cookies' },
    ],
    legalText: `© ${new Date().getFullYear()} Tu Negocio. Todos los derechos reservados.`,
  },

  // ─── Secciones opcionales desactivadas por defecto ───────────────────────
  // Actívalas según el sector del cliente:
  //   menu:        { enabled: true, ... }  → restaurantes
  //   reservation: { enabled: true, ... }  → restaurantes, hoteles
  //   shop:        { enabled: true, ... }  → moda, mascotas
}
