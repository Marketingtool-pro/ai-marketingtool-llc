import { lazy } from 'react';

// @project
import Loadable from '@/components/Loadable';
import AuthLayout from '@/layouts/AuthLayout';
import GuestGuard from '@/utils/route-guard/GuestGuard';

// auth
const LoginPage = Loadable(lazy(() => import('@/views/auth/login')));
const RegisterPage = Loadable(lazy(() => import('@/views/auth/register')));
const ForgotPasswordPage = Loadable(lazy(() => import('@/views/auth/forgot-password')));
const PasswordRecoveryPage = Loadable(lazy(() => import('@/views/auth/password-recovery')));
const OtpVerificationPage = Loadable(lazy(() => import('@/views/auth/otp-verification')));
const SocialAuthCallbackPage = Loadable(lazy(() => import('@/views/auth/social-auth-callback')));

/***************************  AUTH ROUTES  ***************************/

const AuthRoutes = [
  {
    path: '/',
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'password-recovery', element: <PasswordRecoveryPage /> },
      { path: 'otp-verification', element: <OtpVerificationPage /> }
    ]
  },
  { path: '/social-auth-callback', element: <SocialAuthCallbackPage /> }
];

export default AuthRoutes;
