// @project
import { features } from './features';

// @types
import { Plans } from '@/sections/billing/type';

export const plans = [
  {
    id: 1,
    title: 'Starter',
    name: Plans.STARTER,
    monthlyPrice: 49,
    yearlyPrice: 199,
    icon: 'IconBox',
    features: [features[0], features[1], features[2]]
  },
  {
    id: 2,
    title: 'Professional',
    name: Plans.PROFESSIONAL,
    monthlyPrice: 99,
    yearlyPrice: 499,
    icon: 'IconActivityHeartbeat',
    features: [features[3], features[4], features[5]]
  },
  {
    id: 3,
    title: 'All Tools',
    name: Plans.ALL_TOOLS,
    monthlyPrice: 150,
    yearlyPrice: 999,
    icon: 'IconBolt',
    features
  }
];
