import './CTASection.css';

const CTASection = () => (
  <section className="cta">
    <div className="cta__inner">
      {/* Left decorative blob */}
      <div className="cta__blob cta__blob--left" />
      <div className="cta__blob cta__blob--right" />

      <div className="cta__content">
        <span className="cta__tag">Ready to Start?</span>
        <h2 className="cta__title">
          Take the First Step<br />
          Toward a <em>Healthier Smile</em>
        </h2>
        <p className="cta__desc">
          Join over 4,800 satisfied patients who trust DentalCare for their oral health.
          Create a free account today and book your first appointment in minutes.
        </p>

        <div className="cta__actions">
          <a href="/register" className="cta__btn-primary">
            Create Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </a>
          <a href="/login" className="cta__btn-secondary">
            Book Appointment
          </a>
        </div>

        <div className="cta__features">
          {['No credit card required', 'Free first consultation', 'Cancel anytime'].map(f => (
            <span key={f} className="cta__feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right illustration panel */}
      <div className="cta__visual">
        <div className="cta__visual-card">
          <div className="cta__vc-header">
            <div className="cta__vc-dot" style={{background:'#FF5F57'}}/>
            <div className="cta__vc-dot" style={{background:'#FEBC2E'}}/>
            <div className="cta__vc-dot" style={{background:'#28C840'}}/>
            <span>Book Appointment</span>
          </div>
          <div className="cta__vc-body">
            <div className="cta__vc-step cta__vc-step--done">
              <div className="cta__vc-step-icon">✓</div>
              <div>
                <div className="cta__vc-step-label">Choose Service</div>
                <div className="cta__vc-step-val">Teeth Cleaning</div>
              </div>
            </div>
            <div className="cta__vc-step cta__vc-step--done">
              <div className="cta__vc-step-icon">✓</div>
              <div>
                <div className="cta__vc-step-label">Select Doctor</div>
                <div className="cta__vc-step-val">Dr. Maria Santos</div>
              </div>
            </div>
            <div className="cta__vc-step cta__vc-step--active">
              <div className="cta__vc-step-icon">3</div>
              <div>
                <div className="cta__vc-step-label">Pick a Time</div>
                <div className="cta__vc-step-val">Today, 2:30 PM</div>
              </div>
            </div>
            <div className="cta__vc-step cta__vc-step--pending">
              <div className="cta__vc-step-icon">4</div>
              <div>
                <div className="cta__vc-step-label">Confirm</div>
                <div className="cta__vc-step-val">—</div>
              </div>
            </div>
            <a href="/login" className="cta__vc-btn">
              Confirm Booking →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;