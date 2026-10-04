import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[linear-gradient(135deg,#0B2447_0%,#1565C0_60%,#1E88E5_100%)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,rgba(30,136,229,0.18)_0%,transparent_70%),radial-gradient(ellipse_40%_60%_at_20%_80%,rgba(0,172,193,0.12)_0%,transparent_60%)] before:content-['']">
      {/* Navbar */}
      <nav className="sticky top-0 z-[100] border-b border-[rgba(255,255,255,0.08)] bg-[rgba(11,36,71,0.85)] px-8 backdrop-blur-[14px] max-[600px]:px-3">
        <div className="mx-auto flex h-[68px] max-w-[1200px] items-center gap-8 max-[600px]:h-[60px] max-[600px]:w-[95%] max-[600px]:justify-between max-[600px]:gap-0">
          <div className="flex-[0_0_auto]">
            <img src="/logo.png" alt="DentalCare Logo" className="block h-[38px] min-w-[120px] rounded-md object-contain max-[600px]:h-[34px] max-[600px]:min-w-0" />
          </div>
          <ul className="ml-auto flex list-none gap-8 max-[900px]:hidden">
            <li><a className="text-[0.95rem] font-medium tracking-[0.01em] text-[rgba(255,255,255,0.8)] no-underline transition-colors duration-200 hover:text-white" href="#services">Services</a></li>
            <li><a className="text-[0.95rem] font-medium tracking-[0.01em] text-[rgba(255,255,255,0.8)] no-underline transition-colors duration-200 hover:text-white" href="#doctors">Doctors</a></li>
            <li><a className="text-[0.95rem] font-medium tracking-[0.01em] text-[rgba(255,255,255,0.8)] no-underline transition-colors duration-200 hover:text-white" href="#contact">Contact</a></li>
          </ul>
          <div className="ml-0 flex items-center gap-3 max-[600px]:ml-auto">
            <Link to="/login" className="rounded-full border-[1.5px] border-[rgba(255,255,255,0.4)] px-4 py-[0.55rem] font-[family-name:var(--font-body)] text-[0.9rem] font-medium text-[rgba(255,255,255,0.9)] no-underline transition-[background,border-color] duration-200 hover:border-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.08)] max-[600px]:hidden">Sign In</Link>
            <Link to="/register" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border-0 bg-white px-5 py-[0.55rem] font-[family-name:var(--font-body)] text-[0.9rem] font-semibold text-blue no-underline transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.3)]">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="mx-auto grid w-full max-w-[1200px] flex-1 grid-cols-2 items-center gap-16 px-8 pb-24 pt-20 max-[900px]:grid-cols-1 max-[900px]:gap-12 max-[900px]:px-6 max-[900px]:pb-16 max-[900px]:pt-12">
        <div className="flex animate-fade-up flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-[0.55rem] rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.12)] px-4 py-[0.4rem] text-[0.82rem] font-semibold uppercase tracking-[0.04em] text-[rgba(255,255,255,0.92)]">
            <span className="h-[7px] w-[7px] animate-glow-pulse rounded-full bg-[#69F0AE] shadow-[0_0_0_3px_rgba(105,240,174,0.3)]" />
            Now accepting new patients
          </span>

          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.8rem,5vw,4.2rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white max-[600px]:text-[2.4rem]">
            Your Smile,<br />
            <em className="font-light italic text-[rgba(255,255,255,0.75)]">Our Priority</em>
          </h1>

          <p className="max-w-[480px] text-[1.05rem] font-light leading-[1.7] text-[rgba(255,255,255,0.72)]">
            Experience world-class dental care with a gentle, patient-first approach.
            From routine cleanings to complete smile transformations — we're here for every step.
          </p>

          <div className="mt-1 flex flex-wrap gap-4">
            <Link to="/login" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border-0 bg-white px-7 py-[0.8rem] font-[family-name:var(--font-body)] text-base font-semibold text-blue no-underline transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.3)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book Appointment
            </Link>
            <a href="#services" className="inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-[rgba(255,255,255,0.4)] bg-transparent px-7 py-[0.8rem] font-[family-name:var(--font-body)] text-base font-semibold text-[rgba(255,255,255,0.9)] no-underline transition-[background,border-color] duration-200 hover:border-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.08)]">Explore Services</a>
          </div>

          <div className="mt-2 flex items-center gap-6 border-t border-[rgba(255,255,255,0.15)] pt-6">
            <div className="flex flex-col gap-[0.15rem]">
              <span className="font-[family-name:var(--font-display)] text-[1.6rem] font-semibold leading-none text-white">4,800+</span>
              <span className="text-[0.78rem] font-medium uppercase tracking-[0.06em] text-[rgba(255,255,255,0.55)]">Happy Patients</span>
            </div>
            <div className="h-9 w-px bg-[rgba(255,255,255,0.2)]" />
            <div className="flex flex-col gap-[0.15rem]">
              <span className="font-[family-name:var(--font-display)] text-[1.6rem] font-semibold leading-none text-white">12+</span>
              <span className="text-[0.78rem] font-medium uppercase tracking-[0.06em] text-[rgba(255,255,255,0.55)]">Expert Dentists</span>
            </div>
            <div className="h-9 w-px bg-[rgba(255,255,255,0.2)]" />
            <div className="flex flex-col gap-[0.15rem]">
              <span className="font-[family-name:var(--font-display)] text-[1.6rem] font-semibold leading-none text-white">15 yrs</span>
              <span className="text-[0.78rem] font-medium uppercase tracking-[0.06em] text-[rgba(255,255,255,0.55)]">In Practice</span>
            </div>
          </div>
        </div>

        <div className="flex animate-fade-up-delayed justify-center max-[900px]:order-first">
          <div className="relative w-full max-w-[480px] max-[900px]:max-w-[380px]">
            <div className="absolute right-[-24px] top-[-24px] z-0 h-[90%] w-[90%] rounded-[22px] border-[1.5px] border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)]" />
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=700&q=80"
              alt="Dental professional at work"
              className="relative z-[1] block aspect-[4/5] w-full rounded-[22px] object-cover shadow-[0_20px_60px_rgba(11,36,71,0.16)]"
            />
            <div className="absolute left-[-2rem] top-6 z-[2] flex min-w-[180px] items-center gap-3 rounded-[14px] bg-white px-4 py-3 shadow-[0_8px_30px_rgba(11,36,71,0.18)] max-[900px]:left-[-1rem] max-[600px]:hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-ice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <div className="text-[0.82rem] font-bold leading-none text-text">Certified Clinic</div>
                <div className="mt-[0.2rem] text-[0.75rem] text-text-light">ISO 9001 Accredited</div>
              </div>
            </div>
            <div className="absolute bottom-8 right-[-2rem] z-[2] flex min-w-[180px] items-center gap-3 rounded-[14px] bg-white px-4 py-3 shadow-[0_8px_30px_rgba(11,36,71,0.18)] max-[900px]:right-[-1rem] max-[600px]:hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-mint">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#43A047" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div className="text-[0.82rem] font-bold leading-none text-text">Next Available</div>
                <div className="mt-[0.2rem] text-[0.75rem] text-text-light">Today, 2:30 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="mt-auto w-full leading-[0]">
        <svg className="block h-[60px] w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F5F8FA"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;