import './ServicesSection.css';

const services = [
  {
    id: 1,
    title: 'Teeth Cleaning',
    desc: 'Professional scaling and polishing to remove plaque and tartar for a healthier, brighter smile.',
    color: '#E3F2FD',
    iconColor: '#1565C0',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 2 5 5 5 8c0 4 3 7 3 11h8c0-4 3-7 3-11 0-3-3-6-7-6z"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Teeth Whitening',
    desc: 'Achieve a radiant, whiter smile with our advanced in-clinic whitening treatments.',
    color: '#FFF8E1',
    iconColor: '#F9A825',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Dental Braces',
    desc: 'Correct misaligned teeth with our range of orthodontic solutions including metal and ceramic braces.',
    color: '#F3E5F5',
    iconColor: '#8E24AA',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h8a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4z"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
        <line x1="10" y1="9" x2="10" y2="15"/>
        <line x1="14" y1="9" x2="14" y2="15"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: 'General Checkup',
    desc: 'Comprehensive oral exam including X-rays to assess the overall health of your teeth and gums.',
    color: '#E8F5E9',
    iconColor: '#43A047',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Tooth Extraction',
    desc: 'Safe and painless extraction procedures for severely damaged or impacted wisdom teeth.',
    color: '#FBE9E7',
    iconColor: '#E53935',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 0 0-5 5c0 3 2 5 2 9h6c0-4 2-6 2-9a5 5 0 0 0-5-5z"/>
        <line x1="9" y1="16" x2="15" y2="16"/>
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Dental Implants',
    desc: 'Permanent, natural-looking tooth replacements that restore function and aesthetics.',
    color: '#E0F7FA',
    iconColor: '#00ACC1',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v8M8 6l4-4 4 4"/>
        <rect x="7" y="10" width="10" height="4" rx="2"/>
        <path d="M9 14v6M15 14v6"/>
        <line x1="7" y1="20" x2="17" y2="20"/>
      </svg>
    ),
  },
];

const ServiceCard = ({ service }) => (
  <div className="service-card">
    <div className="service-card__icon" style={{ background: service.color, color: service.iconColor }}>
      {service.icon}
    </div>
    <h3 className="service-card__title">{service.title}</h3>
    <p className="service-card__desc">{service.desc}</p>
    <a href="/login" className="service-card__link">
      Book Now
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
      </svg>
    </a>
  </div>
);

const ServicesSection = () => (
  <section className="services" id="services">
    <div className="services__inner">
      <div className="services__header">
        <span className="section-tag">What We Offer</span>
        <h2 className="section-title">
          Comprehensive<br />
          <em>Dental Services</em>
        </h2>
        <p className="section-desc">
          From preventive care to cosmetic transformations, our expert team delivers
          personalized treatment tailored to your unique needs.
        </p>
      </div>

      <div className="services__grid">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;