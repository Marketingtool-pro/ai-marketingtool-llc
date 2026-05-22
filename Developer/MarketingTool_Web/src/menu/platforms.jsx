/***************************  MENU - PLATFORMS  ***************************/

const platforms = {
  id: 'group-platforms',
  title: 'platforms',
  type: 'group',
  children: [
    {
      id: 'google-ads',
      title: 'Google Ads',
      type: 'item',
      url: '/platforms/google',
      icon: 'IconBrandGoogle',
      iconImage: '/images/sidebar/google.png'
    },
    {
      id: 'meta-facebook',
      title: 'Meta / Facebook',
      type: 'item',
      url: '/platforms/meta',
      icon: 'IconBrandFacebook',
      iconImage: '/images/sidebar/meta.png'
    },
    {
      id: 'social-media',
      title: 'Social Media',
      type: 'item',
      url: '/platforms/social-media',
      icon: 'IconShare',
      iconImage: '/images/sidebar/social-media.png'
    },
    {
      id: 'content-seo',
      title: 'Content & SEO',
      type: 'item',
      url: '/platforms/seo',
      icon: 'IconPencil',
      iconImage: '/images/sidebar/seo.png'
    },
    {
      id: 'an-analytics',
      title: 'An-Analytics',
      type: 'item',
      url: '/platforms/analytics',
      icon: 'IconChartBar',
      iconImage: '/images/sidebar/analytics.png'
    },
    {
      id: 'ecommerce',
      title: 'E-commerce',
      type: 'item',
      url: '/platforms/ecommerce',
      icon: 'IconBriefcase',
      iconImage: '/images/sidebar/analytics.png'
    },
    {
      id: 'ai-tools',
      title: 'AI Tools',
      type: 'item',
      url: '/platforms/ai-tools',
      icon: 'IconRobot',
      iconImage: '/images/sidebar/ai-tools.png'
    }
  ]
};

export default platforms;
