// ─── Configuración del sitio ────────────────────────────────────────────────

export interface SiteTheme {
  /** Variables CSS generadas dinámicamente en runtime */
  colors: {
    primary: {
      50: string; 100: string; 200: string;
      400: string; 600: string; 800: string; 900: string;
    };
    accent: { 400: string; 600: string };
    neutral: {
      50: string; 100: string; 200: string;
      400: string; 600: string; 800: string; 900: string;
    };
  };
  fonts: {
    display: string; // Nombre de la Google Font para títulos
    body: string;    // Nombre de la Google Font para cuerpo
    displayUrl: string;
    bodyUrl: string;
  };
  radius: string; // e.g. '0.5rem' | '1rem' | '1.5rem'
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteNav {
  logo: string;         // Texto o ruta de imagen
  logoIsImage: boolean;
  links: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface HeroConfig {
  headline: string;
  subheadline: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  backgroundImage?: string;  // URL o ruta pública
  overlayOpacity?: number;   // 0–1
}

export interface ServiceItem {
  icon: string;   // nombre del icono Lucide
  title: string;
  description: string;
}

export interface ServicesConfig {
  title: string;
  subtitle?: string;
  items: ServiceItem[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryConfig {
  title: string;
  subtitle?: string;
  images: GalleryImage[];
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

export interface AboutConfig {
  title: string;
  body: string;
  image?: string;
  team?: TeamMember[];
}

export interface ContactConfig {
  title: string;
  subtitle?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  mapEmbedUrl?: string;
  showForm: boolean;
}

export interface FooterConfig {
  tagline?: string;
  links?: NavLink[];
  socialLinks?: { platform: string; href: string }[];
  legalText?: string;
}

// ─── Secciones opcionales por sector ────────────────────────────────────────

export interface ReservationConfig {
  enabled: boolean;
  provider?: 'reservio' | 'google' | 'custom';
  embedUrl?: string;
  title?: string;
}

export interface MenuItem {
  category: string;
  name: string;
  description?: string;
  price: string;
  allergens?: string[];
  image?: string;
}

export interface MenuConfig {
  enabled: boolean;
  title?: string;
  items: MenuItem[];
}

export interface ProductItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  image?: string;
  badge?: string; // 'nuevo' | 'oferta' | etc.
  category: string;
}

export interface ShopConfig {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  categories: string[];
  items: ProductItem[];
  checkoutMode: 'whatsapp' | 'stripe' | 'none';
  whatsappNumber?: string;
}

export interface TestimonialItem {
  author: string;
  role?: string;
  text: string;
  rating?: number; // 1–5
  avatar?: string;
}

export interface TestimonialsConfig {
  enabled: boolean;
  title?: string;
  items: TestimonialItem[];
}

// ─── Config principal del sitio ──────────────────────────────────────────────

export interface SiteConfig {
  // Meta
  siteName: string;
  siteUrl: string;
  metaDescription: string;
  sector: 'restaurant' | 'fashion' | 'health' | 'hotel' | 'pets' | 'workshop' | 'generic';

  // Diseño
  theme: SiteTheme;

  // Secciones base (todas las webs)
  nav: SiteNav;
  hero: HeroConfig;
  services: ServicesConfig;
  about: AboutConfig;
  contact: ContactConfig;
  footer: FooterConfig;

  // Secciones opcionales (activar según sector)
  gallery?: GalleryConfig;
  reservation?: ReservationConfig;
  menu?: MenuConfig;
  shop?: ShopConfig;
  testimonials?: TestimonialsConfig;
}
