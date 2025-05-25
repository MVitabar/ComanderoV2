import type { Translation } from "../types"

export const pt: Translation = {
  header: {
    signIn: "Entrar",
    getStarted: "Começar",
    features: "Recursos",
    pricing: "Preços",
    about: "Sobre",
    contact: "Contato",
  },
  hero: {
    title: "Gestão de Restaurante",
    subtitle: "da Próxima Geração",
    description:
      "Otimize as operações do seu restaurante com nossa plataforma de gestão abrangente. Do gerenciamento de mesas ao controle de estoque - tudo em uma solução.",
    getStarted: "Começar agora",
    watchDemo: "Ver demo",
    trustedBy: "Confiado por mais de 1.000 restaurantes no mundo",
  },
  features: {
    title: "Tudo que você precisa",
    subtitle: "Recursos poderosos para gestão moderna de restaurantes",
    tableManagement: {
      title: "Gestão de Mesas",
      description: "Gerencie reservas, disponibilidade e layout de mesas com nosso sistema intuitivo.",
    },
    orderTracking: {
      title: "Rastreamento de Pedidos",
      description: "Rastreie pedidos em tempo real da cozinha ao atendimento.",
    },
    inventory: {
      title: "Gestão de Estoque",
      description: "Monitore estoques, rastreie consumo e automatize reposições.",
    },
    analytics: {
      title: "Análises e Relatórios",
      description: "Obtenha insights sobre vendas, desempenho e comportamento do cliente.",
    },
    multiTenant: {
      title: "Multi-Unidade",
      description: "Gerencie múltiplos restaurantes de uma plataforma centralizada.",
    },
    realTime: {
      title: "Atualizações em Tempo Real",
      description: "Notificações e atualizações instantâneas para toda sua equipe.",
    },
  },
  pricing: {
    title: "Preços simples e transparentes",
    subtitle: "Escolha o plano perfeito para seu restaurante",
    monthly: "Mensal",
    yearly: "Anual",
    plans: {
      starter: {
        name: "Starter",
        price: "R$149",
        description: "Perfeito para pequenos restaurantes",
        features: ["Até 10 mesas", "Rastreamento básico de pedidos", "Relatórios simples", "Suporte por email"],
        cta: "Escolher Starter",
      },
      professional: {
        name: "Professional",
        price: "R$399",
        description: "Ideal para restaurantes em crescimento",
        features: ["Até 50 mesas", "Análises avançadas", "Gestão de estoque", "Suporte prioritário", "Acesso à API"],
        cta: "Escolher Professional",
        popular: "Popular",
      },
      enterprise: {
        name: "Enterprise",
        price: "Personalizado",
        description: "Para redes de restaurantes",
        features: [
          "Mesas ilimitadas",
          "Gestão multi-unidade",
          "Integrações personalizadas",
          "Suporte dedicado",
          "Segurança avançada",
        ],
        cta: "Entrar em contato",
      },
    },
  },
  testimonials: {
    title: "O que nossos clientes dizem",
    subtitle: "Confie na experiência de restaurantes bem-sucedidos",
    items: [
      {
        content: "Comandero revolucionou nossas operações. A eficiência melhorou 40%.",
        author: "Carlos Silva",
        role: "Proprietário",
        company: "Restaurante São Paulo",
      },
      {
        content: "O melhor investimento para nosso restaurante. Fácil de usar e muito confiável.",
        author: "Ana Santos",
        role: "Gerente",
        company: "Bistrô Rio",
      },
      {
        content: "Finalmente temos tudo sob controle. De pedidos ao estoque - perfeito!",
        author: "João Oliveira",
        role: "Chef",
        company: "Casa da Comida",
      },
    ],
  },
  cta: {
    title: "Pronto para transformar seu restaurante?",
    subtitle: "Junte-se a milhares de restaurantes que já confiam no Comandero",
    getStarted: "Começar grátis",
    learnMore: "Saiba mais",
  },
  footer: {
    description: "A plataforma completa de gestão de restaurantes para negócios gastronômicos modernos.",
    product: {
      title: "Produto",
      features: "Recursos",
      pricing: "Preços",
      documentation: "Documentação",
      support: "Suporte",
    },
    company: {
      title: "Empresa",
      about: "Sobre",
      blog: "Blog",
      careers: "Carreiras",
      contact: "Contato",
    },
    legal: {
      title: "Legal",
      privacy: "Privacidade",
      terms: "Termos",
      cookies: "Cookies",
    },
    social: {
      title: "Social",
    },
    copyright: "© 2024 Comandero. Todos os direitos reservados.",
  },
}
