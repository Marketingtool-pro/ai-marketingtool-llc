// @types
import { Roles } from '../type';

export const rolesData = [
  {
    title: 'Super Admin',
    name: Roles.SUPER_ADMIN,
    content: 'Has full access to all settings, persons, and system configurations.'
  },
  {
    title: 'Admin',
    name: Roles.ADMIN,
    content: 'Manages persons, roles, and system settings with high-level access.'
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
