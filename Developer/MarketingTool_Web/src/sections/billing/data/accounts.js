// @project
import { plans } from './plans';
import { profiles } from './profile';

// @types
import { Plans } from '@/sections/billing/type';

const starterPlan = plans.filter((plan) => plan.name === Plans.STARTER)[0];
const professionalPlan = plans.filter((plan) => plan.name === Plans.PROFESSIONAL)[0];
const allToolsPlan = plans.filter((plan) => plan.name === Plans.ALL_TOOLS)[0];

export const accounts = [
  {
    id: 'A1D94G7B',
    profile: profiles[0],
    plan: starterPlan,
    taxNo: '124AAMFC96663C1ZA'
  },
  {
    id: 'B6E28HF2',
    profile: profiles[1],
    plan: starterPlan,
    taxNo: '125BBMFC96663C2ZB'
  },
  {
    id: 'C9K31ZXP',
    profile: profiles[2],
    plan: allToolsPlan,
    taxNo: '126CCMFC96663C3ZC'
  },
  {
    id: 'D3X75VNM',
    profile: profiles[3],
    plan: starterPlan,
    taxNo: '127DDMFC96663C4ZD'
  },
  {
    id: 'E8L90TYW',
    profile: profiles[4],
    plan: starterPlan,
    taxNo: '128EEMFC96663C5ZE'
  },
  {
    id: 'F4Q61ZCJ',
    profile: profiles[5],
    plan: allToolsPlan,
    taxNo: '129FFMFC96663C6ZF'
  },
  {
    id: 'G7B83PKL',
    profile: profiles[6],
    plan: starterPlan,
    taxNo: '130GGMFC96663C7ZG'
  },
  {
    id: 'H1R52MXN',
    profile: profiles[7],
    plan: starterPlan,
    taxNo: '131HHMFC96663C8ZH'
  },
  {
    id: 'J5W64DLQ',
    profile: profiles[8],
    plan: allToolsPlan,
    taxNo: '132JJMFC96663C9ZJ'
  },
  {
    id: 'K9Z02TBA',
    profile: profiles[9],
    plan: starterPlan,
    taxNo: '133KKMFC96663C0ZK'
  },
  {
    id: 'L3C85VUR',
    profile: profiles[10],
    plan: starterPlan,
    taxNo: '134LLMFC96663C1ZL'
  },
  {
    id: 'M2D71NKH',
    profile: profiles[11],
    plan: allToolsPlan,
    taxNo: '135MMMFC96663C2ZM'
  },
  {
    id: 'N6F42WQE',
    profile: profiles[12],
    plan: starterPlan,
    taxNo: '136NNMFC96663C3ZN'
  },
  {
    id: 'P0X63AZT',
    profile: profiles[13],
    plan: allToolsPlan,
    taxNo: '137OOMFC96663C4ZO'
  },
  {
    id: 'Q8U54DCY',
    profile: profiles[14],
    plan: starterPlan,
    taxNo: '138PPMFC96663C5ZP'
  },
  {
    id: 'R7B32LKN',
    profile: profiles[15],
    plan: starterPlan,
    taxNo: '139QQMFC96663C6ZQ'
  },
  {
    id: 'S9J10PMV',
    profile: profiles[16],
    plan: allToolsPlan,
    taxNo: '140RRMFC96663C7ZR'
  },
  {
    id: 'T4E67YGB',
    profile: profiles[17],
    plan: starterPlan,
    taxNo: '141SSMFC96663C8ZS'
  },
  {
    id: 'U1N95XKL',
    profile: profiles[18],
    plan: starterPlan,
    taxNo: '142TTMFC96663C9ZT'
  },
  {
    id: 'V6A28RDJ',
    profile: profiles[19],
    plan: allToolsPlan,
    taxNo: '143UUMFC96663C0ZU'
  },
  {
    id: 'W0C70ZNM',
    profile: profiles[20],
    plan: starterPlan,
    taxNo: '144VVMFC96663C1ZV'
  },
  {
    id: 'X3Y91QWT',
    profile: profiles[21],
    plan: starterPlan,
    taxNo: '145WWMFC96663C2ZW'
  },
  {
    id: 'Y2P44BKH',
    profile: profiles[22],
    plan: allToolsPlan,
    taxNo: '146XXMFC96663C3ZX'
  },
  {
    id: 'Z5M88JLE',
    profile: profiles[23],
    plan: starterPlan,
    taxNo: '147YYMFC96663C4ZY'
  },
  {
    id: 'A9K71NVC',
    profile: profiles[24],
    plan: starterPlan,
    taxNo: '148ZZMFC96663C5ZZ'
  }
];
