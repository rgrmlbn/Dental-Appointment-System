import { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { appointmentApi, doctorApi, scheduleApi } from "../../../app/api.js";

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
  <div className={`flex flex-col gap-[5px] ${full ? "col-span-full" : ""}`}>
    <label className="text-[0.79rem] font-semibold tracking-[0.01em] text-[#0B2447]">
      {label}{required && <span className="ml-[2px] text-[#E53935]">*</span>}
    </label>
    {children}
    {error && <span className="text-[0.75rem] font-medium text-[#E53935]">{error}</span>}
  </div>
);

/* ── Success Screen ─────────────────────────────────────────── */
const SuccessScreen = ({ form }) => (
  <div className="flex flex-col items-center pt-4 pb-2 text-center">
    <div className="mb-[1.1rem] text-[#1565C0]"><CheckCircleIcon /></div>
    <h2 className="mb-3 text-2xl font-bold text-[#0B2447]">Appointment Submitted!</h2>
    <p className="mb-[0.6rem] text-[0.9rem] leading-[1.6] text-[#455A64]">
      Your appointment for <strong>{form.service}</strong> on{" "}
      <strong>{form.date}</strong> at <strong>{form.time}</strong> has been received.
    </p>
    <p className="mb-7 text-[0.82rem] leading-[1.5] text-[#607D8B]">We'll confirm your appointment once reviewed.</p>
  </div>
);

/* ── Main Page ──────────────────────────────────────────────── */
export default function AppointmentPage() {
  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { service: "", doctor: "", date: "", time: "", notes: "" },
  });
  const form = useWatch({ control });
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

  const registerField = name => {
    const field = register(name, {
      validate: (value, values) => validate({ ...values, [name]: value })[name] || true,
    });
    return {
      ...field,
      onChange: event => {
        field.onChange(event);
        if (name === "doctor" || name === "date") {
          clearErrors("time");
          setValue("time", "");
        }
        if (submitError) setSubmitError(null);
      },
    };
  };

  const handleBooking = async values => {
    try {
      setLoading(true);
      setSubmitError(null);
      await appointmentApi.book({
        doctorId:  parseInt(values.doctor),
        date:      values.date,
        startTime: convertTo24h(values.time),
        services:  [SERVICE_MAP[values.service]],
        concerns:  values.notes.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
    <div className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-[linear-gradient(155deg,#0B2447_0%,#1565C0_55%,#1E88E5_100%)] px-6 pt-20 pb-12 [font-family:DM_Sans,sans-serif]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_60%,rgba(30,136,229,0.2)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-20 -right-20 h-[340px] w-[340px] rounded-full bg-[rgba(255,255,255,0.04)]" />

      <div className="absolute top-6 left-7 z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.08)] px-[0.9rem] py-[0.45rem] text-[0.85rem] font-medium text-[rgba(255,255,255,0.9)] no-underline backdrop-blur-[8px] transition-[background,border-color] duration-200 hover:border-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.14)]">
          <ArrowLeft /> Back to home
        </Link>
      </div>

      <div className="relative z-[1] w-full max-w-[560px] rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-white px-9 py-10 shadow-[0_24px_80px_rgba(11,36,71,0.25)] max-[500px]:rounded-[18px] max-[500px]:px-5 max-[500px]:py-8">
        <div className="mb-7 flex items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#0B2447_0%,#1565C0_100%)] px-[1.4rem] py-3 shadow-[0_4px_18px_rgba(21,101,192,0.38)]">
          <img src="/logo.png" alt="DentalCare Logo" className="block h-[38px] w-auto object-contain" />
        </div>

        {submitted ? (
          <SuccessScreen form={form} />
        ) : (
          <>
            <div className="mb-5">
              <h1 className="m-0 mb-[0.35rem] text-[1.75rem] leading-[1.15] font-bold tracking-[-0.02em] text-[#0B2447] max-[500px]:text-[1.45rem]">Book an Appointment</h1>
              <p className="m-0 text-[0.88rem] font-light text-[#607D8B]">Fill in the details below to schedule your visit</p>
            </div>

            <div className="mb-6 flex items-start gap-[0.6rem] rounded-[10px] border-[1.5px] border-[rgba(21,101,192,0.18)] bg-[rgba(227,242,253,0.55)] px-4 py-[0.8rem] text-[0.82rem] leading-[1.5] font-normal text-[#1565C0]">
              <span className="mt-px flex shrink-0 text-[#1565C0]"><InfoIcon /></span>
              <span>Appointments are subject to doctor availability. You will receive a confirmation once reviewed.</span>
            </div>

            {submitError && (
              <div className="mb-3 rounded-lg border border-[#ffa39e] bg-[#fff1f0] px-[14px] py-[10px] text-[0.84rem] text-[#cf1322]">{submitError}</div>
            )}

            <form onSubmit={handleFormSubmit(handleBooking)} noValidate>
            {/* Section: Service */}
            <div className="mb-6">
              <div className="mb-[0.85rem] border-b-[1.5px] border-[rgba(21,101,192,0.12)] pb-[0.45rem] text-[0.73rem] font-bold tracking-[0.07em] text-[#0B2447] uppercase">Service Details</div>
              <div className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1">

                <Field label="Service Type" required error={errors.service?.message}>
                  <select
                    {...registerField("service")}
                    aria-invalid={Boolean(errors.service)}
                    className={`box-border w-full cursor-pointer appearance-none rounded-[9px] border-[1.5px] border-[rgba(21,101,192,0.18)] bg-[rgba(227,242,253,0.3)] bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231565C0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")] bg-[position:right_0.8rem_center] bg-no-repeat px-4 py-[0.7rem] pr-[2.4rem] text-[0.9rem] text-[#0B2447] outline-none transition-[border-color,box-shadow,background-color] duration-200 [font-family:inherit] focus:border-[#1565C0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.11)] ${errors.service ? "border-[#E53935] bg-[rgba(229,57,53,0.04)]" : ""}`}
                  >
                    <option value="">Select a service</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>

                <Field label="Doctor" required error={errors.doctor?.message || doctorsError}>
                  <select
                    {...registerField("doctor")}
                    aria-invalid={Boolean(errors.doctor || doctorsError)}
                    className={`box-border w-full cursor-pointer appearance-none rounded-[9px] border-[1.5px] border-[rgba(21,101,192,0.18)] bg-[rgba(227,242,253,0.3)] bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231565C0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")] bg-[position:right_0.8rem_center] bg-no-repeat px-4 py-[0.7rem] pr-[2.4rem] text-[0.9rem] text-[#0B2447] outline-none transition-[border-color,box-shadow,background-color] duration-200 [font-family:inherit] focus:border-[#1565C0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.11)] disabled:cursor-not-allowed disabled:opacity-60 ${errors.doctor || doctorsError ? "border-[#E53935] bg-[rgba(229,57,53,0.04)]" : ""}`}
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
                  error={errors.date?.message}
                >
                  <input
                    type="date"
                    min={today}
                    {...registerField("date")}
                    aria-invalid={Boolean(errors.date || doctorUnavailable)}
                    className={`box-border w-full appearance-none rounded-[9px] border-[1.5px] border-[rgba(21,101,192,0.18)] bg-[rgba(227,242,253,0.3)] px-4 py-[0.7rem] text-[0.9rem] text-[#0B2447] outline-none transition-[border-color,box-shadow,background-color] duration-200 [font-family:inherit] focus:border-[#1565C0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.11)] ${errors.date || doctorUnavailable ? "border-[#E53935] bg-[rgba(229,57,53,0.04)]" : ""}`}
                  />
                  {doctorUnavailable && (
                    <div className="flex items-center gap-1.5 text-[0.8rem] text-[#E53935]">
                      <InfoIcon />
                      <span>This doctor is not available. Choose a different date.</span>
                    </div>
                  )}
                  {slotsState.loading && (
                    <div className="flex items-center gap-2 text-[0.8rem] text-[#607D8B]">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#1565C0] border-t-transparent" /> Checking availability…
                    </div>
                  )}
                  {slotsState.error && (
                    <div className="flex items-center gap-1.5 text-[0.8rem] text-[#E53935]"><InfoIcon /><span>{slotsState.error}</span></div>
                  )}
                </Field>

                <Field label="Preferred Time" required error={errors.time?.message}>
                  <select
                    {...registerField("time")}
                    aria-invalid={Boolean(errors.time)}
                    className={`box-border w-full cursor-pointer appearance-none rounded-[9px] border-[1.5px] border-[rgba(21,101,192,0.18)] bg-[rgba(227,242,253,0.3)] bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231565C0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")] bg-[position:right_0.8rem_center] bg-no-repeat px-4 py-[0.7rem] pr-[2.4rem] text-[0.9rem] text-[#0B2447] outline-none transition-[border-color,box-shadow,background-color] duration-200 [font-family:inherit] focus:border-[#1565C0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.11)] disabled:cursor-not-allowed disabled:opacity-60 ${errors.time ? "border-[#E53935] bg-[rgba(229,57,53,0.04)]" : ""}`}
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
            <div className="mb-6">
              <div className="mb-[0.85rem] border-b-[1.5px] border-[rgba(21,101,192,0.12)] pb-[0.45rem] text-[0.73rem] font-bold tracking-[0.07em] text-[#0B2447] uppercase">Concerns</div>
              <div className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1">
                <Field label="Notes / Concerns" required error={errors.notes?.message} full>
                  <textarea
                    placeholder="Describe your concern or any relevant dental history... (minimum 20 characters)"
                    {...registerField("notes")}
                    aria-invalid={Boolean(errors.notes)}
                    className={`box-border min-h-20 w-full resize-y rounded-[9px] border-[1.5px] border-[rgba(21,101,192,0.18)] bg-[rgba(227,242,253,0.3)] px-4 py-[0.7rem] text-[0.9rem] leading-[1.5] text-[#0B2447] outline-none transition-[border-color,box-shadow,background-color] duration-200 [font-family:inherit] focus:border-[#1565C0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.11)] ${errors.notes ? "border-[#E53935] bg-[rgba(229,57,53,0.04)]" : ""}`}
                    rows={4}
                  />
                  <span className={`self-end text-xs text-[#607D8B] ${form.notes.length > 2000 ? "font-semibold text-[#E53935]" : ""}`}>
                    {form.notes.length} / 2000
                  </span>
                </Field>
              </div>
            </div>

            <button
              type="button"
              type="submit"
              className="mt-2 w-full cursor-pointer rounded-[10px] border-0 bg-[linear-gradient(135deg,#0B2447_0%,#1565C0_100%)] p-[0.85rem] text-[0.97rem] font-semibold tracking-[0.01em] text-white shadow-[0_4px_18px_rgba(21,101,192,0.38)] transition-[transform,box-shadow] duration-200 [font-family:inherit] hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(21,101,192,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading || doctorsLoading || slotsState.loading || doctorUnavailable}
            >
              {loading ? "Submitting..." : "Confirm Appointment"}
            </button>
            </form>

            <p className="mt-[1.1rem] text-center text-[0.86rem] text-[#607D8B]">
              Already booked?{" "}
              <Link to="/" className="font-semibold text-[#1565C0] no-underline hover:underline">Back to home</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}