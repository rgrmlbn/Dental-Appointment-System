import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-navy font-[family-name:var(--font-body)] text-[rgba(255,255,255,0.65)]" id="contact">
    <div className="mx-auto grid max-w-[1200px] grid-cols-[1.6fr_1fr_1fr_1.4fr] gap-12 px-8 pb-12 pt-[4.5rem] max-[1000px]:grid-cols-2 max-[580px]:grid-cols-1 max-[580px]:gap-8 max-[580px]:px-6 max-[580px]:pb-8 max-[580px]:pt-12">

      {/* Brand column */}
      <div className="flex flex-col gap-[1.2rem] max-[1000px]:col-span-full max-[580px]:col-auto">
        <img src="/logo.png" alt="DentalCare Logo" className="h-9 min-w-[120px] self-start rounded-md object-contain" />
        <p className="max-w-[280px] text-[0.88rem] font-light leading-[1.7]">
          Providing compassionate, expert dental care to families since 2010.
          Your healthy smile is our greatest achievement.
        </p>
        <div className="flex gap-[0.6rem]">
          {/* Facebook */}
          <Link to="/under-construction" className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.65)] no-underline transition-[background,color,border-color] duration-200 hover:border-blue hover:bg-blue hover:text-white" aria-label="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </Link>
          {/* Instagram */}
          <Link to="/under-construction" className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.65)] no-underline transition-[background,color,border-color] duration-200 hover:border-blue hover:bg-blue hover:text-white" aria-label="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </Link>
          {/* Twitter/X */}
          <Link to="/under-construction" className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.65)] no-underline transition-[background,color,border-color] duration-200 hover:border-blue hover:bg-blue hover:text-white" aria-label="Twitter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="mb-[1.2rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.9)]">Quick Links</h4>
        <ul className="flex list-none flex-col gap-[0.65rem]">
          {[
            { label: 'Home',             href: '#home' },
            { label: 'Services',         href: '#services' },
            { label: 'Doctors',          href: '#doctors' },
            { label: 'Patient',          href: '/register' },
            { label: 'Book Appointment', href: '/register' },
          ].map(({ label, href }) => (
            <li key={label}><a className="text-[0.88rem] font-normal text-[rgba(255,255,255,0.55)] no-underline transition-colors duration-200 hover:text-[rgba(255,255,255,0.9)]" href={href}>{label}</a></li>
          ))}
        </ul>
      </div>

      {/* Services */}
      <div>
        <h4 className="mb-[1.2rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.9)]">Services</h4>
          <ul className="flex list-none flex-col gap-[0.65rem]">
            {[
              'General Checkup',
              'Dental Cleaning',
              'Tooth Extraction',
              'Braces Consultation',
              'Root Canal Treatment',
              'Teeth Whitening',
              'Dental Filling',
              'X-Ray',
            ].map(s => (
              <li key={s}>
                <a className="text-[0.88rem] font-normal text-[rgba(255,255,255,0.55)] no-underline transition-colors duration-200 hover:text-[rgba(255,255,255,0.9)]" href="#services">{s}</a>
              </li>
            ))}
          </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="mb-[1.2rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.9)]">Contact & Hours</h4>
        <ul className="mb-6 flex list-none flex-col gap-[0.9rem]">
          <li className="flex items-start gap-[0.65rem] text-[0.88rem] font-light leading-[1.55]">
            <svg className="mt-[0.15rem] shrink-0 opacity-70" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span>123 Dental Ave, Quezon City<br />Metro Manila, Philippines</span>
          </li>
          <li className="flex items-start gap-[0.65rem] text-[0.88rem] font-light leading-[1.55]">
            <svg className="mt-[0.15rem] shrink-0 opacity-70" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
            </svg>
            <span>+63 (2) 8123-4567</span>
          </li>
          <li className="flex items-start gap-[0.65rem] text-[0.88rem] font-light leading-[1.55]">
            <svg className="mt-[0.15rem] shrink-0 opacity-70" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>dentalcarephilippines@gmail.com</span>
          </li>
        </ul>

        <div className="flex flex-col gap-2 rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] p-4">
          <div className="flex items-center justify-between text-[0.82rem]">
            <span className="text-[rgba(255,255,255,0.55)]">Mon – Fri</span>
            <span className="font-semibold text-[rgba(255,255,255,0.85)]">8:00 AM – 7:00 PM</span>
          </div>
          <div className="flex items-center justify-between text-[0.82rem]">
            <span className="text-[rgba(255,255,255,0.55)]">Saturday</span>
            <span className="font-semibold text-[rgba(255,255,255,0.85)]">9:00 AM – 5:00 PM</span>
          </div>
          <div className="flex items-center justify-between text-[0.82rem]">
            <span className="text-[rgba(255,255,255,0.55)]">Sunday</span>
            <span className="font-semibold !text-[#EF9A9A]">Closed</span>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-[rgba(255,255,255,0.08)] px-8 py-5 max-[580px]:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 max-[580px]:flex-col max-[580px]:text-center">
        <p className="text-[0.8rem] text-[rgba(255,255,255,0.35)]">© {new Date().getFullYear()} <b>DentalCare</b> rgrmlbn. All rights reserved.</p>
        <div className="flex gap-6 max-[580px]:justify-center">
          <Link className="text-[0.8rem] text-[rgba(255,255,255,0.35)] no-underline transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]" to="/under-construction">Privacy Policy</Link>
          <Link className="text-[0.8rem] text-[rgba(255,255,255,0.35)] no-underline transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]" to="/under-construction">Terms of Service</Link>
          <Link className="text-[0.8rem] text-[rgba(255,255,255,0.35)] no-underline transition-colors duration-200 hover:text-[rgba(255,255,255,0.7)]" to="/under-construction">Cookie Policy</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;