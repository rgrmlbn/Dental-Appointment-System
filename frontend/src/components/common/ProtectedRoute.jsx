import { Navigate } from "react-router-dom";
import { useAuth } from "../../modules/auth/useAuth.js";
import PageLoader from "./PageLoader.jsx";

/**
 * Wraps a route that requires authentication.
 * Shows the shared loader while hydrating, then redirects if not logged in.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}