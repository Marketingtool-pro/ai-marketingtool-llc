// @project
import { plans } from './plans';
import { profiles } from './profile';
import { offsetDate } from '@/utils/offsetDate';

// @types
import { Plans } from '@/sections/account/type';

const basicPlan = plans.filter((plan) => plan.name === Plans.BASIC)[0];
const starterPlan = plans.filter((plan) => plan.name === Plans.STARTER)[0];
const enterprisePlan = plans.filter((plan) => plan.name === Plans.ENTERPRISE)[0];

export const accounts = [
  {
    id: '1',
    profile: profiles[0],
    plan: basicPlan,
    createdDate: offsetDate(-7),
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    isBlocked: false
  },
  {
    id: '2',
    profile: profiles[1],
    plan: starterPlan,
    createdDate: offsetDate(3),
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    isBlocked: false
  },
  {
    id: '3',
    profile: profiles[2],
    plan: enterprisePlan,
    createdDate: offsetDate(-12),
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    isBlocked: false
  },
  {
    id: '4',
    profile: profiles[3],
    plan: basicPlan,
    createdDate: offsetDate(10),
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    isBlocked: true
  },
  {
    id: '5',
    profile: profiles[4],
    plan: starterPlan,
    createdDate: offsetDate(-15),
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    isBlocked: false
  },
  {
    id: '6',
    profile: profiles[5],
    plan: enterprisePlan,
    createdDate: offsetDate(7),
    billingCycle: 'Yearly',
    billingStatus: 'Scheduled',
    isBlocked: false
  },
  {
    id: '7',
    profile: profiles[6],
    plan: basicPlan,
    createdDate: offsetDate(-3),
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    isBlocked: false
  },
  {
    id: '8',
    profile: profiles[7],
    plan: starterPlan,
    createdDate: offsetDate(0),
    billingCycle: 'Yearly',
    billingStatus: 'Scheduled',
    isBlocked: true
  },
  {
    id: '9',
    profile: profiles[8],
    plan: enterprisePlan,
    createdDate: offsetDate(-5),
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    isBlocked: false
  },
  {
    id: '10',
    profile: profiles[9],
    plan: starterPlan,
    createdDate: offsetDate(14),
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    isBlocked: false
  },
  {
    id: '11',
    profile: profiles[10],
    plan: basicPlan,
    createdDate: offsetDate(-9),
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    isBlocked: false
  },
  {
    id: '12',
    profile: profiles[11],
    plan: enterprisePlan,
    createdDate: offsetDate(-20),
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    isBlocked: true
  },
  {
    id: '13',
    profile: profiles[12],
    plan: starterPlan,
    createdDate: offsetDate(5),
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    isBlocked: false
  },
  {
    id: '14',
    profile: profiles[13],
    plan: enterprisePlan,
    createdDate: offsetDate(-1),
    billingCycle: 'Yearly',
    billingStatus: 'Scheduled',
    isBlocked: false
  },
  {
    id: '15',
    profile: profiles[14],
    plan: basicPlan,
    createdDate: offsetDate(12),
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    isBlocked: false
  },
  {
    id: '16',
    profile: profiles[15],
    plan: starterPlan,
    createdDate: offsetDate(-8),
    billingCycle: 'Yearly',
    billingStatus: 'Scheduled',
    isBlocked: false
  },
  {
    id: '17',
    profile: profiles[16],
    plan: enterprisePlan,
    createdDate: offsetDate(9),
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    isBlocked: false
  },
  {
    id: '18',
    profile: profiles[17],
    plan: basicPlan,
    createdDate: offsetDate(-11),
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    isBlocked: true
  },
  {
    id: '19',
    profile: profiles[18],
    plan: starterPlan,
    createdDate: offsetDate(4),
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    isBlocked: false
  },
  {
    id: '20',
    profile: profiles[19],
    plan: enterprisePlan,
    createdDate: offsetDate(-2),
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    isBlocked: false
  },
  {
    id: '21',
    profile: profiles[20],
    plan: basicPlan,
    createdDate: offsetDate(6),
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    isBlocked: false
  },
  {
    id: '22',
    profile: profiles[21],
    plan: starterPlan,
    createdDate: offsetDate(-14),
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    isBlocked: false
  },
  {
    id: '23',
    profile: profiles[22],
    plan: enterprisePlan,
    createdDate: offsetDate(11),
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    isBlocked: false
  },
  {
    id: '24',
    profile: profiles[23],
    plan: basicPlan,
    createdDate: offsetDate(-6),
    billingCycle: 'Yearly',
    billingStatus: 'Scheduled',
    isBlocked: false
  },
  {
    id: '25',
    profile: profiles[24],
    plan: starterPlan,
    createdDate: offsetDate(8),
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    isBlocked: false
  }
];
