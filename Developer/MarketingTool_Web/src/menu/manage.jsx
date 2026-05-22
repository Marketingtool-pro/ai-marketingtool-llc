/***************************  MENU - MAIN  ***************************/

const main = {
  id: 'group-main',
  title: 'main',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Smart Dashboard',
      type: 'item',
      url: '/dashboard/analytics/overview',
      icon: 'IconLayoutGrid',
      iconImage: '/images/sidebar/dashboard.png'
    },
    {
      id: 'chat',
      title: 'AI Chat',
      type: 'item',
      url: '/chat',
      icon: 'IconMessageChatbot',
      iconImage: '/images/sidebar/chat.png'
    },
    {
      id: 'command-centre',
      title: 'Command Centre',
      type: 'item',
      url: '/command-centre',
      icon: 'IconTargetArrow',
      iconImage: '/images/sidebar/command-centre.png'
    },
    {
      id: 'campaigns',
      title: 'Campaigns',
      type: 'item',
      url: '/campaigns',
      icon: 'IconSpeakerphone',
      iconImage: '/images/sidebar/campaigns.png'
    },
    {
      id: 'meta-audit',
      title: '360 Meta Audit',
      type: 'item',
      url: '/meta-audit',
      icon: 'IconShieldCheck',
      iconImage: '/images/sidebar/meta-audit.png'
    },
    {
      id: 'ad-library',
      title: 'Ad Library',
      type: 'item',
      url: '/ad-library',
      icon: 'IconSearch',
      iconImage: '/images/sidebar/ad-library.png'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      type: 'item',
      url: '/analytics',
      icon: 'IconChartBar',
      iconImage: '/images/sidebar/analytics.png'
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/reports',
      icon: 'IconFileAnalytics',
      iconImage: '/images/sidebar/reports.png'
    },
    {
      id: 'charts',
      title: 'chart',
      type: 'item',
      url: '/chart',
      icon: 'IconChartHistogram',
      iconImage: '/images/sidebar/analytics.png'
    }
  ]
};

export default main;
