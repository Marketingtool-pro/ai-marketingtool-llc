import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";

// @project
import Loadable from "@/components/Loadable";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminLayout from "@/layouts/AdminLayout";
import AuthGuard from "@/utils/route-guard/AuthGuard";
import RoleGuard from "@/utils/route-guard/RoleGuard";

// Dashboard — USE the template's analytics page with charts
const AnalyticsPage = Loadable(lazy(() => import("@/views/admin/dashboard/analytics")));

// Core Pages
const ChatPage = Loadable(lazy(() => import("@/views/admin/chat")));
const ChatCreateEmail = Loadable(lazy(() => import("@/views/admin/chat/pages/CreateEmail")));
const ChatAutomate = Loadable(lazy(() => import("@/views/admin/chat/pages/Automate")));
const ChatInsights = Loadable(lazy(() => import("@/views/admin/chat/pages/Insights")));
const CommandCentrePage = Loadable(lazy(() => import("@/views/admin/command-centre")));
const CampaignsPage = Loadable(lazy(() => import("@/views/admin/campaigns")));
const MetaAuditPage = Loadable(lazy(() => import("@/views/admin/meta-audit")));
const AdLibraryPage = Loadable(lazy(() => import("@/views/admin/ad-library")));
const AnalyticsStandalonePage = Loadable(lazy(() => import("@/views/admin/analytics")));
const ReportsPage = Loadable(lazy(() => import("@/views/admin/reports")));
const ChartPage = Loadable(lazy(() => import("@/views/admin/chart")));

// Tools
const ToolsCataloguePage = Loadable(lazy(() => import("@/views/admin/tools")));
const ToolDetailPage = Loadable(lazy(() => import("@/views/admin/tools/tool-detail")));

// Platforms
const PlatformPage = Loadable(lazy(() => import("@/views/admin/platforms")));

// Support
const PricingPage = Loadable(lazy(() => import("@/views/admin/pricing")));
const HelpPage = Loadable(lazy(() => import("@/views/admin/help")));
const SettingPage = Loadable(lazy(() => import("@/views/admin/setting")));
const ManageBrandPage = Loadable(lazy(() => import("@/views/admin/setting/manage-brand")));
const TranslatePage = Loadable(lazy(() => import("@/views/admin/setting/translate")));
const PlanCreatePage = Loadable(lazy(() => import("@/views/admin/setting/pricing/plan-create")));
const PlanEditPage = Loadable(lazy(() => import("@/views/admin/setting/pricing/plan-edit")));

const MainRoutes = {
  path: "/",
  element: (
    <AuthProvider>
      <AuthGuard>
        <RoleGuard>
          <AdminLayout />
        </RoleGuard>
      </AuthGuard>
    </AuthProvider>
  ),
  children: [
    // Default redirect to dashboard
    { index: true, element: <Navigate to="dashboard" replace /> },

    // Dashboard — template's 3-tab analytics (Overview, User Behavior, Performance)
    {
      path: "dashboard",
      children: [
        { index: true, element: <Navigate to="analytics/overview" replace /> },
        {
          path: "analytics",
          children: [
            { index: true, element: <Navigate to="overview" replace /> },
            { path: ":tab", element: <AnalyticsPage /> },
          ],
        },
      ],
    },

    // Core Pages - Chat with 3 sub-pages
    { path: "chat", element: <ChatPage /> },
    { path: "chat/create-email", element: <ChatCreateEmail /> },
    { path: "chat/automate", element: <ChatAutomate /> },
    { path: "chat/insights", element: <ChatInsights /> },
    { path: "command-centre", element: <CommandCentrePage /> },
    { path: "campaigns", element: <CampaignsPage /> },
    { path: "meta-audit", element: <MetaAuditPage /> },
    { path: "ad-library", element: <AdLibraryPage /> },
    { path: "analytics", element: <AnalyticsStandalonePage /> },
    { path: "reports", element: <ReportsPage /> },
    { path: "chart", element: <ChartPage /> },

    // Tools
    { path: "tools", element: <ToolsCataloguePage /> },
    { path: "tools/:slug", element: <ToolDetailPage /> },

    // Platforms
    { path: "platforms/:platform", element: <PlatformPage /> },

    // Support
    { path: "pricing", element: <PricingPage /> },
    { path: "help", element: <HelpPage /> },

    // Settings (profile, connections, security)
    {
      path: "setting",
      children: [
        { index: true, element: <Navigate to="profile" replace /> },
        { path: "general/brand", element: <ManageBrandPage /> },
        { path: "internationalization/translate/:language", element: <TranslatePage /> },
        { path: "pricing/plan-create", element: <PlanCreatePage /> },
        { path: "pricing/plan-edit/:id", element: <PlanEditPage /> },
        { path: ":tab", element: <SettingPage /> },
      ],
    },
    // Redirect /settings → /setting/profile
    { path: "settings", element: <Navigate to="/setting/profile" replace /> },
  ],
};

export default MainRoutes;
