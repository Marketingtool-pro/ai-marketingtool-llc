// @types

/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const other = {
  id: 'group-other',
  title: 'other',
  icon: 'IconDotsVertical',
  type: 'group',
  children: [
    {
      id: 'changelog',
      title: 'changelog',
      type: 'item',
      url: 'https://phoenixcoded.gitbook.io/saasable/changelog',
      target: true,
      icon: 'IconHistory'
    },
    {
      id: 'documentation',
      title: 'documentation',
      type: 'item',
      url: 'https://phoenixcoded.gitbook.io/saasable',
      target: true,
      icon: 'IconNotes'
    },
    {
      id: 'support',
      title: 'support',
      type: 'item',
      url: 'https://support.phoenixcoded.net',
      target: true,
      icon: 'IconLifebuoy'
    },
    {
      id: 'menu-levels',
      title: 'menu-levels',
      type: 'collapse',
      icon: 'IconMenu2',
      children: [
        {
          id: 'menu-level-1.1',
          title: 'level1',
          type: 'item',
          url: '#'
        },
        {
          id: 'menu-level-1.2',
          title: 'level1',
          type: 'collapse',
          children: [
            {
              id: 'menu-level-2.1',
              title: 'level2',
              type: 'item',
              url: '#'
            },
            {
              id: 'menu-level-2.2',
              title: 'level2',
              type: 'collapse',
              children: [
                {
                  id: 'menu-level-3.1',
                  title: 'level3',
                  type: 'item',
                  url: '#'
                },
                {
                  id: 'menu-level-3.2',
                  title: 'level3',
                  type: 'item',
                  url: '#'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default other;
