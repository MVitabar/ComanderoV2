import type { Translation } from "../types"

export const ja: Translation = {
  header: {
    signIn: "ログイン",
    getStarted: "始める",
    features: "機能",
    pricing: "料金",
    about: "会社概要",
    contact: "お問い合わせ",
  },
  hero: {
    title: "次世代の",
    subtitle: "レストラン管理",
    description:
      "包括的な管理プラットフォームでレストランの運営を最適化。テーブル管理から在庫管理まで - すべてを一つのソリューションで。",
    getStarted: "今すぐ始める",
    watchDemo: "デモを見る",
    trustedBy: "世界中の1,000以上のレストランに信頼されています",
  },
  features: {
    title: "必要なすべてが揃っています",
    subtitle: "現代的なレストラン管理のための強力な機能",
    tableManagement: {
      title: "テーブル管理",
      description: "直感的なシステムでテーブルの予約、空き状況、レイアウトを管理。",
    },
    orderTracking: {
      title: "注文追跡",
      description: "キッチンからサービスまでリアルタイムで注文を追跡。",
    },
    inventory: {
      title: "在庫管理",
      description: "在庫を監視し、消費を追跡し、補充を自動化。",
    },
    analytics: {
      title: "分析とレポート",
      description: "売上、パフォーマンス、顧客行動に関する洞察を取得。",
    },
    multiTenant: {
      title: "マルチ店舗",
      description: "一つの集中プラットフォームから複数のレストランを管理。",
    },
    realTime: {
      title: "リアルタイム更新",
      description: "チーム全体への即座の通知と更新。",
    },
  },
  pricing: {
    title: "シンプルで透明な料金",
    subtitle: "あなたのレストランに最適なプランを選択",
    monthly: "月額",
    yearly: "年額",
    plans: {
      starter: {
        name: "スターター",
        price: "¥2,900",
        description: "小規模レストランに最適",
        features: ["最大10テーブル", "基本的な注文追跡", "シンプルなレポート", "メールサポート"],
        cta: "スターターを選択",
      },
      professional: {
        name: "プロフェッショナル",
        price: "¥7,900",
        description: "成長中のレストランに理想的",
        features: ["最大50テーブル", "高度な分析", "在庫管理", "優先サポート", "APIアクセス"],
        cta: "プロフェッショナルを選択",
        popular: "人気",
      },
      enterprise: {
        name: "エンタープライズ",
        price: "カスタム",
        description: "レストランチェーン向け",
        features: ["無制限テーブル", "マルチ店舗管理", "カスタム統合", "専用サポート", "高度なセキュリティ"],
        cta: "お問い合わせ",
      },
    },
  },
  testimonials: {
    title: "お客様の声",
    subtitle: "成功したレストランの経験を信頼してください",
    items: [
      {
        content: "Comanderoは私たちの運営を革命的に変えました。効率が40%向上しました。",
        author: "田中太郎",
        role: "オーナー",
        company: "東京レストラン",
      },
      {
        content: "私たちのレストランへの最高の投資。使いやすく、とても信頼できます。",
        author: "佐藤花子",
        role: "マネージャー",
        company: "大阪ビストロ",
      },
      {
        content: "ついにすべてをコントロールできました。注文から在庫まで - 完璧です！",
        author: "鈴木一郎",
        role: "シェフ",
        company: "京都料亭",
      },
    ],
  },
  cta: {
    title: "レストランを変革する準備はできましたか？",
    subtitle: "すでにComanderoを信頼している数千のレストランに参加しましょう",
    getStarted: "無料で始める",
    learnMore: "詳細を見る",
  },
  footer: {
    description: "現代的な飲食事業のための包括的なレストラン管理プラットフォーム。",
    product: {
      title: "製品",
      features: "機能",
      pricing: "料金",
      documentation: "ドキュメント",
      support: "サポート",
    },
    company: {
      title: "会社",
      about: "会社概要",
      blog: "ブログ",
      careers: "採用",
      contact: "お問い合わせ",
    },
    legal: {
      title: "法的事項",
      privacy: "プライバシー",
      terms: "利用規約",
      cookies: "クッキー",
    },
    social: {
      title: "ソーシャル",
    },
    copyright: "© 2024 Comandero. 全著作権所有。",
  },
}
