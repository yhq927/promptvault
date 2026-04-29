export interface Plan {
  id: 'free' | 'pro' | 'enterprise'
  name: string
  price: number
  priceId: string // Stripe Price ID
  interval: 'month' | 'year'
  features: string[]
  limits: {
    prompts: number
    categories: number
    templates: boolean
    variables: boolean
    sharing: boolean
    export: boolean
  }
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: '免费版',
    price: 0,
    priceId: '',
    interval: 'month',
    features: [
      '最多 20 个提示词',
      '最多 5 个分类',
      '基础搜索',
      '一键复制',
    ],
    limits: {
      prompts: 20,
      categories: 5,
      templates: false,
      variables: false,
      sharing: false,
      export: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro 版',
    price: 30,
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    interval: 'month',
    features: [
      '无限提示词',
      '无限分类',
      '模板变量',
      '分享给他人',
      '导入/导出',
      '优先支持',
    ],
    limits: {
      prompts: -1,
      categories: -1,
      templates: true,
      variables: true,
      sharing: true,
      export: true,
    },
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: 200,
    priceId: import.meta.env.VITE_STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_monthly',
    interval: 'month',
    features: [
      'Pro 版全部功能',
      '团队协作',
      'API 访问',
      '自定义域名',
      '专属客服',
      'SLA 保障',
    ],
    limits: {
      prompts: -1,
      categories: -1,
      templates: true,
      variables: true,
      sharing: true,
      export: true,
    },
  },
]
