import { Link } from "react-router-dom";

export default function UnderConstructionPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(155deg,#0b2447_0%,#1565c0_55%,#1e88e5_100%)] px-5 py-12 font-body">
      <div className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full bg-[rgba(255,255,255,0.06)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-[rgba(255,255,255,0.08)] blur-3xl" />

      <section className="relative w-full max-w-xl rounded-[24px] bg-white px-8 py-12 text-center shadow-[0_24px_80px_rgba(11,36,71,0.25)] max-[480px]:px-6">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#e3f2fd] text-[#1565c0]">
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4L14 13l-3-3z" />
            <path d="m14 10 3 3" />
          </svg>
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1565c0]">
          Coming soon
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-[-0.03em] text-[#0b2447] max-[480px]:text-2xl">
          This page is under construction
        </h1>
        <p className="mx-auto mb-8 max-w-md text-sm leading-6 text-[#607d8b]">
          We’re working on this part of DentalCare. Please check back soon, or
          return to the homepage to explore what’s available.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#0b2447_0%,#1565c0_100%)] px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_4px_16px_rgba(21,101,192,0.3)] transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1565c0]"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
