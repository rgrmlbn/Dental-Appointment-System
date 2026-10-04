import { Suspense, useCallback, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "../common/PageLoader.jsx";

function ContentReady({ onReady }) {
  useLayoutEffect(() => {
    onReady();
  }, [onReady]);

  return null;
}

export default function PageTransitionLoader({ children }) {
  const { pathname, search } = useLocation();
  const [minimumDelayElapsed, setMinimumDelayElapsed] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const isLoading = !minimumDelayElapsed || !contentReady;

  useLayoutEffect(() => {
    setMinimumDelayElapsed(false);
    setContentReady(false);
    const timeoutId = window.setTimeout(() => setMinimumDelayElapsed(true), 850);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, search]);

  useLayoutEffect(() => {
    if (!isLoading) return undefined;

    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, [isLoading]);

  const handleContentReady = useCallback(() => setContentReady(true), []);

  return (
    <>
      <Suspense fallback={null}>
        <div
          key={`${pathname}${search}`}
          className={isLoading ? "page-transition-content--loading" : undefined}
        >
          {children}
          <ContentReady onReady={handleContentReady} />
        </div>
      </Suspense>
      {isLoading && <PageLoader />}
    </>
  );
}
