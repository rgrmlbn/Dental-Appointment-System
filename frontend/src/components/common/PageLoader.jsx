export default function PageLoader({ overlay = false }) {
  return (
    <div
      className={`page-loader${overlay ? " page-loader--overlay" : ""}`}
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
