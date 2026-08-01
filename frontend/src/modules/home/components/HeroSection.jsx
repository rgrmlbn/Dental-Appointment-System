import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      {/* Navbar */}
      <nav className="hero__nav">
        <div className="hero__nav-inner">
          <div className="hero__logo">
            <img src="/logo.png" alt="DentalCare Logo" className="hero__logo-img" />
          </div>
          <ul className="hero__nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#doctors">Doctors</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="hero__nav-actions">
            <Link to="/login" className="btn-ghost">Sign In</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="hero__content">
        <div className="hero__left">
          <span className="hero__badge">
            <span className="hero__badge-dot" />
            Now accepting new patients
          </span>

          <h1 className="hero__headline">
            Your Smile,<br />
            <em>Our Priority</em>
          </h1>

          <p className="hero__desc">
            Experience world-class dental care with a gentle, patient-first approach.
            From routine cleanings to complete smile transformations — we're here for every step.
          </p>

          <div className="hero__actions">
            <Link to="/login" className="btn-primary btn-large">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book Appointment
            </Link>
            <a href="#services" className="btn-outline btn-large">Explore Services</a>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">4,800+</span>
              <span className="hero__stat-label">Happy Patients</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">12+</span>
              <span className="hero__stat-label">Expert Dentists</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">15 yrs</span>
              <span className="hero__stat-label">In Practice</span>
            </div>
          </div>
        </div>

        <div className="hero__right">
          <div className="hero__img-wrapper">
            <div className="hero__img-bg" />
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=700&q=80"
              alt="Dental professional at work"
              className="hero__img"
            />
            <div className="hero__card hero__card--top">
              <div className="hero__card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <div className="hero__card-title">Certified Clinic</div>
                <div className="hero__card-sub">ISO 9001 Accredited</div>
              </div>
            </div>
            <div className="hero__card hero__card--bottom">
              <div className="hero__card-icon hero__card-icon--green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#43A047" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div className="hero__card-title">Next Available</div>
                <div className="hero__card-sub">Today, 2:30 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="hero__wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F5F8FA"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;