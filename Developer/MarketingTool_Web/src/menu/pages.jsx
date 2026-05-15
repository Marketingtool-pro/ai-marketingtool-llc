// @project
import { AuthRole } from '@/enum';

// @types

/***************************  MENU ITEMS - PAGES  ***************************/

const pages = {
  id: 'group-page',
  title: 'page',
  icon: 'IconDotsVertical',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'authentication',
      type: 'collapse',
      icon: 'IconLogin2',
      roles: [AuthRole.SUPER_ADMIN, AuthRole.ADMIN],
      children: [
        {
          id: 'login',
          title: 'login',
          type: 'item',
          url: '/auth/login',
          target: true
        },
        {
          id: 'register',
          title: 'register',
          type: 'item',
          url: '/auth/register',
          target: true
        },
        {
          id: 'forgot-password',
          title: 'forgot-password',
          type: 'item',
          url: '/auth/forgot-password',
          target: true
        },
        {
          id: 'password-recovery',
          title: 'password-recovery',
          type: 'item',
          url: '/auth/password-recovery',
          target: true
        },
        {
          id: 'otp-verification',
          title: 'otp-verification',
          type: 'item',
          url: '/auth/otp-verification?email=demo@saasable.io',
          target: true
        }
      ]
    },
    {
      id: 'onboarding',
      title: 'onboarding',
      type: 'item',
      icon: 'IconUserQuestion',
      url: '/auth/onboarding',
      target: true
    },
    {
      id: 'sample-page',
      title: 'sample-page',
      type: 'item',
      url: '/sample-page',
      icon: 'IconBrandChrome'
    }
  ]
};

export default pages;
