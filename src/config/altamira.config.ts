import type { SiteConfig } from '@/types'

/**
 * Centro Estético Altamira — clínica estética premium en Tenerife
 * Tema: blanco + verde salvia + oro suave
 * Tipografía: Poppins (display) + Inter (body)
 */
export const siteConfig: SiteConfig = {
  siteName: 'Centro Estético Altamira',
  siteUrl: 'https://centroaltamira.es',
  metaDescription: 'Centro estético premium en Santa Cruz de Tenerife. Tratamientos faciales, corporales y relajantes. Cita online disponible 24h.',
  sector: 'health',

  theme: {
    colors: {
      primary: {
        50:  '#f0faf4',
        100: '#dcf5e7',
        200: '#bbe9d0',
        400: '#4db882',
        600: '#2a9459',
        800: '#1a6640',
        900: '#0f3d26',
      },
      accent: {
        400: '#c9a84c',
        600: '#a8892e',
      },
      neutral: {
        50:  '#fafafa',
        100: '#f5f5f5',
        200: '#e8e8e8',
        400: '#a0a0a0',
        600: '#606060',
        800: '#242424',
        900: '#141414',
      },
    },
    fonts: {
      display: 'Poppins',
      body:    'Inter',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
      bodyUrl:    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
    },
    radius: '1rem',
  },

  nav: {
    logo: 'Altamira',
    logoIsImage: false,
    links: [
      { label: 'Inicio',        href: '#inicio' },
      { label: 'Servicios',     href: '#servicios' },
      { label: 'Nosotras',      href: '#nosotros' },
      { label: 'Pide tu cita',  href: '#cita' },
      { label: 'Contacto',      href: '#contacto' },
    ],
    ctaLabel: 'Pedir cita',
    ctaHref:  '#cita',
  },

  hero: {
    headline:    'Tu bienestar, nuestra pasión',
    subheadline: 'Centro estético premium en Santa Cruz de Tenerife. Tratamientos personalizados con las últimas técnicas. Pide tu cita en segundos.',
    ctaPrimary:   { label: 'Pedir cita ahora', href: '#cita' },
    ctaSecondary: { label: 'Ver tratamientos', href: '#servicios' },
    backgroundImage: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1920&q=80',
    overlayOpacity: 0.35,
  },

  services: {
    title:    'Nuestros tratamientos',
    subtitle: 'Cada tratamiento, diseñado para ti',
    items: [
      {
        icon: 'Sparkles',
        title: 'Tratamientos faciales',
        description: 'Hidratación profunda, antiedad, limpieza facial y mesoterapia. Resultados visibles desde la primera sesión.',
      },
      {
        icon: 'Zap',
        title: 'Depilación láser',
        description: 'Tecnología láser de última generación. Resultados permanentes en pocas sesiones, sin dolor.',
      },
      {
        icon: 'Heart',
        title: 'Tratamientos corporales',
        description: 'Reductores, reafirmantes y anticelulíticos. Moldea tu figura con tratamientos personalizados.',
      },
      {
        icon: 'Leaf',
        title: 'Masajes y relajación',
        description: 'Masajes terapéuticos, drenaje linfático y técnicas orientales para liberar la tensión.',
      },
    ],
  },

  about: {
    title: 'Más de 10 años cuidándote',
    body:  'Somos un equipo de profesionales especializadas en estética avanzada. Nuestro centro, ubicado en el corazón de Santa Cruz, combina la última tecnología con un trato cercano y personalizado. Cada clienta es única y merece un protocolo adaptado a sus necesidades. Tu bienestar es nuestra mayor recompensa.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  },

  gallery: {
    title:    'Nuestro espacio',
    subtitle: 'Un ambiente pensado para tu bienestar',
    images: [
      { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', alt: 'Sala de tratamientos' },
      { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80', alt: 'Tratamiento facial' },
      { src: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=600&q=80', alt: 'Zona de relajación' },
      { src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80', alt: 'Cabina privada' },
      { src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80', alt: 'Tratamiento corporal' },
      { src: 'https://images.unsplash.com/photo-1560750133-726e9ea0ac52?auto=format&fit=crop&w=600&q=80', alt: 'Recepción' },
    ],
  },

  testimonials: {
    enabled: true,
    title: 'Lo que dicen nuestras clientas',
    items: [
      {
        author: 'Patricia Suárez',
        role:   'Clienta desde 2019',
        text:   'Llevo años viniendo al centro y cada vez me sorprenden más. El tratamiento facial antiedad ha cambiado mi piel por completo. El equipo es increíble.',
        rating: 5,
      },
      {
        author: 'Marta González',
        role:   'Santa Cruz de Tenerife',
        text:   'La depilación láser ha sido lo mejor que he hecho. Sin dolor, resultados permanentes y un trato exquisito. Totalmente recomendable.',
        rating: 5,
      },
      {
        author: 'Rosa Delgado',
        role:   'Clienta habitual',
        text:   'El masaje drenante es espectacular. Salgo nueva cada vez. La reserva online es muy cómoda, en segundos tienes tu cita confirmada.',
        rating: 5,
      },
    ],
  },

  contact: {
    title:    'Encuéntranos',
    subtitle: 'Lunes a viernes 9:00–20:00 · Sábados 9:00–14:00',
    address:  'Calle Méndez Núñez 18, Santa Cruz de Tenerife',
    phone:    '+34 922 456 789',
    email:    'hola@centroaltamira.es',
    whatsapp: '+34 600 456 789',
    showForm: true,
  },

  footer: {
    tagline: 'Centro estético premium en Santa Cruz de Tenerife desde 2013.',
    links: [
      { label: 'Aviso legal',         href: '/legal' },
      { label: 'Política de cookies', href: '/cookies' },
    ],
    legalText: `© ${new Date().getFullYear()} Centro Estético Altamira. Todos los derechos reservados.`,
  },
}
