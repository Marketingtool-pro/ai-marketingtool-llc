// @project
import { accounts } from './accounts';
import { customers } from './customer';
import { offsetDate } from '@/utils/offsetDate';

// @types
import { BillingCycle, BillingStatus } from '../type';

export const billings = [
  {
    id: 'DK52684DR8W',
    createdDate: offsetDate(-7),
    account: accounts[0],
    customer: customers[0],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'QW98123AF7Z',
    createdDate: offsetDate(-14),
    account: accounts[1],
    customer: customers[1],
    billingStatus: BillingStatus.SCHEDULED,
    billingCycle: BillingCycle.YEARLY
  },
  {
    id: 'ZX38475LK2X',
    createdDate: offsetDate(-21),
    account: accounts[2],
    customer: customers[2],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'PL75829JG6T',
    createdDate: offsetDate(-30),
    account: accounts[3],
    customer: customers[3],
    billingStatus: BillingStatus.SCHEDULED,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'HY23984LP0S',
    createdDate: offsetDate(-5),
    account: accounts[4],
    customer: customers[4],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.YEARLY
  },
  {
    id: 'VR84572QA3N',
    createdDate: offsetDate(-10),
    account: accounts[5],
    customer: customers[5],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'MG10293WX8L',
    createdDate: offsetDate(-18),
    account: accounts[6],
    customer: customers[6],
    billingStatus: BillingStatus.SCHEDULED,
    billingCycle: BillingCycle.YEARLY
  },
  {
    id: 'KT49230VC7E',
    createdDate: offsetDate(-25),
    account: accounts[7],
    customer: customers[7],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'UA81923NM3D',
    createdDate: offsetDate(-12),
    account: accounts[8],
    customer: customers[8],
    billingStatus: BillingStatus.SCHEDULED,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'RB29483YT0B',
    createdDate: offsetDate(-6),
    account: accounts[9],
    customer: customers[9],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.YEARLY
  },
  {
    id: 'JP10392QL6V',
    createdDate: offsetDate(-8),
    account: accounts[10],
    customer: customers[10],
    billingStatus: BillingStatus.SCHEDULED,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'NX57290KC9F',
    createdDate: offsetDate(-13),
    account: accounts[11],
    customer: customers[11],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'ZB20938MT4G',
    createdDate: offsetDate(-3),
    account: accounts[12],
    customer: customers[12],
    billingStatus: BillingStatus.SCHEDULED,
    billingCycle: BillingCycle.YEARLY
  },
  {
    id: 'AW38420SR6Y',
    createdDate: offsetDate(-20),
    account: accounts[13],
    customer: customers[13],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'LV48293XQ5P',
    createdDate: offsetDate(-22),
    account: accounts[14],
    customer: customers[14],
    billingStatus: BillingStatus.SCHEDULED,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'DN18374CW8M',
    createdDate: offsetDate(-16),
    account: accounts[15],
    customer: customers[15],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.YEARLY
  },
  {
    id: 'BG29410ZR2J',
    createdDate: offsetDate(-11),
    account: accounts[16],
    customer: customers[16],
    billingStatus: BillingStatus.SCHEDULED,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'XF57320VK1U',
    createdDate: offsetDate(-19),
    account: accounts[17],
    customer: customers[17],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'OE93847NR7W',
    createdDate: offsetDate(-27),
    account: accounts[18],
    customer: customers[18],
    billingStatus: BillingStatus.SCHEDULED,
    billingCycle: BillingCycle.YEARLY
  },
  {
    id: 'TY75830LH4T',
    createdDate: offsetDate(-9),
    account: accounts[19],
    customer: customers[19],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'CA10473JQ3R',
    createdDate: offsetDate(-15),
    account: accounts[20],
    customer: customers[20],
    billingStatus: BillingStatus.SCHEDULED,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'WM29830XP6B',
    createdDate: offsetDate(-13),
    account: accounts[21],
    customer: customers[21],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.YEARLY
  },
  {
    id: 'FB20394GM1C',
    createdDate: offsetDate(-4),
    account: accounts[22],
    customer: customers[22],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.MONTHLY
  },
  {
    id: 'SK58293AN2K',
    createdDate: offsetDate(-17),
    account: accounts[23],
    customer: customers[23],
    billingStatus: BillingStatus.SCHEDULED,
    billingCycle: BillingCycle.YEARLY
  },
  {
    id: 'HD20392WL5D',
    createdDate: offsetDate(-26),
    account: accounts[24],
    customer: customers[24],
    billingStatus: BillingStatus.PAID,
    billingCycle: BillingCycle.MONTHLY
  }
];
