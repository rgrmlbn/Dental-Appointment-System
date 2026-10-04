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
  const routeKey = `${pathname}${search}`;
  const [minimumDelayRoute, setMinimumDelayRoute] = useState(null);
  const [contentReadyRoute, setContentReadyRoute] = useState(null);
  const isLoading =
    minimumDelayRoute !== routeKey || contentReadyRoute !== routeKey;

  useLayoutEffect(() => {
    const timeoutId = window.setTimeout(
      () => setMinimumDelayRoute(routeKey),
      850,
    );

    return () => window.clearTimeout(timeoutId);
  }, [routeKey]);

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

  const handleContentReady = useCallback(
    () => setContentReadyRoute(routeKey),
    [routeKey],
  );

  return (
    <>
      <Suspense fallback={null}>
        <div
          key={routeKey}
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
