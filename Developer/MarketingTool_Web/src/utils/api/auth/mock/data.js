// @project
import { AuthRole } from '@/enum';

/***************************  DATA - USERS  ***************************/

const mockUsers = [
  {
    id: '1',
    email: 'super_admin@saasable.io',
    role: AuthRole.SUPER_ADMIN,
    contact: '123456789',
    dialcode: '+1',
    firstname: 'John',
    lastname: 'Charly',
    password: 'Super@123',
    access_token: 'super_admin_acess_token'
  },
  {
    id: '2',
    email: 'admin@saasable.io',
    role: AuthRole.ADMIN,
    contact: '123456789',
    dialcode: '+91',
    firstname: 'Mark',
    lastname: 'Davidson',
    password: 'Admin@123',
    access_token: 'admin_acess_token'
  },
  {
    id: '3',
    email: 'user@saasable.io',
    role: AuthRole.USER,
    contact: '123456789',
    dialcode: '+91',
    firstname: 'Bob',
    lastname: 'Dylan',
    password: 'User@123',
    access_token: 'user_acess_token'
  }
];

export default mockUsers;
