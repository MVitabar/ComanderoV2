import type { Translation } from "../types"

export const it: Translation = {
  header: {
    signIn: "Accedi",
    getStarted: "Inizia",
    features: "Funzionalità",
    pricing: "Prezzi",
    about: "Chi siamo",
    contact: "Contatti",
  },
  hero: {
    title: "Gestione Ristorante",
    subtitle: "di Nuova Generazione",
    description:
      "Ottimizza le operazioni del tuo ristorante con la nostra piattaforma di gestione completa. Dalla gestione tavoli al controllo inventario - tutto in una soluzione.",
    getStarted: "Inizia ora",
    watchDemo: "Guarda demo",
    trustedBy: "Scelto da oltre 1.000 ristoranti nel mondo",
  },
  features: {
    title: "Tutto ciò di cui hai bisogno",
    subtitle: "Funzionalità potenti per la gestione moderna del ristorante",
    tableManagement: {
      title: "Gestione Tavoli",
      description: "Gestisci prenotazioni, disponibilità e layout dei tavoli con il nostro sistema intuitivo.",
    },
    orderTracking: {
      title: "Tracciamento Ordini",
      description: "Traccia gli ordini in tempo reale dalla cucina al servizio.",
    },
    inventory: {
      title: "Gestione Inventario",
      description: "Monitora le scorte, traccia il consumo e automatizza i riordini.",
    },
    analytics: {
      title: "Analisi e Report",
      description: "Ottieni insights su vendite, performance e comportamento clienti.",
    },
    multiTenant: {
      title: "Multi-Sede",
      description: "Gestisci più ristoranti da un'unica piattaforma centralizzata.",
    },
    realTime: {
      title: "Aggiornamenti Real-time",
      description: "Notifiche e aggiornamenti istantanei per tutto il tuo team.",
    },
  },
  pricing: {
    title: "Prezzi semplici e trasparenti",
    subtitle: "Scegli il piano perfetto per il tuo ristorante",
    monthly: "Mensile",
    yearly: "Annuale",
    plans: {
      starter: {
        name: "Starter",
        price: "€29",
        description: "Perfetto per piccoli ristoranti",
        features: ["Fino a 10 tavoli", "Tracciamento ordini base", "Report semplici", "Supporto email"],
        cta: "Scegli Starter",
      },
      professional: {
        name: "Professional",
        price: "€79",
        description: "Ideale per ristoranti in crescita",
        features: [
          "Fino a 50 tavoli",
          "Analisi avanzate",
          "Gestione inventario",
          "Supporto prioritario",
          "Accesso API",
        ],
        cta: "Scegli Professional",
        popular: "Popolare",
      },
      enterprise: {
        name: "Enterprise",
        price: "Personalizzato",
        description: "Per catene di ristoranti",
        features: [
          "Tavoli illimitati",
          "Gestione multi-sede",
          "Integrazioni personalizzate",
          "Supporto dedicato",
          "Sicurezza avanzata",
        ],
        cta: "Contattaci",
      },
    },
  },
  testimonials: {
    title: "Cosa dicono i nostri clienti",
    subtitle: "Fidati dell'esperienza di ristoranti di successo",
    items: [
      {
        content: "Comandero ha rivoluzionato le nostre operazioni. L'efficienza è migliorata del 40%.",
        author: "Marco Rossi",
        role: "Proprietario",
        company: "Trattoria Roma",
      },
      {
        content: "Il miglior investimento per il nostro ristorante. Facile da usare e molto affidabile.",
        author: "Giulia Bianchi",
        role: "Manager",
        company: "Osteria Milano",
      },
      {
        content: "Finalmente abbiamo tutto sotto controllo. Dagli ordini all'inventario - perfetto!",
        author: "Antonio Ferrari",
        role: "Chef",
        company: "Ristorante Napoli",
      },
    ],
  },
  cta: {
    title: "Pronto a trasformare il tuo ristorante?",
    subtitle: "Unisciti a migliaia di ristoranti che già si fidano di Comandero",
    getStarted: "Inizia gratis",
    learnMore: "Scopri di più",
  },
  footer: {
    description: "La piattaforma completa di gestione ristorante per attività di ristorazione moderne.",
    product: {
      title: "Prodotto",
      features: "Funzionalità",
      pricing: "Prezzi",
      documentation: "Documentazione",
      support: "Supporto",
    },
    company: {
      title: "Azienda",
      about: "Chi siamo",
      blog: "Blog",
      careers: "Carriere",
      contact: "Contatti",
    },
    legal: {
      title: "Legale",
      privacy: "Privacy",
      terms: "Termini",
      cookies: "Cookie",
    },
    social: {
      title: "Social",
    },
    copyright: "© 2024 Comandero. Tutti i diritti riservati.",
  },
}
