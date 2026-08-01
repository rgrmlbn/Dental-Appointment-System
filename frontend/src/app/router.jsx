// app/router.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "../modules/auth/AuthProvider.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";

import LandingPage from "../modules/home/pages/LandingPage.jsx";
import LoginPage from "../modules/auth/pages/LoginPage.jsx";
import RegisterPage from "../modules/auth/pages/RegisterPage.jsx";
import AppointmentPage from "../modules/appointment/pages/AppointmentPage.jsx";
import DashboardPage from "../modules/home/pages/DashboardPage.jsx";
import ProfilePage from "../modules/home/pages/ProfilePage.jsx"; // ← add this

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}