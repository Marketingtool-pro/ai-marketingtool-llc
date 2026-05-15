// @project
import { features } from './features';

// @types
import { Plans } from '@/sections/account/type';

export const plans = [
  {
    id: 1,
    title: 'Basic',
    name: Plans.BASIC,
    monthlyPrice: 199,
    yearlyPrice: 699,
    icon: 'IconBox',
    features: [features[0], features[4]]
  },
  {
    id: 2,
    title: 'Starter',
    name: Plans.STARTER,
    monthlyPrice: 267,
    yearlyPrice: 899,
    icon: 'IconActivityHeartbeat',
    features: [features[0], features[1], features[2], features[4], features[5], features[8]]
  },
  {
    id: 3,
    title: 'Enterprise',
    name: Plans.ENTERPRISE,
    monthlyPrice: 389,
    yearlyPrice: 999,
    icon: 'IconBolt',
    features
  }
];
