// @project
import { AuthRole } from '@/enum';

// @types

/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const uiElements = {
  id: 'group-ui-elements',
  title: 'ui-elements',
  icon: 'IconDotsVertical',
  type: 'group',
  roles: [AuthRole.SUPER_ADMIN, AuthRole.ADMIN],
  children: [
    {
      id: 'data-display',
      title: 'data-display',
      type: 'collapse',
      icon: 'IconListDetails',
      children: [
        {
          id: 'avatar',
          title: 'avatar',
          type: 'item',
          url: '/data-display/avatar'
        },
        {
          id: 'chip',
          title: 'chip',
          type: 'item',
          url: '/data-display/chip'
        },
        {
          id: 'illustration',
          title: 'illustration',
          type: 'item',
          url: '/data-display/illustration'
        },
        {
          id: 'tooltip',
          title: 'tooltip',
          type: 'item',
          url: '/data-display/tooltip'
        },
        {
          id: 'typography',
          title: 'typography',
          type: 'item',
          url: '/data-display/typography'
        },
        {
          id: 'other',
          title: 'other',
          type: 'item',
          url: '/data-display/other'
        }
      ]
    },
    {
      id: 'feedback',
      title: 'feedback',
      type: 'collapse',
      icon: 'IconBubbleText',
      children: [
        {
          id: 'dialog',
          title: 'dialog',
          type: 'item',
          url: '/feedback/dialog'
        },
        {
          id: 'progress',
          title: 'progress',
          type: 'item',
          url: '/feedback/progress'
        },
        {
          id: 'snackbar',
          title: 'snackbar',
          type: 'item',
          url: '/feedback/snackbar'
        }
      ]
    },
    {
      id: 'inputs',
      title: 'inputs',
      type: 'collapse',
      icon: 'IconForms',
      children: [
        {
          id: 'button',
          title: 'button',
          type: 'item',
          url: '/inputs/button'
        },
        {
          id: 'checkbox',
          title: 'checkbox',
          type: 'item',
          url: '/inputs/checkbox'
        },
        {
          id: 'drop-down',
          title: 'drop-down',
          type: 'item',
          url: '/inputs/drop-down'
        },
        {
          id: 'input',
          title: 'input',
          type: 'item',
          url: '/inputs/input'
        },
        {
          id: 'radio',
          title: 'radio',
          type: 'item',
          url: '/inputs/radio'
        },
        {
          id: 'slider',
          title: 'slider',
          type: 'item',
          url: '/inputs/slider'
        },
        {
          id: 'switch',
          title: 'switch',
          type: 'item',
          url: '/inputs/switch'
        }
      ]
    },
    {
      id: 'navigation',
      title: 'navigation',
      type: 'collapse',
      icon: 'IconLink',
      children: [
        {
          id: 'tabs',
          title: 'tabs',
          type: 'item',
          url: '/navigation/tabs'
        }
      ]
    },
    {
      id: 'surface',
      title: 'surface',
      type: 'collapse',
      icon: 'IconAppWindow',
      children: [
        {
          id: 'card',
          title: 'card',
          type: 'item',
          url: '/surface/card'
        }
      ]
    },
    {
      id: 'utils',
      title: 'utils',
      type: 'collapse',
      icon: 'IconTools',
      children: [
        {
          id: 'animate',
          title: 'animate',
          type: 'item',
          url: '/utils/animate'
        },
        {
          id: 'color',
          title: 'color',
          type: 'item',
          url: '/utils/color'
        },
        {
          id: 'shadow',
          title: 'shadow',
          type: 'item',
          url: '/utils/shadow'
        }
      ]
    }
  ]
};

export default uiElements;
