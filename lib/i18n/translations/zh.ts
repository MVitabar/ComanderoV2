import type { Translation } from "../types"

export const zh: Translation = {
  header: {
    signIn: "登录",
    getStarted: "开始使用",
    features: "功能",
    pricing: "价格",
    about: "关于我们",
    contact: "联系我们",
  },
  hero: {
    title: "下一代",
    subtitle: "餐厅管理系统",
    description: "通过我们全面的管理平台优化您的餐厅运营。从餐桌管理到库存控制 - 一站式解决方案。",
    getStarted: "立即开始",
    watchDemo: "观看演示",
    trustedBy: "全球超过1000家餐厅的信赖之选",
  },
  features: {
    title: "您需要的一切",
    subtitle: "现代餐厅管理的强大功能",
    tableManagement: {
      title: "餐桌管理",
      description: "通过我们直观的系统管理餐桌预订、可用性和布局。",
    },
    orderTracking: {
      title: "订单跟踪",
      description: "实时跟踪从厨房到服务的订单。",
    },
    inventory: {
      title: "库存管理",
      description: "监控库存、跟踪消耗并自动化补货。",
    },
    analytics: {
      title: "分析与报告",
      description: "获得销售、绩效和客户行为的洞察。",
    },
    multiTenant: {
      title: "多店管理",
      description: "从一个集中平台管理多家餐厅。",
    },
    realTime: {
      title: "实时更新",
      description: "为您的整个团队提供即时通知和更新。",
    },
  },
  pricing: {
    title: "简单透明的价格",
    subtitle: "为您的餐厅选择完美的计划",
    monthly: "月付",
    yearly: "年付",
    plans: {
      starter: {
        name: "入门版",
        price: "¥199",
        description: "适合小型餐厅",
        features: ["最多10张餐桌", "基础订单跟踪", "简单报告", "邮件支持"],
        cta: "选择入门版",
      },
      professional: {
        name: "专业版",
        price: "¥599",
        description: "适合成长中的餐厅",
        features: ["最多50张餐桌", "高级分析", "库存管理", "优先支持", "API访问"],
        cta: "选择专业版",
        popular: "热门",
      },
      enterprise: {
        name: "企业版",
        price: "定制",
        description: "适合连锁餐厅",
        features: ["无限餐桌", "多店管理", "定制集成", "专属支持", "高级安全"],
        cta: "联系我们",
      },
    },
  },
  testimonials: {
    title: "客户评价",
    subtitle: "信赖成功餐厅的经验",
    items: [
      {
        content: "Comandero彻底改变了我们的运营。效率提高了40%。",
        author: "李明",
        role: "老板",
        company: "北京饭店",
      },
      {
        content: "对我们餐厅最好的投资。易于使用且非常可靠。",
        author: "王丽",
        role: "经理",
        company: "上海餐厅",
      },
      {
        content: "终于把一切都控制住了。从订单到库存 - 完美！",
        author: "张伟",
        role: "主厨",
        company: "广州酒楼",
      },
    ],
  },
  cta: {
    title: "准备好改变您的餐厅了吗？",
    subtitle: "加入已经信赖Comandero的数千家餐厅",
    getStarted: "免费开始",
    learnMore: "了解更多",
  },
  footer: {
    description: "现代餐饮企业的全面餐厅管理平台。",
    product: {
      title: "产品",
      features: "功能",
      pricing: "价格",
      documentation: "文档",
      support: "支持",
    },
    company: {
      title: "公司",
      about: "关于我们",
      blog: "博客",
      careers: "招聘",
      contact: "联系我们",
    },
    legal: {
      title: "法律",
      privacy: "隐私",
      terms: "条款",
      cookies: "Cookie",
    },
    social: {
      title: "社交媒体",
    },
    copyright: "© 2024 Comandero. 保留所有权利。",
  },
}
