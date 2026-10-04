const CTASection = () => (
  <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0B2447_0%,#1565C0_100%)] px-8 py-[5.5rem] max-[580px]:px-6 max-[580px]:py-16">
    <div className="relative z-[1] mx-auto grid max-w-[1200px] grid-cols-2 items-center gap-20 max-[900px]:grid-cols-1 max-[900px]:gap-12">
      {/* Left decorative blob */}
      <div className="pointer-events-none absolute -left-[100px] -top-[150px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(30,136,229,0.3),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-[100px] right-[5%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(0,172,193,0.2),transparent_70%)]" />

      <div className="flex flex-col gap-[1.4rem]">
        <span className="inline-block w-fit rounded-full border border-[rgba(105,240,174,0.3)] bg-[rgba(105,240,174,0.15)] px-[0.9rem] py-[0.35rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#69F0AE]">Ready to Start?</span>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
          Take the First Step<br />
          Toward a <em className="font-light italic text-[rgba(255,255,255,0.7)]">Healthier Smile</em>
        </h2>
        <p className="max-w-[460px] text-base font-light leading-[1.7] text-[rgba(255,255,255,0.65)]">
          Join over 4,800 satisfied patients who trust DentalCare for their oral health.
          Create a free account today and book your first appointment in minutes.
        </p>

        <div className="mt-1 flex flex-wrap gap-4">
          <a href="/register" className="inline-flex items-center gap-[0.55rem] rounded-full bg-white px-7 py-[0.85rem] font-[family-name:var(--font-body)] text-[0.95rem] font-bold text-blue no-underline transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(255,255,255,0.25)]">
            Create Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </a>
          <a href="/login" className="inline-flex items-center rounded-full border-[1.5px] border-[rgba(255,255,255,0.35)] bg-transparent px-7 py-[0.85rem] font-[family-name:var(--font-body)] text-[0.95rem] font-semibold text-[rgba(255,255,255,0.85)] no-underline transition-[background,border-color] duration-200 hover:border-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.08)]">
            Book Appointment
          </a>
        </div>

        <div className="mt-1 flex flex-wrap gap-5 max-[580px]:flex-col max-[580px]:gap-3">
          {['No credit card required', 'Free first consultation', 'Cancel anytime'].map(f => (
            <span key={f} className="flex items-center gap-[0.4rem] text-[0.82rem] font-medium text-[rgba(255,255,255,0.6)]">
              <svg className="shrink-0 text-[#69F0AE]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right illustration panel */}
      <div className="flex justify-center max-[900px]:order-first">
        <div className="w-full max-w-[380px] overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] shadow-[0_16px_48px_rgba(0,0,0,0.25)] backdrop-blur-[16px]">
          <div className="flex items-center gap-[0.45rem] border-b border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-[1.2rem] py-[0.85rem] text-[0.78rem] font-medium text-[rgba(255,255,255,0.5)] [&>span]:ml-2">
            <div className="mr-[0.1rem] h-[10px] w-[10px] rounded-full bg-[#FF5F57]"/>
            <div className="mr-[0.1rem] h-[10px] w-[10px] rounded-full bg-[#FEBC2E]"/>
            <div className="mr-[0.1rem] h-[10px] w-[10px] rounded-full bg-[#28C840]"/>
            <span>Book Appointment</span>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-4 rounded-[14px] border border-[rgba(105,240,174,0.2)] bg-[rgba(105,240,174,0.1)] px-4 py-[0.85rem] transition-[background] duration-200">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#69F0AE] text-[0.82rem] font-bold text-[#0B2447]">✓</div>
              <div>
                <div className="text-[0.75rem] font-medium uppercase leading-none tracking-[0.05em] text-[rgba(255,255,255,0.5)]">Choose Service</div>
                <div className="mt-1 text-[0.9rem] font-semibold text-white">Teeth Cleaning</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-[14px] border border-[rgba(105,240,174,0.2)] bg-[rgba(105,240,174,0.1)] px-4 py-[0.85rem] transition-[background] duration-200">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#69F0AE] text-[0.82rem] font-bold text-[#0B2447]">✓</div>
              <div>
                <div className="text-[0.75rem] font-medium uppercase leading-none tracking-[0.05em] text-[rgba(255,255,255,0.5)]">Select Doctor</div>
                <div className="mt-1 text-[0.9rem] font-semibold text-white">Dr. Roger Malabanan</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-[14px] border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.12)] px-4 py-[0.85rem] transition-[background] duration-200">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[0.82rem] font-bold text-navy">3</div>
              <div>
                <div className="text-[0.75rem] font-medium uppercase leading-none tracking-[0.05em] text-[rgba(255,255,255,0.5)]">Pick a Time</div>
                <div className="mt-1 text-[0.9rem] font-semibold text-white">Today, 2:30 PM</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-[0.85rem] opacity-50 transition-[background] duration-200">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] text-[0.82rem] font-bold text-white">4</div>
              <div>
                <div className="text-[0.75rem] font-medium uppercase leading-none tracking-[0.05em] text-[rgba(255,255,255,0.5)]">Confirm</div>
                <div className="mt-1 text-[0.9rem] font-semibold text-white">—</div>
              </div>
            </div>
            <a href="/login" className="mt-1 box-border block w-full cursor-pointer rounded-[14px] bg-white p-[0.9rem] text-center font-[family-name:var(--font-body)] text-[0.95rem] font-bold text-navy no-underline transition-[background,transform] duration-200 visited:text-navy hover:-translate-y-px hover:bg-ice hover:text-navy hover:no-underline">
              Confirm Booking →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;