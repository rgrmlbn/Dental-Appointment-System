import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";

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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/under-construction" element={<UnderConstructionPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointment"
        element={
          <ProtectedRoute>
            <AppointmentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<UnderConstructionPage />} />
    </Routes>
  );
}
