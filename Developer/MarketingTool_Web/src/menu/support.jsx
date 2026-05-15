/***************************  MENU - SUPPORT  ***************************/

const support = {
  id: 'group-support',
  title: 'support',
  type: 'group',
  children: [
    {
      id: 'pricing',
      title: 'Pricing',
      type: 'item',
      url: '/pricing',
      icon: 'IconCreditCard',
      iconImage: '/images/sidebar/pricing.png'
    },
    {
      id: 'help',
      title: 'Help Center',
      type: 'item',
      url: '/help',
      icon: 'IconHelp',
      iconImage: '/images/sidebar/help.png'
    },
    {
      id: 'setting',
      title: 'Settings',
      type: 'item',
      url: '/setting',
      icon: 'IconSettings',
      iconImage: '/images/sidebar/settings.png'
    }
  ]
};

export default support;
