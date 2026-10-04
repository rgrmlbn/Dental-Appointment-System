import { useEffect, useState } from 'react';
import { doctorApi } from '../../../app/api'; // adjust path to your api.js location

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
// const Stars = ({ rating }) => {
//   const full = Math.floor(rating);
//   return (
//     <span className="inline-flex items-center gap-px" aria-label={`${rating} stars`}>
//       {Array.from({ length: 5 }, (_, i) => (
//         <svg key={i} width="14" height="14" viewBox="0 0 24 24"
//           fill={i < full ? '#F9A825' : 'none'}
//           stroke={i < full ? '#F9A825' : '#CFD8DC'}
//           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//         </svg>
//       ))}
//     </span>
//   );
// };

const DoctorCard = ({ doctor }) => {
  const name = getDoctorName(doctor);
  const specialization = getPrimarySpecialization(doctor);
  const tags = (doctor.specializations || []).map(formatSpecialization);

  return (
    <div className="group overflow-hidden rounded-[22px] border border-border bg-white transition-[transform,box-shadow] duration-200 hover:-translate-y-[5px] hover:shadow-[0_8px_32px_rgba(11,36,71,0.12)]">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-light-gray p-4 pb-0">
        <img
          src={getDoctorImage(doctor)}
          alt={getDoctorName(doctor)}
          className="block h-full w-full object-contain object-center transition-transform duration-[350ms] group-hover:scale-[1.04]"
        />
        {doctor.rating != null && (
          <div className="absolute right-[0.7rem] top-[0.7rem] flex items-center gap-[0.3rem] rounded-full bg-[rgba(255,255,255,0.95)] px-[0.6rem] py-1 text-[0.75rem] font-bold text-navy shadow-[0_2px_8px_rgba(0,0,0,0.12)] backdrop-blur-[8px]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#F9A825" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {doctor.rating}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[0.2rem] p-4 px-[1.1rem] pb-[1.1rem]">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-[0.35rem]">
            {tags.map(t => (
              <span key={t} className="rounded-full bg-ice px-[0.55rem] py-[0.18rem] text-[0.7rem] font-semibold uppercase tracking-[0.04em] text-blue">{t}</span>
            ))}
          </div>
        )}

        <h3 className="mt-[0.1rem] font-[family-name:var(--font-display)] text-[1.15rem] font-semibold leading-[1.2] text-navy">{name}</h3>
        <p className="text-[0.84rem] font-normal text-text-light">{specialization}</p>

        {/* Bio replaces the old "experience" line since that field doesn't exist yet */}
        {doctor.bio && (
          <p>{doctor.bio}</p>
        )}

        <a href="/login" className="mt-2 block rounded-[14px] bg-[linear-gradient(135deg,#0b2447_0%,#1565c0_100%)] p-[0.6rem] text-center text-[0.85rem] font-semibold text-white no-underline shadow-[0_4px_18px_rgba(21,101,192,0.38)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(21,101,192,0.45)]">
          Book Appointment
        </a>
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
    <section className="bg-white px-8 py-16 max-[580px]:px-6" id="doctors">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto mb-8 max-w-[520px] text-center">
          <span className="mb-4 inline-block rounded-full bg-ice px-[0.9rem] py-[0.35rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-blue">Our Team</span>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-[clamp(2rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.02em] text-navy">
            Meet Our<br />
            <em className="font-light italic text-blue">Specialist Doctors</em>
          </h2>
          <p className="text-base font-light leading-[1.7] text-text-light">
            Experienced, compassionate professionals dedicated to giving you
            the best possible dental care in a comfortable environment.
          </p>
        </div>

        {loading && <p>Loading doctors...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && doctors.length === 0 && (
          <p>No doctors available at the moment.</p>
        )}

        {!loading && !error && doctors.length > 0 && (
          <div className="mx-auto grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-[580px]:max-w-[380px] max-[580px]:grid-cols-1">
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