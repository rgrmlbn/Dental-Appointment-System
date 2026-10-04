import { Navigate } from "react-router-dom";
import { useAuth } from "../../modules/auth/useAuth.js";
// (adjust relative path based on each file's location)

/**
 * Wraps a route that requires authentication.
 * Shows nothing while hydrating, then redirects to /login if not logged in.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc] font-sans text-[0.9rem] text-[#64748b]">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}