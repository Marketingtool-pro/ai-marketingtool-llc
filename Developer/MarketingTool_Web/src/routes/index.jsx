import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

// @routes
import AuthRoutes from "./AuthRoutes";
import MainRoutes from "./MainRoutes";
import PagesRoutes from "./PagesRoutes";
import ErrorBoundary from "./ErrorBoundary";

// @project
import Loadable from "@/components/Loadable";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/utils/route-guard/AuthGuard";
import NotFoundCatch from "@/components/NotFoundCatch";

// Standalone pages (no AdminLayout)
const FbAdsCallbackPage = Loadable(lazy(() => import("@/views/admin/fb-connect-callback")));
const GoogleAdsCallbackPage = Loadable(lazy(() => import("@/views/admin/google-ads-callback")));
const IgAdsCallbackPage = Loadable(lazy(() => import("@/views/admin/ig-connect-callback")));
const LegalPage = Loadable(lazy(() => import("@/views/legal")));

/***************************  ROUTING RENDER  ***************************/

const OnboardingRoutes = [
  {
    path: "/oauth/facebook-ads",
    errorElement: <ErrorBoundary />,
    element: (
      <AuthProvider>
        <AuthGuard>
          <FbAdsCallbackPage />
        </AuthGuard>
      </AuthProvider>
    ),
  },
  {
    path: "/oauth/instagram-ads",
    errorElement: <ErrorBoundary />,
    element: (
      <AuthProvider>
        <AuthGuard>
          <IgAdsCallbackPage />
        </AuthGuard>
      </AuthProvider>
    ),
  },
  {
    path: "/oauth/google-ads",
    errorElement: <ErrorBoundary />,
    element: (
      <AuthProvider>
        <AuthGuard>
          <GoogleAdsCallbackPage />
        </AuthGuard>
      </AuthProvider>
    ),
  },
];

// Public legal pages (no auth required — accessible by Google)
const LegalRoutes = [
  { path: "/privacy-policy", errorElement: <ErrorBoundary />, element: <LegalPage /> },
  { path: "/terms-policy", errorElement: <ErrorBoundary />, element: <LegalPage /> },
  { path: "/cookie-policy", errorElement: <ErrorBoundary />, element: <LegalPage /> },
  { path: "/trust-verification", errorElement: <ErrorBoundary />, element: <LegalPage /> },
  { path: "/delete-account", errorElement: <ErrorBoundary />, element: <LegalPage /> },
];

const CatchAllRoute = {
  path: "*",
  element: <NotFoundCatch />,
};

const router = createBrowserRouter(
  [
    ...AuthRoutes.map((route) => ({ ...route, errorElement: <ErrorBoundary /> })),
    ...OnboardingRoutes,
    ...LegalRoutes,
    { ...MainRoutes, errorElement: <ErrorBoundary /> },
    { ...PagesRoutes, errorElement: <ErrorBoundary /> },
    CatchAllRoute,
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_URL,
  },
);

export default router;
