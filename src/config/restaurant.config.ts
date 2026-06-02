import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  // ─── Meta ────────────────────────────────────────────────────────────────
  siteName: "El Rincón Canario",
  siteUrl: "https://elrinconcanario.com",
  metaDescription:
    "Cocina tradicional canaria en el corazón de Santa Cruz de Tenerife. Reserva tu mesa y disfruta de los mejores sabores de la isla.",
  sector: "restaurant",

  // ─── Tema visual ─────────────────────────────────────────────────────────
  theme: {
    colors: {
      primary: {
        50: "#fdf8f0",
        100: "#faecd6",
        200: "#f5d5a3",
        400: "#e8a84c",
        600: "#c47d1e",
        800: "#7a4d0f",
        900: "#4a2d07",
      },
      accent: {
        400: "#2d7a4f",
        600: "#1a5235",
      },
      neutral: {
        50: "#fafaf9",
        100: "#f5f5f4",
        200: "#e7e5e4",
        400: "#a8a29e",
        600: "#57534e",
        800: "#292524",
        900: "#1c1917",
      },
    },
    fonts: {
      display: "Playfair Display",
      body: "Lato",
      displayUrl:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
      bodyUrl:
        "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap",
    },
    radius: "0.375rem",
  },

  // ─── Navegación ───────────────────────────────────────────────────────────
  nav: {
    logo: "El Rincón Canario",
    logoIsImage: false,
    links: [
      { label: "Inicio", href: "#inicio" },
      { label: "Menú", href: "#menu" },
      { label: "Nosotros", href: "#nosotros" },
      { label: "Galería", href: "#galeria" },
      { label: "Contacto", href: "#contacto" },
    ],
    ctaLabel: "Reservar mesa",
    ctaHref: "#reservas",
  },

  // ─── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    headline: "Sabores que cuentan la historia de Canarias",
    subheadline:
      "Cocina tradicional elaborada con productos locales de temporada. Abierto desde 1987 en el corazón de Santa Cruz.",
    ctaPrimary: { label: "Reservar mesa", href: "#reservas" },
    ctaSecondary: { label: "Ver el menú", href: "#menu" },
    backgroundImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80",
    overlayOpacity: 0.6,
  },

  // ─── Servicios / Propuesta de valor ───────────────────────────────────────
  services: {
    title: "Por qué elegirnos",
    subtitle: "Más de 35 años sirviendo la auténtica cocina canaria",
    items: [
      {
        icon: "Leaf",
        title: "Producto local",
        description:
          "Trabajamos con agricultores y pescadores de la isla para garantizar la máxima frescura.",
      },
      {
        icon: "ChefHat",
        title: "Recetas de siempre",
        description:
          "Papas arrugadas, mojo, ropa vieja... preparadas como las hacían nuestras abuelas.",
      },
      {
        icon: "Wine",
        title: "Vinos canarios",
        description:
          "Selección exclusiva de vinos DO Tacoronte-Acentejo y Valle de la Orotava.",
      },
      {
        icon: "Users",
        title: "Para todos",
        description:
          "Grupos, familias, celebraciones y eventos privados. Llámanos y lo preparamos.",
      },
    ],
  },

  // ─── Sobre nosotros ───────────────────────────────────────────────────────
  about: {
    title: "Una historia de 35 años",
    body: "Lo que empezó como una pequeña tasca familiar en 1987 se ha convertido en uno de los restaurantes de referencia de Santa Cruz. Tres generaciones comprometidas con mantener viva la gastronomía canaria de siempre, sin artificios.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  },

  // ─── Galería ──────────────────────────────────────────────────────────────
  gallery: {
    title: "Nuestra cocina y espacio",
    subtitle: "Cada plato, una experiencia",
    images: [
      {
        src: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&q=80",
        alt: "Papas arrugadas con mojo",
      },
      {
        src: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
        alt: "Ropa vieja canaria",
      },
      {
        src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
        alt: "Terraza del restaurante",
      },
      {
        src: "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=600&q=80",
        alt: "Pescado fresco del día",
      },
      {
        src: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80",
        alt: "Postres caseros",
      },
      {
        src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
        alt: "Ambiente interior",
      },
    ],
  },

  // ─── Menú ─────────────────────────────────────────────────────────────────
  menu: {
    enabled: true,
    title: "Nuestra carta",
    items: [
      {
        category: "Entrantes",
        name: "Papas arrugadas con mojo",
        description:
          "Papas canarias cocidas en sal gorda con mojo rojo y verde de la casa",
        price: "6,50 €",
        allergens: ["vegetariano"],
        image:
          "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&h=400&q=80",
      },
      {
        category: "Entrantes",
        name: "Queso asado con miel de palma",
        description:
          "Queso de cabra local asado a la plancha con miel de palma de La Gomera",
        price: "9,00 €",
        allergens: ["vegetariano", "lácteos"],
        image:
          "https://images.unsplash.com/photo-1486297678162-eb2a19b0a2d4?auto=format&fit=crop&w=600&h=400&q=80",
      },
      {
        category: "Principales",
        name: "Ropa vieja canaria",
        description:
          "Garbanzos, pollo y chorizo en salsa con pimientos y tomate",
        price: "13,50 €",
        allergens: ["gluten", "apio"],
        image:
          "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&h=400&q=80",
      },
      {
        category: "Principales",
        name: "Vieja a la espalda",
        description: "Pescado local del día a la plancha con papas y mojo",
        price: "18,00 €",
        allergens: ["sin gluten", "pescado"],
        image:
          "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=600&h=400&q=80",
      },
      {
        category: "Principales",
        name: "Conejo en salmorejo",
        description:
          "Receta tradicional canaria marinada en vinagre, ajo y pimentón",
        price: "15,00 €",
        allergens: ["sin gluten"],
        image:
          "https://images.unsplash.com/photo-1544025162-d76538b2a645?auto=format&fit=crop&w=600&h=400&q=80",
      },
      {
        category: "Postres",
        name: "Bienmesabe con helado",
        description: "Crema de almendras y miel con helado de guanábana",
        price: "5,50 €",
        allergens: ["vegetariano", "frutos secos", "lácteos"],
        image:
          "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&h=400&q=80",
      },
      {
        category: "Postres",
        name: "Frangollo canario",
        description: "Postre tradicional de millo con pasas y almendras",
        price: "5,00 €",
        allergens: ["vegetariano", "frutos secos", "lácteos"],
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&h=400&q=80",
      },
    ],
  },

  // ─── Reservas ─────────────────────────────────────────────────────────────
  reservation: {
    enabled: true,
    provider: "custom",
    title: "Reserva tu mesa",
  },

  // ─── Testimonios ──────────────────────────────────────────────────────────
  testimonials: {
    enabled: true,
    title: "Lo que dicen nuestros clientes",
    items: [
      {
        author: "María González",
        role: "Visitante habitual",
        text: "El mejor conejo en salmorejo que he probado en mi vida. Un sitio que transmite calor de hogar.",
        rating: 5,
      },
      {
        author: "James Whitfield",
        role: "Turista, Reino Unido",
        text: "Authentic Canarian food in a wonderful atmosphere. The papas arrugadas were incredible!",
        rating: 5,
      },
      {
        author: "Carlos Mendoza",
        role: "Cliente desde 2010",
        text: "Llevo más de 15 años viniendo aquí. La calidad nunca baja y el trato siempre es familiar.",
        rating: 5,
      },
    ],
  },

  // ─── Contacto ─────────────────────────────────────────────────────────────
  contact: {
    title: "Encuéntranos",
    subtitle: "Lunes a domingo, de 13:00 a 16:00 y de 20:00 a 23:00",
    address: "Calle La Noria 14, Santa Cruz de Tenerife",
    phone: "+34 922 123 456",
    email: "hola@elrinconcanario.com",
    whatsapp: "+34 622 123 456",
    showForm: true,
  },

  // ─── Footer ───────────────────────────────────────────────────────────────
  footer: {
    tagline: "Cocina canaria de siempre. Desde 1987.",
    links: [
      { label: "Aviso legal", href: "/legal" },
      { label: "Política de cookies", href: "/cookies" },
    ],
    legalText: "© 2025 El Rincón Canario. Todos los derechos reservados.",
  },
};
