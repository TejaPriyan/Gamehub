import { useEffect } from 'react';
import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { consumeDeepLinkRedirect } from '@/lib/redirect';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import GameDetailPage from '@/components/pages/GameDetailPage';

// Layout component that includes ScrollToTop + deep-link recovery
function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    const target = consumeDeepLinkRedirect();
    if (target && target !== '/') {
      navigate(target, { replace: true });
    }
  }, [navigate]);

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
        path: "game/:id",
        element: <GameDetailPage />,
        routeMetadata: {
          pageIdentifier: 'game-detail',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename:
    import.meta.env.BASE_NAME ||
    (import.meta.env.BASE_URL !== "/" ? import.meta.env.BASE_URL.replace(/\/+$/, "") : undefined),
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
