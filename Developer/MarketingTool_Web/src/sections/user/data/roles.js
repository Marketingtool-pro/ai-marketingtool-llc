// @types
import { Roles } from '@/sections/user/type';

export const rolesData = [
  {
    title: 'Super Admin',
    name: Roles.SUPER_ADMIN,
    content: 'Has full access to all settings, users, and system configurations.'
  },
  {
    title: 'Admin',
    name: Roles.ADMIN,
    content: 'Manages users, roles, and system settings with high-level access.'
  },
  {
    title: 'Engineer',
    name: Roles.ENGINEER,
    content: 'Handles technical operations, infrastructure, and system maintenance.'
  },
  {
    title: 'Developer',
    name: Roles.DEVELOPER,
    content: 'Develops and maintains applications, features, and integrations.'
  }
];
