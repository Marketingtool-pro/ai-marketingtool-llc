// @project
import { AuthRole } from '@/enum';

// @types

/***************************  MENU ITEMS - APPLICATIONS  ***************************/

const plugins = {
  id: 'group-plugins',
  title: 'plugins',
  icon: 'IconCloudUpload',
  type: 'group',
  roles: [AuthRole.SUPER_ADMIN, AuthRole.ADMIN],
  children: [
    {
      id: 'color-picker',
      title: 'color-picker',
      type: 'item',
      url: '/plugins/color-picker',
      icon: 'IconColorSwatch',
      roles: [AuthRole.SUPER_ADMIN, AuthRole.ADMIN]
    },
    {
      id: 'calendar',
      title: 'calendar',
      type: 'item',
      url: '/plugins/calendar',
      icon: 'IconCalendar',
      roles: [AuthRole.SUPER_ADMIN]
    },
    {
      id: 'dropzone',
      title: 'dropzone',
      type: 'item',
      url: '/plugins/dropzone',
      icon: 'IconUpload',
      roles: [AuthRole.SUPER_ADMIN, AuthRole.ADMIN]
    },
    {
      id: 'quill-editor',
      title: 'quill-editor',
      type: 'item',
      url: '/plugins/quill-editor',
      icon: 'IconTextWrap',
      roles: [AuthRole.SUPER_ADMIN, AuthRole.ADMIN]
    },
    {
      id: 'charts',
      title: 'chart',
      type: 'item',
      url: '/chart',
      icon: 'IconChartHistogram',
      roles: [AuthRole.SUPER_ADMIN]
    },
    {
      id: 'react-table',
      title: 'tanstack-table',
      type: 'item',
      url: '/table',
      icon: 'IconTableShare',
      roles: [AuthRole.SUPER_ADMIN, AuthRole.ADMIN]
    }
  ]
};

export default plugins;
