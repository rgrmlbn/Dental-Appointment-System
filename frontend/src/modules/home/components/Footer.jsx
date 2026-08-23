import './Footer.css';

const Footer = () => (
  <footer className="footer" id="contact">
    <div className="footer__inner">

      {/* Brand column */}
      <div className="footer__col footer__col--brand">
        <img src="/logo.png" alt="DentalCare Logo" className="footer__logo" />
        <p className="footer__tagline">
          Providing compassionate, expert dental care to families since 2010.
          Your healthy smile is our greatest achievement.
        </p>
        <div className="footer__socials">
          {/* Facebook */}
          <a href="#" className="footer__social" aria-label="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="footer__social" aria-label="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          {/* Twitter/X */}
          <a href="#" className="footer__social" aria-label="Twitter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div className="footer__col">
        <h4 className="footer__col-title">Quick Links</h4>
        <ul className="footer__links">
          {[
            { label: 'Home',             href: '#home' },
            { label: 'Services',         href: '#services' },
            { label: 'Doctors',          href: '#doctors' },
            { label: 'Patient',          href: '/register' },
            { label: 'Book Appointment', href: '/register' },
          ].map(({ label, href }) => (
            <li key={label}><a href={href}>{label}</a></li>
          ))}
        </ul>
      </div>

      {/* Services */}
      <div className="footer__col">
        <h4 className="footer__col-title">Services</h4>
          <ul className="footer__links">
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
                <a href="#services">{s}</a>
              </li>
            ))}
          </ul>
      </div>

      {/* Contact */}
      <div className="footer__col">
        <h4 className="footer__col-title">Contact & Hours</h4>
        <ul className="footer__contact">
          <li>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span>123 Dental Ave, Quezon City<br />Metro Manila, Philippines</span>
          </li>
          <li>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
            </svg>
            <span>+63 (2) 8123-4567</span>
          </li>
          <li>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>dentalcarephilippines@gmail.com</span>
          </li>
        </ul>

        <div className="footer__hours">
          <div className="footer__hours-row">
            <span>Mon – Fri</span>
            <span>8:00 AM – 7:00 PM</span>
          </div>
          <div className="footer__hours-row">
            <span>Saturday</span>
            <span>9:00 AM – 5:00 PM</span>
          </div>
          <div className="footer__hours-row">
            <span>Sunday</span>
            <span className="footer__hours-closed">Closed</span>
          </div>
        </div>
      </div>
    </div>

    <div className="footer__bottom">
      <div className="footer__bottom-inner">
        <p>© {new Date().getFullYear()} <b>DentalCare</b> rgrmlbn. All rights reserved.</p>
        <div className="footer__legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;