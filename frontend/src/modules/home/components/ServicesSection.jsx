const services = [
  {
    id: 1,
    title: 'General Checkup',
    desc: 'Comprehensive oral examination to assess the overall health of your teeth and gums.',
    iconClass: 'bg-mint text-accent2',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Dental Cleaning',
    desc: 'Professional cleaning to remove plaque and tartar while helping maintain healthy teeth and gums.',
    iconClass: 'bg-ice text-blue',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 2 5 5 5 8c0 4 3 7 3 11h8c0-4 3-7 3-11 0-3-3-6-7-6z"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Tooth Extraction',
    desc: 'Safe and professional extraction procedures for damaged, decayed, or problematic teeth.',
    iconClass: 'bg-[#FBE9E7] text-[#E53935]',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 0 0-5 5c0 3 2 5 2 9h6c0-4 2-6 2-9a5 5 0 0 0-5-5z"/>
        <line x1="9" y1="16" x2="15" y2="16"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Braces Consultation',
    desc: 'Professional orthodontic consultation to evaluate teeth alignment and discuss suitable braces options.',
    iconClass: 'bg-[#F3E5F5] text-[#8E24AA]',
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
    id: 5,
    title: 'Root Canal Treatment',
    desc: 'Treatment to remove infection from inside a tooth and help preserve the natural tooth.',
    iconClass: 'bg-[#FFF3E0] text-[#EF6C00]',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18"/>
        <path d="M8 6c1.5 1.5 2.5 3 2.5 5s-1 3.5-2.5 5"/>
        <path d="M16 6c-1.5 1.5-2.5 3-2.5 5s1 3.5 2.5 5"/>
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Teeth Whitening',
    desc: 'Professional whitening treatment designed to brighten your smile and reduce tooth discoloration.',
    iconClass: 'bg-[#FFF8E1] text-[#F9A825]',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ),
  },
  {
    id: 7,
    title: 'Dental Filling',
    desc: 'Restorative treatment to repair cavities and restore damaged teeth to their natural function.',
    iconClass: 'bg-[#E0F2F1] text-[#00897B]',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3C8.5 3 6 5.5 6 9c0 4 2 6 2 10h8c0-4 2-6 2-10 0-3.5-2.5-6-6-6z"/>
        <path d="M9 14h6"/>
        <path d="M10 17h4"/>
      </svg>
    ),
  },
  {
    id: 8,
    title: 'X-Ray',
    desc: 'Dental imaging to provide a clearer view of teeth, roots, and surrounding structures for accurate diagnosis.',
    iconClass: 'bg-[#EDE7F6] text-[#5E35B1]',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2"/>
        <path d="M8 8h8"/>
        <path d="M8 12h8"/>
        <path d="M8 16h5"/>
      </svg>
    ),
  },
];

const ServiceCard = ({ service }) => (
  <div className="flex cursor-default flex-col gap-3 rounded-[14px] border border-border bg-white p-7 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(11,36,71,0.12)]">
    <div className={`mb-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] ${service.iconClass}`}>
      {service.icon}
    </div>
    <h3 className="font-[family-name:var(--font-display)] text-[1.1rem] font-semibold leading-[1.2] text-navy">{service.title}</h3>
    <p className="flex-1 text-[0.9rem] font-light leading-[1.65] text-text-light">{service.desc}</p>
    <a href="/login" className="mt-1 inline-flex items-center gap-[0.4rem] text-[0.85rem] font-semibold text-blue no-underline transition-[gap] duration-200 hover:gap-[0.7rem]">
      Book Now
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
      </svg>
    </a>
  </div>
);

const ServicesSection = () => (
  <section className="bg-light-gray px-8 py-20 max-[580px]:px-6 max-[580px]:py-16" id="services">
    <div className="mx-auto max-w-[1200px]">
      <div className="mx-auto mb-14 max-w-[520px] text-center">
        <span className="mb-4 inline-block rounded-full bg-ice px-[0.9rem] py-[0.35rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-blue">What We Offer</span>
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-[clamp(2rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.02em] text-navy">
          Comprehensive<br />
          <em className="font-light italic text-blue">Dental Services</em>
        </h2>
        <p className="text-base font-light leading-[1.7] text-text-light">
          From preventive care to cosmetic transformations, our expert team delivers
          personalized treatment tailored to your unique needs.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[580px]:grid-cols-1">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;