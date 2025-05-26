import type { Translation } from "../types"

export const es: Translation = {
  header: {
    signIn: "Iniciar Sesión",
    getStarted: "Comenzar",
    features: "Características",
    pricing: "Precios",
    about: "Acerca de",
    contact: "Contacto",
  },
  auth: {
    login: "Iniciar Sesión",
    register: "Registrarse",
    email: "Correo electrónico",
    password: "Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    noAccount: "¿No tienes una cuenta?",
    haveAccount: "¿Ya tienes una cuenta?",
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    logout: "Cerrar Sesión"
  },
  hero: {
    title: "Gestión de Restaurantes Simplificada",
    subtitle: "Optimiza Tus Operaciones",
    description:
      "Comandero es la plataforma integral de gestión de restaurantes que te ayuda a administrar mesas, pedidos, inventario y personal de manera eficiente.",
    getStarted: "Comenzar Gratis",
    watchDemo: "Ver Demo",
    trustedBy: "Confiado por más de 1000 restaurantes en todo el mundo",
  },
  features: {
    title: "Todo lo que Necesitas para Dirigir tu Restaurante",
    subtitle: "Características poderosas diseñadas para restaurantes modernos",
    tableManagement: {
      title: "Gestión Inteligente de Mesas",
      description:
        "Planos interactivos con actualizaciones en tiempo real del estado de las mesas y gestión de reservas.",
    },
    orderTracking: {
      title: "Seguimiento de Pedidos",
      description: "Rastrea pedidos desde la cocina hasta la mesa con actualizaciones y notificaciones en tiempo real.",
    },
    inventory: {
      title: "Control de Inventario",
      description: "Gestiona niveles de stock, rastrea el uso y recibe alertas de stock bajo automáticamente.",
    },
    analytics: {
      title: "Análisis Avanzados",
      description: "Informes detallados sobre ventas, rendimiento e insights de clientes para hacer crecer tu negocio.",
    },
    multiTenant: {
      title: "Soporte Multi-Ubicación",
      description: "Gestiona múltiples ubicaciones de restaurantes desde un solo panel de control.",
    },
    realTime: {
      title: "Actualizaciones en Tiempo Real",
      description: "Sincronización instantánea en todos los dispositivos y miembros del personal.",
    },
  },
  pricing: {
    title: "Precios Simples y Transparentes",
    subtitle: "Elige el plan que se adapte a las necesidades de tu restaurante",
    monthly: "Mensual",
    yearly: "Anual",
    plans: {
      starter: {
        name: "Inicial",
        price: "$29",
        description: "Perfecto para restaurantes pequeños",
        features: [
          "Hasta 20 mesas",
          "Gestión básica de pedidos",
          "Seguimiento de inventario",
          "Soporte por email",
          "Acceso a app móvil",
        ],
        cta: "Iniciar Prueba Gratuita",
      },
      professional: {
        name: "Profesional",
        price: "$79",
        description: "Ideal para restaurantes en crecimiento",
        features: [
          "Hasta 100 mesas",
          "Análisis avanzados",
          "Gestión de personal",
          "Soporte prioritario",
          "Acceso API",
          "Integraciones personalizadas",
        ],
        cta: "Iniciar Prueba Gratuita",
        popular: "Más Popular",
      },
      enterprise: {
        name: "Empresarial",
        price: "Personalizado",
        description: "Para cadenas de restaurantes",
        features: [
          "Mesas ilimitadas",
          "Gestión multi-ubicación",
          "Reportes avanzados",
          "Soporte telefónico 24/7",
          "Desarrollo personalizado",
          "Gerente de cuenta dedicado",
        ],
        cta: "Contactar Ventas",
      },
    },
  },
  testimonials: {
    title: "Lo que Dicen Nuestros Clientes",
    subtitle: "Únete a miles de propietarios de restaurantes satisfechos",
    items: [
      {
        content:
          "Comandero ha transformado cómo gestionamos nuestro restaurante. Las actualizaciones en tiempo real y los análisis nos han ayudado a aumentar la eficiencia en un 40%.",
        author: "María Rodríguez",
        role: "Propietaria",
        company: "La Cocina Moderna",
      },
      {
        content:
          "La función multi-ubicación es revolucionaria. Ahora podemos gestionar todos nuestros restaurantes desde un solo panel.",
        author: "James Chen",
        role: "Gerente de Operaciones",
        company: "Restaurantes Golden Dragon",
      },
      {
        content: "El soporte al cliente es excepcional. Nos ayudaron a configurar todo en solo un día.",
        author: "Sophie Laurent",
        role: "Gerente",
        company: "Bistro Parisien",
      },
    ],
  },
  cta: {
    title: "¿Listo para Transformar tu Restaurante?",
    subtitle: "Únete a miles de restaurantes que ya usan Comandero para optimizar sus operaciones.",
    getStarted: "Comenzar Gratis",
    learnMore: "Saber Más",
  },
  footer: {
    description: "La solución completa de gestión de restaurantes para negocios modernos.",
    product: {
      title: "Producto",
      features: "Características",
      pricing: "Precios",
      documentation: "Documentación",
      support: "Soporte",
    },
    company: {
      title: "Empresa",
      about: "Acerca de Nosotros",
      blog: "Blog",
      careers: "Carreras",
      contact: "Contacto",
    },
    legal: {
      title: "Legal",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      cookies: "Política de Cookies",
    },
    social: {
      title: "Síguenos",
    },
    copyright: " 2024 Comandero. Todos los derechos reservados.",
  },
}
