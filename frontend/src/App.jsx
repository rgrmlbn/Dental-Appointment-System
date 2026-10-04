import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./modules/auth/AuthProvider.jsx";
import PageTransitionLoader from "./components/layouts/PageTransitionLoader.jsx";
import AppRoutes from "./app/router.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PageTransitionLoader>
          <AppRoutes />
        </PageTransitionLoader>
      </AuthProvider>
    </BrowserRouter>
  );
}