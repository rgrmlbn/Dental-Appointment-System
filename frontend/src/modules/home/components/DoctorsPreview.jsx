import './DoctorsPreview.css';

const doctors = [
  {
    id: 1,
    name: 'Dr. Mary Joy Bongbonghanay',
    specialization: 'Orthodontist',
    experience: '12 years exp.',
    rating: 4.9,
    reviews: 214,
    img: '../doctor_mj.jpg',
    tags: ['Braces', 'Invisalign'],
  },
  {
    id: 2,
    name: 'Dr. Roger Malabanan',
    specialization: 'General Dentist',
    experience: '8 years exp.',
    rating: 4.8,
    reviews: 187,
    img: '../doctor_roger.jpg',
    tags: ['Cleaning', 'Extraction'],
  },
  {
    id: 3,
    name: 'Dr. Joy Bonganay',
    specialization: 'Cosmetic Dentist',
    experience: '10 years exp.',
    rating: 5.0,
    reviews: 302,
    img: '../doctor_joy.jpg',
    tags: ['Whitening', 'Veneers'],
  },
];

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <span className="stars" aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i < full ? '#F9A825' : 'none'}
          stroke={i < full ? '#F9A825' : '#CFD8DC'}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
};

const DoctorCard = ({ doctor }) => (
  <div className="doctor-card">
    <div className="doctor-card__img-wrap">
      <img src={doctor.img} alt={doctor.name} className="doctor-card__img" />
      <div className="doctor-card__rating-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#F9A825" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        {doctor.rating}
      </div>
    </div>

    <div className="doctor-card__body">
      <div className="doctor-card__tags">
        {doctor.tags.map(t => (
          <span key={t} className="doctor-card__tag">{t}</span>
        ))}
      </div>

      <h3 className="doctor-card__name">{doctor.name}</h3>
      <p className="doctor-card__spec">{doctor.specialization}</p>

      <div className="doctor-card__meta">
        <span className="doctor-card__exp">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {doctor.experience}
        </span>
        <span className="doctor-card__reviews">
          <Stars rating={doctor.rating} />
          ({doctor.reviews})
        </span>
      </div>

      <a href="/login" className="doctor-card__btn">Book Appointment</a>
    </div>
  </div>
);

const DoctorsPreview = () => (
  <section className="doctors" id="doctors">
    <div className="doctors__inner">
      <div className="doctors__header">
        <span className="section-tag">Our Team</span>
        <h2 className="section-title">
          Meet Our<br />
          <em>Specialist Doctors</em>
        </h2>
        <p className="section-desc">
          Experienced, compassionate professionals dedicated to giving you
          the best possible dental care in a comfortable environment.
        </p>
      </div>

      <div className="doctors__grid">
        {doctors.map(d => (
          <DoctorCard key={d.id} doctor={d} />
        ))}
      </div>
    </div>
  </section>
);

export default DoctorsPreview;