import { Suspense, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "../common/PageLoader.jsx";

export default function PageTransitionLoader({ children }) {
  const { pathname, search } = useLocation();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    setLoading(true);
    const timeoutId = window.setTimeout(() => setLoading(false), 350);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, search]);

  return (
    <Suspense fallback={<PageLoader />}>
      {loading ? (
        <PageLoader />
      ) : (
        <div key={`${pathname}${search}`}>
          {children}
        </div>
      )}
    </Suspense>
  );
}
