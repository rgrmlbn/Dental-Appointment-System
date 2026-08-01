import { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { appointmentApi, doctorApi, scheduleApi } from "../../../app/api.js";
import "./AppointmentPage.css";

/* ── Icons ──────────────────────────────────────────────────── */
const ArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/* ── Constants ──────────────────────────────────────────────── */
const SERVICE_MAP = {
  "General Checkup":      "GENERAL_CHECKUP",
  "Dental Cleaning":      "DENTAL_CLEANING",
  "Tooth Extraction":     "TOOTH_EXTRACTION",
  "Braces Consultation":  "BRACES_CONSULTATION",
  "Root Canal Treatment": "ROOT_CANAL_TREATMENT",
  "Teeth Whitening":      "TEETH_WHITENING",
  "Dental Filling":       "DENTAL_FILLING",
  "X-Ray":                "XRAY",
};

const SERVICES = Object.keys(SERVICE_MAP);

/* ── Helpers ────────────────────────────────────────────────── */
const convertTo24h = (time12) => {
  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier === "AM" && hours === "12") hours = "00";
  if (modifier === "PM" && hours !== "12") hours = String(+hours + 12);
  return `${hours.padStart(2, "0")}:${minutes}:00`;
};

const getDoctorLabel = (doctor) => {
  const firstName = doctor.user?.firstName ?? doctor.firstName ?? "";
  const lastName  = doctor.user?.lastName  ?? doctor.lastName  ?? "";
  const fullName  = `${firstName} ${lastName}`.trim();
  return fullName ? `Dr. ${fullName}` : `Doctor #${doctor.id}`;
};

const formatSlotTime = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 || 12;
  return `${display}:${m} ${ampm}`;
};

/* ── Validation ─────────────────────────────────────────────── */
const validate = (form) => {
  const e = {};
  if (!form.service)
    e.service = "Please select a service";
  if (!form.doctor)
    e.doctor = "Please select a doctor";
  if (!form.date)
    e.date = "Please select a date";
  else if (new Date(form.date) <= new Date(new Date().toDateString()))
    e.date = "Date must be in the future";
  if (!form.time)
    e.time = "Please select a time";
  if (!form.notes?.trim() || form.notes.trim().length < 20)
    e.notes = "Concerns must be at least 20 characters";
  else if (form.notes.trim().length > 2000)
    e.notes = "Concerns must not exceed 2000 characters";
  return e;
};

/* ── Slots Reducer ──────────────────────────────────────────── */
const slotsReducer = (state, action) => {
  switch (action.type) {
    case "LOADING": return { slots: null,         loading: true,  error: null };
    case "SUCCESS": return { slots: action.slots, loading: false, error: null };
    case "ERROR":   return { slots: null,         loading: false, error: action.error };
    case "RESET":   return { slots: null,         loading: false, error: null };
    default:        return state;
  }
};

/* ── Reusable Field ─────────────────────────────────────────── */
const Field = ({ label, required, error, children, full }) => (
  <div className={`appt-field ${full ? "appt-field--full" : ""}`}>
    <label className="appt-field__label">
      {label}{required && <span className="appt-field__required">*</span>}
    </label>
    {children}
    {error && <span className="appt-field__error">{error}</span>}
  </div>
);

/* ── Success Screen ─────────────────────────────────────────── */
const SuccessScreen = ({ form, onReset }) => (
  <div className="appt-success">
    <div className="appt-success__icon"><CheckCircleIcon /></div>
    <h2 className="appt-success__title">Appointment Submitted!</h2>
    <p className="appt-success__desc">
      Your appointment for <strong>{form.service}</strong> on{" "}
      <strong>{form.date}</strong> at <strong>{form.time}</strong> has been received.
    </p>
    <p className="appt-success__note">We'll confirm your appointment once reviewed.</p>
    <div className="appt-success__actions">
      <button onClick={onReset} className="appt-card__submit">Book Another</button>
    </div>
  </div>
);

/* ── Main Page ──────────────────────────────────────────────── */
export default function AppointmentPage() {
  const [form, setForm] = useState({
    service: "",
    doctor:  "",
    date:    "",
    time:    "",
    notes:   "",
  });
  const [errors,      setErrors]      = useState({});
  const [submitted,   setSubmitted]   = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ── Doctor list ────────────────────────────────────────────
  const [doctors,        setDoctors]        = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError,   setDoctorsError]   = useState(null);

  // ── Available slots for selected doctor + date ─────────────
  const [slotsState, dispatchSlots] = useReducer(slotsReducer, {
    slots: null, loading: false, error: null,
  });

  useEffect(() => {
    doctorApi
      .getAll()
      .then((data) => setDoctors(Array.isArray(data) ? data : []))
      .catch((err) => setDoctorsError(err.message || "Failed to load doctors"))
      .finally(() => setDoctorsLoading(false));
  }, []);

  useEffect(() => {
    if (!form.doctor || !form.date) {
      dispatchSlots({ type: "RESET" });
      return;
    }

    let cancelled = false;
    dispatchSlots({ type: "LOADING" });

    scheduleApi
      .getSlots(form.doctor, form.date)
      .then(data => { if (!cancelled) dispatchSlots({ type: "SUCCESS", slots: Array.isArray(data) ? data : [] }); })
      .catch(err  => { if (!cancelled) dispatchSlots({ type: "ERROR",   error: err.message || "Failed to check availability" }); });

    return () => { cancelled = true; };
  }, [form.doctor, form.date]);

  const onChange = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (key === "doctor" || key === "date") next.time = "";
      return next;
    });
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setLoading(true);
      setSubmitError(null);
      await appointmentApi.book({
        doctorId:  parseInt(form.doctor),
        date:      form.date,
        startTime: convertTo24h(form.time),
        services:  [SERVICE_MAP[form.service]],
        concerns:  form.notes.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ service: "", doctor: "", date: "", time: "", notes: "" });
    setErrors({});
    setSubmitted(false);
    setSubmitError(null);
    dispatchSlots({ type: "RESET" });
  };

  const today = new Date().toISOString().split("T")[0];

  const doctorUnavailable = slotsState.slots !== null && slotsState.slots.length === 0;

  const availableTimeSet = new Set(
    (slotsState.slots ?? []).map(s => formatSlotTime(s.startTime))
  );

  const ALL_SLOTS = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "1:00 PM", "2:00 PM", "3:00 PM",  "4:00 PM",
  ];

  return (
    <div className="appt-page">
      <div className="appt-page__glow-1" />
      <div className="appt-page__glow-2" />

      <div className="appt-page__back">
        <Link to="/dashboard" className="appt-page__back-link">
          <ArrowLeft /> Back to home
        </Link>
      </div>

      <div className="appt-card">
        <div className="appt-card__logo">
          <img src="/logo.png" alt="DentalCare Logo" className="appt-card__logo-img" />
        </div>

        {submitted ? (
          <SuccessScreen form={form} onReset={handleReset} />
        ) : (
          <>
            <div className="appt-card__header">
              <h1 className="appt-card__title">Book an Appointment</h1>
              <p className="appt-card__subtitle">Fill in the details below to schedule your visit</p>
            </div>

            <div className="appt-card__info-banner">
              <span className="appt-card__info-icon"><InfoIcon /></span>
              <span>Appointments are subject to doctor availability. You will receive a confirmation once reviewed.</span>
            </div>

            {submitError && (
              <div className="appt-card__error-banner">{submitError}</div>
            )}

            {/* Section: Service */}
            <div className="appt-section">
              <div className="appt-section__title">Service Details</div>
              <div className="appt-grid">

                <Field label="Service Type" required error={errors.service}>
                  <select
                    value={form.service}
                    onChange={e => onChange("service", e.target.value)}
                    className={`appt-input appt-select ${errors.service ? "appt-input--error" : ""}`}
                  >
                    <option value="">Select a service</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>

                <Field label="Doctor" required error={errors.doctor || doctorsError}>
                  <select
                    value={form.doctor}
                    onChange={e => onChange("doctor", e.target.value)}
                    className={`appt-input appt-select ${errors.doctor || doctorsError ? "appt-input--error" : ""}`}
                    disabled={doctorsLoading || !!doctorsError}
                  >
                    <option value="">
                      {doctorsLoading ? "Loading doctors…"
                        : doctorsError ? "Unable to load doctors"
                        : doctors.length === 0 ? "No doctors available"
                        : "Select a doctor"}
                    </option>
                    {!doctorsLoading && !doctorsError && doctors.map(d => (
                      <option key={d.id} value={String(d.id)}>{getDoctorLabel(d)}</option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Preferred Date"
                  required
                  error={errors.date}
                >
                  <input
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={e => onChange("date", e.target.value)}
                    className={`appt-input ${errors.date || doctorUnavailable ? "appt-input--error" : ""}`}
                  />
                  {doctorUnavailable && (
                    <div className="appt-unavailable">
                      <InfoIcon />
                      <span>This doctor is not available. Choose a different date.</span>
                    </div>
                  )}
                  {slotsState.loading && (
                    <div className="appt-slots-checking">
                      <span className="appt-slots-spinner" /> Checking availability…
                    </div>
                  )}
                  {slotsState.error && (
                    <div className="appt-unavailable"><InfoIcon /><span>{slotsState.error}</span></div>
                  )}
                </Field>

                <Field label="Preferred Time" required error={errors.time}>
                  <select
                    value={form.time}
                    onChange={e => onChange("time", e.target.value)}
                    className={`appt-input appt-select ${errors.time ? "appt-input--error" : ""}`}
                    disabled={slotsState.loading || doctorUnavailable}
                  >
                    <option value="">
                      {slotsState.loading ? "Checking availability…"
                        : doctorUnavailable ? "No slots available"
                        : "Select a time slot"}
                    </option>
                    {!slotsState.loading && ALL_SLOTS.map(t => {
                      const isAvailable = slotsState.slots === null || availableTimeSet.has(t);
                      if (!isAvailable) return null;
                      return <option key={t} value={t}>{t}</option>;
                    })}
                  </select>
                </Field>

              </div>
            </div>

            {/* Section: Concerns */}
            <div className="appt-section">
              <div className="appt-section__title">Concerns</div>
              <div className="appt-grid">
                <Field label="Notes / Concerns" required error={errors.notes} full>
                  <textarea
                    placeholder="Describe your concern or any relevant dental history... (minimum 20 characters)"
                    value={form.notes}
                    onChange={e => onChange("notes", e.target.value)}
                    className={`appt-input appt-textarea ${errors.notes ? "appt-input--error" : ""}`}
                    rows={4}
                  />
                  <span className={`appt-field__counter ${form.notes.length > 2000 ? "appt-field__counter--over" : ""}`}>
                    {form.notes.length} / 2000
                  </span>
                </Field>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="appt-card__submit"
              disabled={loading || doctorsLoading || slotsState.loading || doctorUnavailable}
            >
              {loading ? "Submitting..." : "Confirm Appointment"}
            </button>

            <p className="appt-card__footer">
              Already booked?{" "}
              <Link to="/" className="appt-card__footer-link">Back to home</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}