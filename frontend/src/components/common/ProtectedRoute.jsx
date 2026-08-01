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
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#f8fafc", color: "#64748b",
        fontFamily: "system-ui, sans-serif", fontSize: "0.9rem",
      }}>
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}