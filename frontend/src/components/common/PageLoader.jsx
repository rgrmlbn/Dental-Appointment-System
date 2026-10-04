export default function PageLoader() {
  return (
    <div
      className="page-loader"
      role="status"
      aria-live="polite"
    >
      <div className="page-loader__card">
        <span className="page-loader__spinner" aria-hidden="true" />
        <span>Loading DentalCare…</span>
      </div>
    </div>
  );
}
