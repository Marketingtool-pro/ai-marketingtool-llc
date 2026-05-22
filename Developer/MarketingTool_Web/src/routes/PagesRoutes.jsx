import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// @project
import Loadable from '@/components/Loadable';
import AuthLayout from '@/layouts/AuthLayout';

// auth
const LoginPage = Loadable(lazy(() => import('@/views/auth/login')));
const RegisterPage = Loadable(lazy(() => import('@/views/auth/register')));
const ForgotPasswordPage = Loadable(lazy(() => import('@/views/auth/forgot-password')));
const PasswordRecoveryPage = Loadable(lazy(() => import('@/views/auth/password-recovery')));
const OtpVerificationPage = Loadable(lazy(() => import('@/views/auth/otp-verification')));
const OnboardingPage = Loadable(lazy(() => import('@/views/auth/onboarding')));

/***************************  PAGES ROUTES  ***************************/

const PagesRoutes = {
  path: 'auth',
  element: <AuthLayout />,
  children: [
    { index: true, element: <Navigate to="login" replace /> },
    { path: 'login', element: <LoginPage /> },
    { path: 'register', element: <RegisterPage /> },
    { path: 'forgot-password', element: <ForgotPasswordPage /> },
    { path: 'password-recovery', element: <PasswordRecoveryPage /> },
    { path: 'otp-verification', element: <OtpVerificationPage /> },
    { path: 'onboarding', element: <OnboardingPage /> }
  ]
};

export default PagesRoutes;
