// app/router.jsx
import { lazy, Suspense, useLayoutEffect, useState } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigation,
} from "react-router-dom";
import AuthProvider from "../modules/auth/AuthProvider.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import PageLoader from "../components/common/PageLoader.jsx";

const LandingPage = lazy(() => import("../modules/home/pages/LandingPage.jsx"));
const LoginPage = lazy(() => import("../modules/auth/pages/LoginPage.jsx"));
const RegisterPage = lazy(
  () => import("../modules/auth/pages/RegisterPage.jsx"),
);
const AppointmentPage = lazy(
  () => import("../modules/appointment/pages/AppointmentPage.jsx"),
);
const DashboardPage = lazy(
  () => import("../modules/home/pages/DashboardPage.jsx"),
);
const ProfilePage = lazy(
  () => import("../modules/home/pages/ProfilePage.jsx"),
);
const UnderConstructionPage = lazy(
  () => import("../modules/home/pages/UnderConstructionPage.jsx"),
);

function RouteLoadingBoundary() {
  const navigation = useNavigation();
  const location = useLocation();
  const [loadingRoute, setLoadingRoute] = useState(true);

  useLayoutEffect(() => {
    setLoadingRoute(true);
    const timeoutId = window.setTimeout(() => setLoadingRoute(false), 350);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search]);

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      {(loadingRoute || navigation.state !== "idle") && (
        <PageLoader overlay={!loadingRoute} />
      )}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RouteLoadingBoundary />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/under-construction", element: <UnderConstructionPage /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/appointment",
        element: (
          <ProtectedRoute>
            <AppointmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <UnderConstructionPage /> },
    ],
  },
]);

export default function Router() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}