import type { Translation } from "../types"

export const fr: Translation = {
  header: {
    signIn: "Se Connecter",
    getStarted: "Commencer",
    features: "Fonctionnalités",
    pricing: "Tarifs",
    about: "À Propos",
    contact: "Contact",
  },
  hero: {
    title: "Gestion de Restaurant Simplifiée",
    subtitle: "Optimisez Vos Opérations",
    description:
      "Comandero est la plateforme de gestion de restaurant tout-en-un qui vous aide à gérer les tables, commandes, inventaire et personnel efficacement.",
    getStarted: "Commencer Gratuitement",
    watchDemo: "Voir la Démo",
    trustedBy: "Fait confiance par plus de 1000 restaurants dans le monde",
  },
  features: {
    title: "Tout ce dont Vous Avez Besoin pour Gérer Votre Restaurant",
    subtitle: "Fonctionnalités puissantes conçues pour les restaurants modernes",
    tableManagement: {
      title: "Gestion Intelligente des Tables",
      description:
        "Plans interactifs avec mises à jour en temps réel du statut des tables et gestion des réservations.",
    },
    orderTracking: {
      title: "Suivi des Commandes",
      description:
        "Suivez les commandes de la cuisine à la table avec des mises à jour et notifications en temps réel.",
    },
    inventory: {
      title: "Contrôle d'Inventaire",
      description:
        "Gérez les niveaux de stock, suivez l'utilisation et recevez des alertes de stock faible automatiquement.",
    },
    analytics: {
      title: "Analyses Avancées",
      description:
        "Rapports détaillés sur les ventes, performances et insights clients pour développer votre entreprise.",
    },
    multiTenant: {
      title: "Support Multi-Emplacements",
      description: "Gérez plusieurs emplacements de restaurants depuis un seul tableau de bord.",
    },
    realTime: {
      title: "Mises à Jour en Temps Réel",
      description: "Synchronisation instantanée sur tous les appareils et membres du personnel.",
    },
  },
  pricing: {
    title: "Tarifs Simples et Transparents",
    subtitle: "Choisissez le plan qui convient aux besoins de votre restaurant",
    monthly: "Mensuel",
    yearly: "Annuel",
    plans: {
      starter: {
        name: "Débutant",
        price: "29€",
        description: "Parfait pour les petits restaurants",
        features: [
          "Jusqu'à 20 tables",
          "Gestion de commandes de base",
          "Suivi d'inventaire",
          "Support par email",
          "Accès app mobile",
        ],
        cta: "Commencer l'Essai Gratuit",
      },
      professional: {
        name: "Professionnel",
        price: "79€",
        description: "Idéal pour les restaurants en croissance",
        features: [
          "Jusqu'à 100 tables",
          "Analyses avancées",
          "Gestion du personnel",
          "Support prioritaire",
          "Accès API",
          "Intégrations personnalisées",
        ],
        cta: "Commencer l'Essai Gratuit",
        popular: "Plus Populaire",
      },
      enterprise: {
        name: "Entreprise",
        price: "Personnalisé",
        description: "Pour les chaînes de restaurants",
        features: [
          "Tables illimitées",
          "Gestion multi-emplacements",
          "Rapports avancés",
          "Support téléphonique 24/7",
          "Développement personnalisé",
          "Gestionnaire de compte dédié",
        ],
        cta: "Contacter les Ventes",
      },
    },
  },
  testimonials: {
    title: "Ce que Disent Nos Clients",
    subtitle: "Rejoignez des milliers de propriétaires de restaurants satisfaits",
    items: [
      {
        content:
          "Comandero a transformé la façon dont nous gérons notre restaurant. Les mises à jour en temps réel et les analyses nous ont aidés à augmenter l'efficacité de 40%.",
        author: "Maria Rodriguez",
        role: "Propriétaire",
        company: "La Cocina Moderna",
      },
      {
        content:
          "La fonctionnalité multi-emplacements change la donne. Nous pouvons maintenant gérer tous nos restaurants depuis un seul tableau de bord.",
        author: "James Chen",
        role: "Directeur des Opérations",
        company: "Restaurants Golden Dragon",
      },
      {
        content: "Le support client est exceptionnel. Ils nous ont aidés à tout configurer en une seule journée.",
        author: "Sophie Laurent",
        role: "Gestionnaire",
        company: "Bistro Parisien",
      },
    ],
  },
  cta: {
    title: "Prêt à Transformer Votre Restaurant ?",
    subtitle: "Rejoignez des milliers de restaurants qui utilisent déjà Comandero pour optimiser leurs opérations.",
    getStarted: "Commencer Gratuitement",
    learnMore: "En Savoir Plus",
  },
  footer: {
    description: "La solution complète de gestion de restaurant pour les entreprises modernes.",
    product: {
      title: "Produit",
      features: "Fonctionnalités",
      pricing: "Tarifs",
      documentation: "Documentation",
      support: "Support",
    },
    company: {
      title: "Entreprise",
      about: "À Propos de Nous",
      blog: "Blog",
      careers: "Carrières",
      contact: "Contact",
    },
    legal: {
      title: "Légal",
      privacy: "Politique de Confidentialité",
      terms: "Conditions de Service",
      cookies: "Politique des Cookies",
    },
    social: {
      title: "Suivez-Nous",
    },
    copyright: "© 2024 Comandero. Tous droits réservés.",
  },
}
