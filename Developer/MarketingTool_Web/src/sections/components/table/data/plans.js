// @types
import { Plans } from '../type';

export const plans = [
  {
    id: 1,
    title: 'Free',
    name: Plans.FREE,
    monthlyPrice: 0,
    yearlyPrice: 0
  },
  {
    id: 2,
    title: 'Basic',
    name: Plans.BASIC,
    monthlyPrice: 199,
    yearlyPrice: 699
  },
  {
    id: 3,
    title: 'Starter',
    name: Plans.STARTER,
    monthlyPrice: 267,
    yearlyPrice: 899
  },
  {
    id: 4,
    title: 'Enterprise',
    name: Plans.ENTERPRISE,
    monthlyPrice: 389,
    yearlyPrice: 999
  }
];
