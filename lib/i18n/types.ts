export type SupportedLocale = "en" | "es" | "fr" | "de" | "it" | "pt"

export interface Translation {
  header: {
    signIn: string
    getStarted: string
    features: string
    pricing: string
    about: string
    contact: string
  }
  auth: {
    login: string
    register: string
    email: string
    password: string
    forgotPassword: string
    noAccount: string
    haveAccount: string
    signIn: string
    signUp: string
    logout: string
  }
  hero: {
    title: string
    subtitle: string
    description: string
    getStarted: string
    watchDemo: string
    trustedBy: string
  }
  features: {
    title: string
    subtitle: string
    tableManagement: {
      title: string
      description: string
    }
    orderTracking: {
      title: string
      description: string
    }
    inventory: {
      title: string
      description: string
    }
    analytics: {
      title: string
      description: string
    }
    multiTenant: {
      title: string
      description: string
    }
    realTime: {
      title: string
      description: string
    }
  }
  pricing: {
    title: string
    subtitle: string
    monthly: string
    yearly: string
    plans: {
      starter: {
        name: string
        price: string
        description: string
        features: string[]
        cta: string
      }
      professional: {
        name: string
        price: string
        description: string
        features: string[]
        cta: string
        popular: string
      }
      enterprise: {
        name: string
        price: string
        description: string
        features: string[]
        cta: string
      }
    }
  }
  testimonials: {
    title: string
    subtitle: string
    items: Array<{
      content: string
      author: string
      role: string
      company: string
    }>
  }
  cta: {
    title: string
    subtitle: string
    getStarted: string
    learnMore: string
  }
  footer: {
    description: string
    product: {
      title: string
      features: string
      pricing: string
      documentation: string
      support: string
    }
    company: {
      title: string
      about: string
      blog: string
      careers: string
      contact: string
    }
    legal: {
      title: string
      privacy: string
      terms: string
      cookies: string
    }
    social: {
      title: string
    }
    copyright: string
  }
}
