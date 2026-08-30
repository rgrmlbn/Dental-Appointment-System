import { useEffect, useState } from 'react';
import { doctorApi } from '../../../app/api'; // adjust path to your api.js location
import './DoctorsPreview.css';

/* ── Helper: build a readable name from the nested user object ─── */
// Falls back gracefully if firstName/lastName aren't populated
const getDoctorName = (doctor) => {
  const user = doctor.user;
  if (!user) return 'Unknown Doctor';
  const first = user.firstName || '';
  const last = user.lastName || '';
  const full = `${first} ${last}`.trim();
  return full ? `Dr. ${full}` : (user.email || 'Unknown Doctor');
};


/* ── Helper: pick avatar image based on doctor's gender ─── */
// Handles "MALE"/"FEMALE", lowercase, or shorthand "M"/"F".
// Defaults to male image if gender is missing/unrecognized.
const getDoctorImage = (doctor) => {
  const gender = doctor.user?.gender; // adjust path if gender lives elsewhere
  if (!gender) return '../doctor_male.png';

  const normalized = String(gender).trim().toUpperCase();
  const isFemale = normalized === 'FEMALE' || normalized === 'F';

  return isFemale ? '../doctor_female.png' : '../doctor_male.png';
};

/* ── Helper: turn the specializations Set/array into a readable string ─── */
// e.g. ["ORTHODONTIST"] -> "Orthodontist"
const formatSpecialization = (spec) =>
  spec.charAt(0).toUpperCase() + spec.slice(1).toLowerCase().replace(/_/g, ' ');

const getPrimarySpecialization = (doctor) => {
  const specs = doctor.specializations;
  if (!specs || specs.length === 0) return 'General Dentist';
  return formatSpecialization(specs[0]); // show the first one as the headline
};

/* ── Star rating display — only renders if a rating is actually provided ─── */
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

const DoctorCard = ({ doctor }) => {
  const name = getDoctorName(doctor);
  const specialization = getPrimarySpecialization(doctor);
  const tags = (doctor.specializations || []).map(formatSpecialization);

  return (
    <div className="doctor-card">
      <div className="doctor-card__img-wrap">
        <img
          src={getDoctorImage(doctor)}
          alt={getDoctorName(doctor)}
          className="doctor-card__img"
        />
        {doctor.rating != null && (
          <div className="doctor-card__rating-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#F9A825" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {doctor.rating}
          </div>
        )}
      </div>

      <div className="doctor-card__body">
        {tags.length > 0 && (
          <div className="doctor-card__tags">
            {tags.map(t => (
              <span key={t} className="doctor-card__tag">{t}</span>
            ))}
          </div>
        )}

        <h3 className="doctor-card__name">{name}</h3>
        <p className="doctor-card__spec">{specialization}</p>

        {/* Bio replaces the old "experience" line since that field doesn't exist yet */}
        {doctor.bio && (
          <p className="doctor-card__bio">{doctor.bio}</p>
        )}

        <a href="/login" className="doctor-card__btn">Book Appointment</a>
      </div>
    </div>
  );
};

const DoctorsPreview = () => {
  const [doctors, setDoctors] = useState([]); // holds the fetched doctor list
  const [loading, setLoading] = useState(true); // tracks fetch-in-progress state
  const [error, setError] = useState(null); // holds any fetch error message

  useEffect(() => {
    let isMounted = true; // guards against setting state after unmount

    const fetchDoctors = async () => {
      try {
        // doctorApi.getAll() already resolves to response.data
        // thanks to the response interceptor in api.js
        const data = await doctorApi.getAll();
        if (isMounted) {
          setDoctors(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load doctors right now. Please try again later.');
          console.error('Failed to fetch doctors:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDoctors();

    return () => {
      isMounted = false; // cleanup flag on unmount
    };
  }, []);

  return (
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

        {loading && <p className="doctors__status">Loading doctors...</p>}
        {error && <p className="doctors__status doctors__status--error">{error}</p>}
        {!loading && !error && doctors.length === 0 && (
          <p className="doctors__status">No doctors available at the moment.</p>
        )}

        {!loading && !error && doctors.length > 0 && (
          <div className="doctors__grid">
            {doctors.map(d => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsPreview;