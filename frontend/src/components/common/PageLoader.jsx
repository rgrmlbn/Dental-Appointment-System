export default function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-[1000] flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(155deg,#071a35_0%,#0b2447_38%,#1565c0_75%,#1e88e5_100%)] px-6 py-6 font-body text-white"
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.3)_0.7px,transparent_0.7px)] [background-position:center] [background-size:28px_28px] opacity-20 [mask-image:linear-gradient(transparent,#000_30%,#000_70%,transparent)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -left-[16%] -top-[28%] aspect-square w-[min(48vw,520px)] rounded-full bg-[radial-gradient(circle,rgba(100,181,246,0.2),transparent_68%)] motion-safe:animate-pulse" />
      <div className="pointer-events-none absolute -bottom-[35%] -right-[18%] aspect-square w-[min(48vw,520px)] rounded-full bg-[radial-gradient(circle,rgba(128,222,234,0.2),transparent_68%)] motion-safe:animate-pulse" />

      <div className="relative z-10 flex w-full max-w-[390px] flex-col items-center rounded-[28px] border border-white/25 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(255,255,255,0.07))] px-8 py-10 shadow-[0_30px_90px_rgba(3,17,39,0.28),inset_0_1px_rgba(255,255,255,0.18)] backdrop-blur-xl max-[480px]:px-5">


        <p className="mb-2 text-[0.67rem] font-bold uppercase tracking-[0.16em] text-[#d6ebff]/80">
          A little patience, please
        </p>
        <p className="m-0 text-center text-[clamp(1.3rem,4vw,1.65rem)] font-semibold tracking-[-0.035em]">
          Preparing your smile
        </p>
        <p className="mb-6 mt-2 text-center text-[0.82rem] font-light text-[#e8f2ff]/70">
          Getting your DentalCare experience ready.
        </p>
        <div
          className="h-[3px] w-full max-w-[208px] overflow-hidden rounded-full bg-white/20"
          role="progressbar"
          aria-label="Loading page"
          aria-valuetext="Loading"
        >
          <span className="page-loader-progress block h-full w-[42%] rounded-full bg-[linear-gradient(90deg,#90caf9,#fff,#80deea)] shadow-[0_0_12px_rgba(255,255,255,0.65)]" />
        </div>
      </div>
      <span className="absolute bottom-9 z-10 max-w-[calc(100%-2rem)] text-center text-[0.6rem] font-semibold tracking-[0.19em] text-[#e8f2ff]/50 max-[480px]:bottom-5 max-[480px]:leading-relaxed">
        DENTALCARE · YOUR SMILE, OUR PRIORITY
      </span>
    </div>
  );
}
