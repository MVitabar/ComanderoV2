import type { Translation } from "../types"

export const en: Translation = {
  header: {
    signIn: "Sign In",
    getStarted: "Get Started",
    features: "Features",
    pricing: "Pricing",
    about: "About",
    contact: "Contact",
  },
  hero: {
    title: "Restaurant Management Made Simple",
    subtitle: "Streamline Your Operations",
    description:
      "Comandero is the all-in-one restaurant management platform that helps you manage tables, orders, inventory, and staff efficiently.",
    getStarted: "Get Started Free",
    watchDemo: "Watch Demo",
    trustedBy: "Trusted by 1000+ restaurants worldwide",
  },
  features: {
    title: "Everything You Need to Run Your Restaurant",
    subtitle: "Powerful features designed for modern restaurants",
    tableManagement: {
      title: "Smart Table Management",
      description: "Interactive floor plans with real-time table status updates and reservation management.",
    },
    orderTracking: {
      title: "Order Tracking",
      description: "Track orders from kitchen to table with real-time updates and notifications.",
    },
    inventory: {
      title: "Inventory Control",
      description: "Manage stock levels, track usage, and get low-stock alerts automatically.",
    },
    analytics: {
      title: "Advanced Analytics",
      description: "Detailed reports on sales, performance, and customer insights to grow your business.",
    },
    multiTenant: {
      title: "Multi-Location Support",
      description: "Manage multiple restaurant locations from a single dashboard.",
    },
    realTime: {
      title: "Real-Time Updates",
      description: "Instant synchronization across all devices and staff members.",
    },
  },
  pricing: {
    title: "Simple, Transparent Pricing",
    subtitle: "Choose the plan that fits your restaurant's needs",
    monthly: "Monthly",
    yearly: "Yearly",
    plans: {
      starter: {
        name: "Starter",
        price: "$29",
        description: "Perfect for small restaurants",
        features: [
          "Up to 20 tables",
          "Basic order management",
          "Inventory tracking",
          "Email support",
          "Mobile app access",
        ],
        cta: "Start Free Trial",
      },
      professional: {
        name: "Professional",
        price: "$79",
        description: "Best for growing restaurants",
        features: [
          "Up to 100 tables",
          "Advanced analytics",
          "Staff management",
          "Priority support",
          "API access",
          "Custom integrations",
        ],
        cta: "Start Free Trial",
        popular: "Most Popular",
      },
      enterprise: {
        name: "Enterprise",
        price: "Custom",
        description: "For restaurant chains",
        features: [
          "Unlimited tables",
          "Multi-location management",
          "Advanced reporting",
          "24/7 phone support",
          "Custom development",
          "Dedicated account manager",
        ],
        cta: "Contact Sales",
      },
    },
  },
  testimonials: {
    title: "What Our Customers Say",
    subtitle: "Join thousands of satisfied restaurant owners",
    items: [
      {
        content:
          "Comandero has transformed how we manage our restaurant. The real-time updates and analytics have helped us increase efficiency by 40%.",
        author: "Maria Rodriguez",
        role: "Owner",
        company: "La Cocina Moderna",
      },
      {
        content:
          "The multi-location feature is a game-changer. We can now manage all our restaurants from one dashboard.",
        author: "James Chen",
        role: "Operations Manager",
        company: "Golden Dragon Restaurants",
      },
      {
        content: "Customer support is exceptional. They helped us set up everything in just one day.",
        author: "Sophie Laurent",
        role: "Manager",
        company: "Bistro Parisien",
      },
    ],
  },
  cta: {
    title: "Ready to Transform Your Restaurant?",
    subtitle: "Join thousands of restaurants already using Comandero to streamline their operations.",
    getStarted: "Get Started Free",
    learnMore: "Learn More",
  },
  footer: {
    description: "The complete restaurant management solution for modern businesses.",
    product: {
      title: "Product",
      features: "Features",
      pricing: "Pricing",
      documentation: "Documentation",
      support: "Support",
    },
    company: {
      title: "Company",
      about: "About Us",
      blog: "Blog",
      careers: "Careers",
      contact: "Contact",
    },
    legal: {
      title: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookie Policy",
    },
    social: {
      title: "Follow Us",
    },
    copyright: "© 2024 Comandero. All rights reserved.",
  },
}
