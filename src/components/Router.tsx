import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import ProfilePage from '@/components/pages/ProfilePage';
import DashboardPage from '@/components/pages/DashboardPage';
import VaultPage from '@/components/pages/VaultPage';
import SkillsPage from '@/components/pages/SkillsPage';
import CareersPage from '@/components/pages/CareersPage';
import VerificationPage from '@/components/pages/VerificationPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "profile",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view your profile">
            <ProfilePage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'profile',
        },
      },
      {
        path: "dashboard",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access your dashboard">
            <DashboardPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'dashboard',
        },
      },
      {
        path: "vault",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access your certificate vault">
            <VaultPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'vault',
        },
      },
      {
        path: "skills",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view your skills">
            <SkillsPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'skills',
        },
      },
      {
        path: "careers",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view career recommendations">
            <CareersPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'careers',
        },
      },
      {
        path: "verify",
        element: <VerificationPage />,
        routeMetadata: {
          pageIdentifier: 'verification',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
