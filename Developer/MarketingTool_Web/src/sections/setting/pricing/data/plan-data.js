export const pricingModals = [
  { title: 'Flat Rate', value: 'flatRate' },
  { title: 'Tiered', value: 'tiered' },
  { title: 'Pay as You Go', value: 'payAsYouGo' },
  { title: 'Freemium', value: 'freemium' },
  { title: 'Lifetime', value: 'lifetime' },
  { title: 'Subscription', value: 'subscription' },
  { title: 'Custom Pricing', value: 'custom' },
  { title: 'Bundled', value: 'bundled' },
  { title: 'Per User', value: 'perUser' },
  { title: 'Feature Based', value: 'featureBased' }
];

export const billingPeriodsOptions = [
  { title: 'Monthly', value: 'monthly' },
  { title: 'Yearly', value: 'yearly' }
];

export const pricingPlanData = [
  {
    id: 'PLAN_STARTER',
    name: 'Starter',
    description: 'For solo marketers getting started',
    isRecommended: false,
    priceModal: 'flatRate',
    pricingOptions: [
      { period: 'monthly', price: 49 },
      { period: 'yearly', price: 199 }
    ],
    yearlyDiscount: 66,
    trialPeriodDays: 7,
    features: [
      { id: 'FEATURE_1', value: '1 Category (~20 tools)', link: '' },
      { id: 'FEATURE_2', value: '200 generations/month', link: '' },
      { id: 'FEATURE_4', value: 'Email Support', link: '' }
    ],
    users: [],
    isDraft: false
  },
  {
    id: 'PLAN_PROFESSIONAL',
    name: 'Professional',
    description: 'For growing marketing teams',
    isRecommended: true,
    priceModal: 'flatRate',
    pricingOptions: [
      { period: 'monthly', price: 99 },
      { period: 'yearly', price: 499 }
    ],
    yearlyDiscount: 58,
    trialPeriodDays: 7,
    features: [
      { id: 'FEATURE_1', value: '1 Full Platform (56-77 tools)', link: '' },
      { id: 'FEATURE_2', value: '500 generations/month', link: '' },
      { id: 'FEATURE_3', value: 'Advanced Analytics', link: '' },
      { id: 'FEATURE_4', value: 'Priority Support', link: '' }
    ],
    users: [],
    isDraft: false
  },
  {
    id: 'PLAN_ALL_TOOLS',
    name: 'All Tools',
    description: 'Full access to every tool and feature',
    isRecommended: false,
    priceModal: 'flatRate',
    pricingOptions: [
      { period: 'monthly', price: 150 },
      { period: 'yearly', price: 999 }
    ],
    yearlyDiscount: 45,
    trialPeriodDays: 7,
    features: [
      { id: 'FEATURE_1', value: 'All 3 Platforms (206+ tools)', link: '' },
      { id: 'FEATURE_2', value: '1,500 generations/month', link: '' },
      { id: 'FEATURE_3', value: 'Full Analytics & Reporting', link: '' },
      { id: 'FEATURE_4', value: 'Priority Support', link: '' }
    ],
    users: [],
    isDraft: false
  }
];
