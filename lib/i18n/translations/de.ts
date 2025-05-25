import type { Translation } from "../types"

export const de: Translation = {
  header: {
    signIn: "Anmelden",
    getStarted: "Loslegen",
    features: "Funktionen",
    pricing: "Preise",
    about: "Über uns",
    contact: "Kontakt",
  },
  hero: {
    title: "Restaurant-Management",
    subtitle: "der nächsten Generation",
    description:
      "Optimieren Sie Ihren Restaurantbetrieb mit unserer umfassenden Management-Plattform. Von der Tischverwaltung bis zur Bestandskontrolle - alles in einer Lösung.",
    getStarted: "Jetzt starten",
    watchDemo: "Demo ansehen",
    trustedBy: "Vertraut von über 1.000 Restaurants weltweit",
  },
  features: {
    title: "Alles was Sie brauchen",
    subtitle: "Leistungsstarke Funktionen für modernes Restaurant-Management",
    tableManagement: {
      title: "Tischverwaltung",
      description: "Verwalten Sie Tischreservierungen, Verfügbarkeit und Layout mit unserem intuitiven System.",
    },
    orderTracking: {
      title: "Bestellverfolgung",
      description: "Verfolgen Sie Bestellungen in Echtzeit von der Küche bis zum Service.",
    },
    inventory: {
      title: "Bestandsverwaltung",
      description: "Überwachen Sie Lagerbestände, verfolgen Sie Verbrauch und automatisieren Sie Nachbestellungen.",
    },
    analytics: {
      title: "Analysen & Berichte",
      description: "Erhalten Sie Einblicke in Verkäufe, Leistung und Kundenverhalten.",
    },
    multiTenant: {
      title: "Multi-Standort",
      description: "Verwalten Sie mehrere Restaurants von einer zentralen Plattform aus.",
    },
    realTime: {
      title: "Echtzeit-Updates",
      description: "Sofortige Benachrichtigungen und Updates für Ihr gesamtes Team.",
    },
  },
  pricing: {
    title: "Einfache, transparente Preise",
    subtitle: "Wählen Sie den perfekten Plan für Ihr Restaurant",
    monthly: "Monatlich",
    yearly: "Jährlich",
    plans: {
      starter: {
        name: "Starter",
        price: "€29",
        description: "Perfekt für kleine Restaurants",
        features: ["Bis zu 10 Tische", "Grundlegende Bestellverfolgung", "Einfache Berichte", "E-Mail-Support"],
        cta: "Starter wählen",
      },
      professional: {
        name: "Professional",
        price: "€79",
        description: "Ideal für wachsende Restaurants",
        features: ["Bis zu 50 Tische", "Erweiterte Analysen", "Bestandsverwaltung", "Prioritäts-Support", "API-Zugang"],
        cta: "Professional wählen",
        popular: "Beliebt",
      },
      enterprise: {
        name: "Enterprise",
        price: "Individuell",
        description: "Für Restaurant-Ketten",
        features: [
          "Unbegrenzte Tische",
          "Multi-Standort-Verwaltung",
          "Benutzerdefinierte Integrationen",
          "Dedizierter Support",
          "Erweiterte Sicherheit",
        ],
        cta: "Kontakt aufnehmen",
      },
    },
  },
  testimonials: {
    title: "Was unsere Kunden sagen",
    subtitle: "Vertrauen Sie den Erfahrungen erfolgreicher Restaurants",
    items: [
      {
        content: "Comandero hat unseren Betrieb revolutioniert. Die Effizienz hat sich um 40% verbessert.",
        author: "Maria Schmidt",
        role: "Inhaberin",
        company: "Bistro München",
      },
      {
        content: "Die beste Investition für unser Restaurant. Einfach zu bedienen und sehr zuverlässig.",
        author: "Hans Weber",
        role: "Geschäftsführer",
        company: "Weber's Gasthaus",
      },
      {
        content: "Endlich haben wir alles unter Kontrolle. Von Bestellungen bis zum Inventar - perfekt!",
        author: "Anna Müller",
        role: "Managerin",
        company: "Café Berlin",
      },
    ],
  },
  cta: {
    title: "Bereit, Ihr Restaurant zu transformieren?",
    subtitle: "Schließen Sie sich Tausenden von Restaurants an, die bereits auf Comandero vertrauen",
    getStarted: "Kostenlos starten",
    learnMore: "Mehr erfahren",
  },
  footer: {
    description: "Die umfassende Restaurant-Management-Plattform für moderne Gastronomiebetriebe.",
    product: {
      title: "Produkt",
      features: "Funktionen",
      pricing: "Preise",
      documentation: "Dokumentation",
      support: "Support",
    },
    company: {
      title: "Unternehmen",
      about: "Über uns",
      blog: "Blog",
      careers: "Karriere",
      contact: "Kontakt",
    },
    legal: {
      title: "Rechtliches",
      privacy: "Datenschutz",
      terms: "AGB",
      cookies: "Cookies",
    },
    social: {
      title: "Soziale Medien",
    },
    copyright: "© 2024 Comandero. Alle Rechte vorbehalten.",
  },
}
