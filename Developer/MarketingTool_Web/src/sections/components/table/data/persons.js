// @project
import { plans } from './plans';
import { offsetDate } from '@/utils/offsetDate';

// @types
import { Plans } from '../type';

// @assets
import avatar1 from '@/assets/images/users/avatar-1.png';
import avatar2 from '@/assets/images/users/avatar-2.png';
import avatar3 from '@/assets/images/users/avatar-3.png';
import avatar4 from '@/assets/images/users/avatar-4.png';
import avatar5 from '@/assets/images/users/avatar-5.png';

const freePlan = plans.filter((plan) => plan.name === Plans.FREE)[0];
const basicPlan = plans.filter((plan) => plan.name === Plans.BASIC)[0];
const starterPlan = plans.filter((plan) => plan.name === Plans.STARTER)[0];
const enterprisePlan = plans.filter((plan) => plan.name === Plans.ENTERPRISE)[0];

export const persons = [
  {
    id: '1',
    avatar: avatar1,
    firstName: 'Stacy',
    lastName: 'Reichel',
    personname: 'stacy_reichel.890',
    role: 'Admin',
    email: 'stacy.reichel@gmail.com',
    dialCode: '+1',
    contact: '212-555-0199',
    zipCode: '47422',
    skills: ['JavaScript', 'Flutter', 'Azure'],
    address: '9867 Gerhold Pass, Beattyside, ID 77515-7178',
    isPublic: true,
    activity: 'Created',
    createdDate: offsetDate(-28),
    status: 'Active',
    timePeriod: '19 days ago',
    loginDate: '25 Jun 2024',
    progress: 73,
    plan: basicPlan,
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    followers: [
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      }
    ]
  },
  {
    id: '2',
    avatar: avatar4,
    firstName: 'Roderick',
    lastName: 'Rohan',
    personname: 'roderick.rohan',
    role: 'Developer',
    email: 'rohan.vonrueden@gmail.com',
    dialCode: '+1',
    contact: '310-555-0147',
    zipCode: '74812',
    skills: ['HTML', 'Kotlin', 'React'],
    address: 'Suite 780 727 Ratke Lights, Schultzburgh, IA 68208-6360',
    isPublic: true,
    activity: 'Logout',
    createdDate: offsetDate(-27),
    status: 'Pending',
    timePeriod: '20 days ago',
    loginDate: '30 Mar 2024',
    progress: 49,
    plan: starterPlan,
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      }
    ]
  },
  {
    id: '3',
    avatar: avatar5,
    firstName: 'Audrey',
    lastName: 'Leffler',
    personname: 'audrey_leffler',
    role: 'Super Admin',
    email: 'leffler.audrey@gmail.com',
    dialCode: '+1',
    contact: '718-555-0193',
    zipCode: '99720',
    skills: ['Angular', 'React', 'MongoDB'],
    address: '92502 Vicente Oval, Volkmanborough, LA 70067',
    isPublic: false,
    activity: 'Subscribe',
    createdDate: offsetDate(-25),
    status: 'Reported',
    timePeriod: 'a month ago',
    loginDate: '8 Jul 2024',
    progress: 29,
    plan: freePlan,
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      },
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      },
      {
        id: '5',
        photo: avatar1,
        name: 'Stacy Reichel'
      },
      {
        id: '3',
        photo: avatar3,
        name: 'Maureen Aufderhar'
      }
    ]
  },
  {
    id: '4',
    avatar: avatar2,
    firstName: 'Allison',
    lastName: 'Mosciski',
    personname: 'allison_mosciski',
    role: 'Developer',
    email: 'allison.mosc@gmail.com',
    dialCode: '+1',
    contact: '415-555-0138',
    zipCode: '37891',
    skills: ['JavaScript', 'Flutter', 'Azure'],
    address: 'Apt. 233 716 Dooley Field, Isidroborough, ID 37411',
    isPublic: true,
    activity: 'Created',
    createdDate: offsetDate(-25),
    status: 'Blocked',
    timePeriod: '19 days ago',
    loginDate: '15 Aug 2024',
    progress: 69,
    plan: basicPlan,
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '3',
        photo: avatar3,
        name: 'Maureen Aufderhar'
      }
    ]
  },
  {
    id: '5',
    avatar: avatar3,
    firstName: 'Maureen',
    lastName: 'Aufderhar',
    personname: 'maureen_aufderhar',
    role: 'Admin',
    email: 'maureen.aufderhar@gmail.com',
    dialCode: '+1',
    contact: '602-555-0176',
    zipCode: '89710',
    skills: ['HTML', 'Kotlin', 'React'],
    address: 'Apt. 717 8674 Rowe Viaduct, Hilpertborough, MN 84110-4845',
    isPublic: false,
    activity: 'Logout',
    createdDate: offsetDate(-24),
    status: 'Active',
    timePeriod: '20 days ago',
    loginDate: '12 Jan 2024',
    progress: 85,
    plan: starterPlan,
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    followers: [
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      },
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      },
      {
        id: '3',
        photo: avatar3,
        name: 'Maureen Aufderhar'
      },
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      }
    ]
  },
  {
    id: '6',
    avatar: avatar4,
    firstName: 'Drew',
    lastName: 'Stehr',
    personname: 'drew_stehr',
    role: 'Engineer',
    email: 'drew.stehr@gmail.com',
    dialCode: '+91',
    contact: '997-555-0127',
    zipCode: '89888',
    skills: ['Angular', 'React', 'MongoDB'],
    address: '11732 Satterfield Corner, Hilllberg',
    isPublic: true,
    activity: 'Subscribe',
    createdDate: offsetDate(-20),
    status: 'Pending',
    timePeriod: 'a month ago',
    loginDate: '25 Oct 2024',
    progress: 73,
    plan: enterprisePlan,
    billingCycle: 'Yearly',
    billingStatus: 'Scheduled',
    followers: [
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      }
    ]
  },
  {
    id: '7',
    avatar: avatar5,
    firstName: 'Jenny',
    lastName: 'Kozey',
    personname: 'jenny_kozey',
    role: 'Super Admin',
    email: 'jenny.kozey@gmail.com',
    dialCode: '+1',
    contact: '312-555-0164',
    zipCode: '65595',
    skills: ['JavaScript', 'Flutter', 'Azure', 'HTML'],
    address: '7674 Gisela Hill, New Michikoville',
    isPublic: true,
    activity: 'Created',
    createdDate: offsetDate(-20),
    status: 'Reported',
    timePeriod: '19 days ago',
    loginDate: '28 Aug 2024',
    progress: 5,
    plan: freePlan,
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '3',
        photo: avatar3,
        name: 'Maureen Aufderhar'
      },
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      },
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      }
    ]
  },
  {
    id: '8',
    avatar: avatar1,
    firstName: 'Travis',
    lastName: 'Adams',
    caption: 'Trusted',
    personname: 'travis_adams',
    role: 'Super Admin',
    email: 'travis.adams@gmail.com',
    dialCode: '+1',
    contact: '213-555-0192',
    zipCode: '84698',
    skills: ['HTML', 'Kotlin', 'React', 'Swift', 'Angular'],
    address: '78310 Turcotte Hills, Dickiville, SC 49525-1843',
    isPublic: true,
    activity: 'Logout',
    createdDate: offsetDate(-19),
    status: 'Blocked',
    timePeriod: '20 days ago',
    loginDate: '12 Jan 2024',
    progress: 95,
    plan: freePlan,
    billingCycle: 'Yearly',
    billingStatus: 'Scheduled',
    followers: [
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      }
    ]
  },
  {
    id: '9',
    avatar: avatar3,
    firstName: 'Abel',
    lastName: 'Klocko',
    personname: 'abel_klocko',
    role: 'Admin',
    email: 'abel.klocko@gmail.com',
    dialCode: '+1',
    contact: '718-555-0185',
    zipCode: '97491',
    skills: ['Angular', 'React', 'MongoDB'],
    address: '551 Sauer Junction, Hermanport, UT 02049',
    isPublic: true,
    activity: 'Subscribe',
    createdDate: offsetDate(-19),
    status: 'Pending',
    timePeriod: 'a month ago',
    loginDate: '24 May 2024',
    progress: 60,
    plan: enterprisePlan,
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '5',
        photo: avatar1,
        name: 'Stacy Reichel'
      },
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      },
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      },
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      }
    ]
  },
  {
    id: '10',
    avatar: avatar2,
    firstName: 'Lindsey',
    lastName: 'Baumbach',
    personname: 'lindsey_baumbach',
    role: 'Engineer',
    email: 'lindsey.baumbach@example.com',
    dialCode: '+1',
    contact: '415-555-0190',
    zipCode: '54712',
    skills: ['JavaScript', 'Flutter', 'Azure', 'HTML', 'Kotlin', 'React'],
    address: '329 Wiza Grove, East Ayana, TX 90334',
    isPublic: true,
    activity: 'Created',
    createdDate: offsetDate(-18),
    status: 'Active',
    timePeriod: '12 days ago',
    loginDate: '10 Apr 2024',
    progress: 92,
    plan: starterPlan,
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '3',
        photo: avatar3,
        name: 'Maureen Aufderhar'
      },
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      }
    ]
  },
  {
    id: '11',
    avatar: avatar5,
    firstName: 'Jermaine',
    lastName: 'Frami',
    personname: 'jermaine.frami',
    role: 'Developer',
    email: 'jermaine.frami@example.com',
    dialCode: '+91',
    contact: '983-555-0188',
    zipCode: '76811',
    skills: ['Angular', 'React', 'MongoDB'],
    address: 'Apt. 232 5537 Alexa Crossroad, Lake Chadrickville',
    isPublic: true,
    activity: 'Logout',
    createdDate: offsetDate(-17),
    status: 'Reported',
    timePeriod: '23 days ago',
    loginDate: '19 May 2024',
    progress: 81,
    plan: basicPlan,
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    followers: [
      {
        id: '3',
        photo: avatar3,
        name: 'Maureen Aufderhar'
      }
    ]
  },
  {
    id: '12',
    avatar: avatar1,
    firstName: 'Lola',
    lastName: 'Carter',
    personname: 'lola.carter',
    role: 'Admin',
    email: 'lola.carter@example.com',
    dialCode: '+1',
    contact: '212-555-0172',
    zipCode: '67820',
    skills: ['HTML', 'Kotlin', 'React', 'Swift', 'Angular'],
    address: '983 Heathcote Ports, South Helene, NY 10001',
    isPublic: true,
    activity: 'Subscribe',
    createdDate: offsetDate(-16),
    status: 'Pending',
    timePeriod: '2 days ago',
    loginDate: '11 Jun 2024',
    progress: 74,
    plan: freePlan,
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      },
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      }
    ]
  },
  {
    id: '13',
    avatar: avatar3,
    firstName: 'Chad',
    lastName: 'Bayer',
    personname: 'chad_bayer',
    role: 'Super Admin',
    email: 'chad.bayer@example.com',
    dialCode: '+1',
    contact: '310-555-0111',
    zipCode: '90001',
    skills: ['Azure', 'Angular'],
    address: '5078 Streich Ports, Port Joey, CA 93427',
    isPublic: true,
    activity: 'Created',
    createdDate: offsetDate(-12),
    status: 'Blocked',
    timePeriod: 'a week ago',
    loginDate: '28 Feb 2024',
    progress: 34,
    plan: starterPlan,
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    followers: [
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      },
      {
        id: '5',
        photo: avatar1,
        name: 'Stacy Reichel'
      },
      {
        id: '3',
        photo: avatar3,
        name: 'Maureen Aufderhar'
      },
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      }
    ]
  },
  {
    id: '14',
    avatar: avatar4,
    firstName: 'Cassandra',
    lastName: 'Wiza',
    personname: 'cassie_wiza',
    role: 'Developer',
    email: 'cassie.wiza@example.com',
    dialCode: '+91',
    contact: '982-555-0132',
    zipCode: '440011',
    skills: ['HTML', 'Kotlin', 'React', 'Swift', 'Angular'],
    address: '9240 Terry Parkway, Mumbai, MH',
    isPublic: true,
    activity: 'Subscribe',
    createdDate: offsetDate(-11),
    status: 'Active',
    timePeriod: 'a month ago',
    loginDate: '5 Mar 2024',
    progress: 99,
    plan: enterprisePlan,
    billingCycle: 'Yearly',
    billingStatus: 'Scheduled',
    followers: [
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      }
    ]
  },
  {
    id: '15',
    avatar: avatar5,
    firstName: 'Rolando',
    lastName: 'Runolfsson',
    personname: 'rolando.runolfsson',
    role: 'Engineer',
    email: 'rolando.runolfsson@example.com',
    dialCode: '+1',
    contact: '212-555-0147',
    zipCode: '10010',
    skills: ['JavaScript', 'Flutter', 'Azure', 'HTML', 'Kotlin', 'React'],
    address: '3892 Hillgrove Ave, Bronx, NY',
    isPublic: true,
    activity: 'Logout',
    createdDate: offsetDate(-11),
    status: 'Pending',
    timePeriod: 'a week ago',
    loginDate: '3 Apr 2024',
    progress: 62,
    plan: freePlan,
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      }
    ]
  },
  {
    id: '16',
    avatar: avatar2,
    firstName: 'Alyssa',
    lastName: 'Wuckert',
    personname: 'alyssa.wuckert',
    role: 'Admin',
    email: 'alyssa.wuckert@example.com',
    dialCode: '+1',
    contact: '305-555-0123',
    zipCode: '33101',
    skills: ['Azure', 'Kotlin'],
    address: '7218 Coral Way, Miami, FL',
    isPublic: false,
    activity: 'Created',
    createdDate: offsetDate(-11),
    status: 'Active',
    timePeriod: '10 days ago',
    loginDate: '15 May 2024',
    progress: 72,
    plan: starterPlan,
    billingCycle: 'Yearly',
    billingStatus: 'Scheduled',
    followers: [
      {
        id: '3',
        photo: avatar3,
        name: 'Maureen Aufderhar'
      }
    ]
  },
  {
    id: '17',
    avatar: avatar3,
    firstName: 'Marshall',
    lastName: 'Klein',
    personname: 'marshall.klein',
    role: 'Developer',
    email: 'marshall.klein@example.com',
    dialCode: '+91',
    contact: '986-555-0173',
    zipCode: '400001',
    skills: ['HTML', 'Kotlin', 'React', 'Swift', 'Angular'],
    address: '13 Mahalaxmi Road, Pune, MH',
    isPublic: true,
    activity: 'Subscribe',
    createdDate: offsetDate(-11),
    status: 'Reported',
    timePeriod: 'a month ago',
    loginDate: '2 May 2024',
    progress: 43,
    plan: enterprisePlan,
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      }
    ]
  },
  {
    id: '18',
    avatar: avatar4,
    firstName: 'Elliott',
    lastName: 'Feeney',
    personname: 'elliott.feeney',
    role: 'Engineer',
    email: 'elliott.feeney@example.com',
    dialCode: '+1',
    contact: '913-555-0129',
    zipCode: '66215',
    skills: ['JavaScript', 'Flutter', 'Azure', 'HTML', 'Kotlin', 'React'],
    address: '7772 Prairie View, Lenexa, KS',
    isPublic: true,
    activity: 'Logout',
    createdDate: offsetDate(-9),
    status: 'Blocked',
    timePeriod: '3 days ago',
    loginDate: '6 Jun 2024',
    progress: 86,
    plan: basicPlan,
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      },
      {
        id: '5',
        photo: avatar1,
        name: 'Stacy Reichel'
      },
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      }
    ]
  },
  {
    id: '19',
    avatar: avatar1,
    firstName: 'Katrina',
    lastName: 'Will',
    personname: 'katrina.will',
    role: 'Super Admin',
    email: 'katrina.will@example.com',
    dialCode: '+1',
    contact: '818-555-0104',
    zipCode: '91301',
    skills: ['Azure', 'Kotlin'],
    address: '1234 Oak Knoll Dr, Agoura Hills, CA',
    isPublic: false,
    activity: 'Created',
    createdDate: offsetDate(-9),
    status: 'Active',
    timePeriod: '20 days ago',
    loginDate: '30 Mar 2024',
    progress: 99,
    plan: freePlan,
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    followers: [
      {
        id: '5',
        photo: avatar1,
        name: 'Stacy Reichel'
      }
    ]
  },
  {
    id: '20',
    avatar: avatar2,
    firstName: 'Felix',
    lastName: 'Smitham',
    personname: 'felix_smitham',
    role: 'Developer',
    email: 'felix.smitham@example.com',
    dialCode: '+91',
    contact: '999-555-0192',
    zipCode: '560002',
    skills: ['HTML', 'Kotlin', 'React', 'Swift', 'Angular'],
    address: '76 Residency Road, Bangalore, KA',
    isPublic: true,
    activity: 'Logout',
    createdDate: offsetDate(-9),
    status: 'Reported',
    timePeriod: '15 days ago',
    loginDate: '9 Feb 2024',
    progress: 45,
    plan: enterprisePlan,
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      },
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      }
    ]
  },
  {
    id: '21',
    avatar: avatar3,
    firstName: 'Fiona',
    lastName: 'Huels',
    personname: 'fiona_huels',
    role: 'Admin',
    email: 'fiona.huels@example.com',
    dialCode: '+1',
    contact: '615-555-0155',
    zipCode: '37214',
    skills: ['JavaScript', 'Flutter', 'Azure', 'HTML', 'Kotlin', 'React'],
    address: '980 Briley Pkwy, Nashville, TN',
    isPublic: true,
    activity: 'Subscribe',
    createdDate: offsetDate(-9),
    status: 'Pending',
    timePeriod: '1 day ago',
    loginDate: '17 Jun 2024',
    progress: 10,
    plan: basicPlan,
    billingCycle: 'Monthly',
    billingStatus: 'Scheduled',
    followers: [
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      },
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      }
    ]
  },
  {
    id: '22',
    avatar: avatar5,
    firstName: 'George',
    lastName: 'Bartell',
    personname: 'george.bartell',
    role: 'Engineer',
    email: 'george.bartell@example.com',
    dialCode: '+1',
    contact: '303-555-0181',
    zipCode: '80203',
    skills: ['Python', 'HTML', 'SQL', 'React'],
    address: '123 Broadway, Denver, CO',
    isPublic: true,
    activity: 'Created',
    createdDate: offsetDate(-7),
    status: 'Active',
    timePeriod: '13 days ago',
    loginDate: '8 May 2024',
    progress: 78,
    plan: starterPlan,
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      },
      {
        id: '5',
        photo: avatar1,
        name: 'Stacy Reichel'
      },
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      },
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      }
    ]
  },
  {
    id: '23',
    avatar: avatar2,
    firstName: 'Nora',
    lastName: 'Runte',
    personname: 'nora_runte',
    role: 'Developer',
    email: 'nora.runte@example.com',
    dialCode: '+1',
    contact: '214-555-0174',
    zipCode: '75201',
    skills: ['Docker', 'AI', 'Data Science'],
    address: '214 Main Street, Dallas, TX',
    isPublic: true,
    activity: 'Logout',
    createdDate: offsetDate(-6),
    status: 'Blocked',
    timePeriod: '18 days ago',
    loginDate: '1 Apr 2024',
    progress: 75,
    plan: freePlan,
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      },
      {
        id: '5',
        photo: avatar1,
        name: 'Stacy Reichel'
      }
    ]
  },
  {
    id: '24',
    avatar: avatar4,
    firstName: 'Dean',
    lastName: 'Connelly',
    personname: 'dean.connelly',
    role: 'Admin',
    email: 'dean.connelly@example.com',
    dialCode: '+91',
    contact: '975-555-0144',
    zipCode: '500081',
    skills: ['AWS', 'AI', 'Data Science'],
    address: 'Hitech City, Hyderabad, TG',
    isPublic: true,
    activity: 'Subscribe',
    createdDate: offsetDate(-5),
    status: 'Reported',
    timePeriod: '10 days ago',
    loginDate: '10 Jun 2024',
    progress: 48,
    plan: basicPlan,
    billingCycle: 'Yearly',
    billingStatus: 'Scheduled',
    followers: [
      {
        id: '4',
        photo: avatar4,
        name: 'Roderick Rohan'
      }
    ]
  },
  {
    id: '25',
    avatar: avatar1,
    firstName: 'Irene',
    lastName: 'Stokes',
    personname: 'irene.stokes',
    role: 'Super Admin',
    email: 'irene.stokes@example.com',
    dialCode: '+1',
    contact: '718-555-0161',
    zipCode: '11201',
    skills: ['CSS', 'Flutter', 'Azure', 'HTML', 'Kotlin', 'React'],
    address: '84 Flatbush Ave, Brooklyn, NY',
    isPublic: false,
    activity: 'Created',
    createdDate: offsetDate(-4),
    status: 'Active',
    timePeriod: '17 days ago',
    loginDate: '3 Apr 2024',
    progress: 65,
    plan: starterPlan,
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      }
    ]
  },
  {
    id: '26',
    avatar: avatar2,
    firstName: 'Bryan',
    lastName: 'Towne',
    caption: 'Trusted',
    personname: 'bryan_towne',
    role: 'Engineer',
    email: 'bryan.towne@example.com',
    dialCode: '+91',
    contact: '900-555-0190',
    zipCode: '600001',
    skills: ['JavaScript', 'Kubernetes', 'Azure', 'HTML', 'Kotlin', 'React'],
    address: 'Old Mahabalipuram Road, Chennai, TN',
    isPublic: true,
    activity: 'Subscribe',
    createdDate: offsetDate(-4),
    status: 'Pending',
    timePeriod: '6 days ago',
    loginDate: '1 Jun 2024',
    progress: 20,
    plan: starterPlan,
    billingCycle: 'Monthly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '1',
        photo: avatar5,
        name: 'Jenny Kozey'
      },
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      },
      {
        id: '3',
        photo: avatar3,
        name: 'Maureen Aufderhar'
      }
    ]
  },
  {
    id: '27',
    avatar: avatar3,
    firstName: 'Tanya',
    lastName: 'Maggio',
    personname: 'tanya.maggio',
    role: 'Developer',
    email: 'tanya.maggio@example.com',
    dialCode: '+1',
    contact: '909-555-0148',
    zipCode: '92501',
    skills: ['CSS', 'HTML', 'Kotlin', 'React'],
    address: '1212 Riverside Ave, Riverside, CA',
    isPublic: false,
    activity: 'Logout',
    createdDate: offsetDate(-4),
    status: 'Blocked',
    timePeriod: '8 days ago',
    loginDate: '2 May 2024',
    progress: 70,
    plan: basicPlan,
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '3',
        photo: avatar3,
        name: 'Maureen Aufderhar'
      },
      {
        id: '1',
        photo: avatar4,
        name: 'Jenny Kozey'
      },
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      },
      {
        id: '5',
        photo: avatar1,
        name: 'Stacy Reichel'
      },
      {
        id: '4',
        photo: avatar3,
        name: 'Maureen Aufderhar'
      },
      {
        id: '6',
        photo: avatar5,
        name: 'Jenny Kozey'
      }
    ]
  },
  {
    id: '28',
    avatar: avatar4,
    firstName: 'Ethan',
    lastName: 'Ziemann',
    personname: 'ethan_ziemann',
    role: 'Admin',
    email: 'ethan.ziemann@example.com',
    dialCode: '+1',
    contact: '202-555-0170',
    zipCode: '20001',
    skills: ['Python', 'AI', 'Data Science', 'HTML', 'Kotlin', 'React'],
    address: '1600 Pennsylvania Ave, Washington, DC',
    isPublic: true,
    activity: 'Created',
    createdDate: offsetDate(0),
    status: 'Reported',
    timePeriod: '2 days ago',
    loginDate: '17 Jun 2024',
    progress: 95,
    plan: freePlan,
    billingCycle: 'Yearly',
    billingStatus: 'Paid',
    followers: [
      {
        id: '2',
        photo: avatar2,
        name: 'Travis Adams'
      }
    ]
  }
];
