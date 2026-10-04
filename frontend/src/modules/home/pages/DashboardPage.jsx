import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../auth/useAuth.js";
import { appointmentApi, scheduleApi, doctorApi } from "../../../app/api.js";
import AdminSection from "./AdminSection.jsx"; // adjust path


/* ── Icons ──────────────────────────────────────────────────── */
const CalendarIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const SmileIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ArrowRight = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ChevronDown = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const XIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const BanIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const UserGroupIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/* ── Constants ──────────────────────────────────────────────── */
const SERVICE_MAP = {
  GENERAL_CHECKUP: "General Checkup",
  DENTAL_CLEANING: "Dental Cleaning",
  TOOTH_EXTRACTION: "Tooth Extraction",
  BRACES_CONSULTATION: "Braces Consultation",
  ROOT_CANAL_TREATMENT: "Root Canal Treatment",
  TEETH_WHITENING: "Teeth Whitening",
  DENTAL_FILLING: "Dental Filling",
  XRAY: "X-Ray",
};

const SERVICE_ENUM_MAP = Object.fromEntries(
  Object.entries(SERVICE_MAP).map(([k, v]) => [v, k]),
);

const SERVICES_DISPLAY = Object.values(SERVICE_MAP);

const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const STATUS_STYLES = {
  SCHEDULED: { label: "Scheduled", cls: "badge--scheduled [background:#e3f2fd] [color:#1565c0]" },
  COMPLETED: { label: "Completed", cls: "badge--completed [background:#e8f5e9] [color:#2e7d32]" },
  CANCELLED: { label: "Cancelled", cls: "badge--cancelled [background:#ffebee] [color:#c62828]" },
  PENDING: { label: "Pending", cls: "badge--pending [background:#fff8e1] [color:#f57f17]" },
};

/* ── Helpers ────────────────────────────────────────────────── */
const convertTo24h = (time12) => {
  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier === "AM" && hours === "12") hours = "00";
  if (modifier === "PM" && hours !== "12") hours = String(+hours + 12);
  return `${hours.padStart(2, "0")}:${minutes}:00`;
};

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 || 12;
  return `${display}:${m} ${ampm}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getServiceLabel = (services) => {
  if (!services || services.length === 0) return "—";
  return services.map((s) => SERVICE_MAP[s] ?? s).join(", ");
};

const today = new Date().toISOString().split("T")[0];

/* ── Tip cards data ─────────────────────────────────────────── */
const TIPS = [
  {
    icon: <ClockIcon />,
    title: "Every 6 months",
    desc: "Schedule a routine checkup to keep your teeth in top shape.",
  },
  {
    icon: <ShieldIcon />,
    title: "Early detection",
    desc: "Catching issues early prevents costly and painful treatments later.",
  },
  {
    icon: <SmileIcon />,
    title: "Healthy smile",
    desc: "Good oral health is linked to overall wellness and confidence.",
  },
];

/* ── Profile Dropdown ───────────────────────────────────────── */
function ProfileDropdown({ user, initials, onLogout, loggingOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="dash-profile-dropdown [position:relative]" ref={ref}>
      <button
        className={`dash-profile-btn [display:flex] [align-items:center] [gap:0.5rem] [background:transparent] [border:1.5px_solid_rgba(255,_255,_255,_0.35)] [border-radius:50px] [padding:0.35rem_0.75rem_0.35rem_0.4rem] [cursor:pointer] [transition:background_0.2s,_border-color_0.2s] [color:rgba(255,_255,_255,_0.9)] hover:[background:rgba(255,_255,_255,_0.1)] hover:[border-color:rgba(255,_255,_255,_0.6)]${open ? " dash-profile-btn--open [background:rgba(255,_255,_255,_0.1)] [border-color:rgba(255,_255,_255,_0.6)]" : ""}`}
        onClick={() => setOpen((o) => !o)}
        title={`${user.firstName} ${user.lastName}`}
      >
        <span className="dash-nav__avatar [width:36px] [height:36px] [border-radius:50%] [background:rgba(255,_255,_255,_0.18)] [border:1.5px_solid_rgba(255,_255,_255,_0.35)] [color:#fff] [font-size:0.78rem] [font-weight:700] [display:flex] [align-items:center] [justify-content:center] [letter-spacing:0.03em] [cursor:default] [user-select:none]">{initials}</span>
        <span className="dash-profile-btn__name [font-size:0.88rem] [font-weight:500] [color:rgba(255,_255,_255,_0.9)] [max-width:100px] [overflow:hidden] [text-overflow:ellipsis] [white-space:nowrap]">{user.firstName}</span>
        <ChevronDown />
      </button>

      {open && (
        <div className="dash-dropdown-menu [position:absolute] [top:calc(100%_+_10px)] [right:0] [min-width:230px] [background:#fff] [border-radius:14px] [box-shadow:0_12px_40px_rgba(11,_36,_71,_0.18),_0_2px_8px_rgba(0,_0,_0,_0.08)] [border:1px_solid_rgba(11,_36,_71,_0.1)] [overflow:hidden] [z-index:200] animate-dropdown-in">
          <div className="dash-dropdown-menu__header [display:flex] [align-items:center] [gap:0.75rem] [padding:1rem_1rem_0.85rem]">
            <div className="dash-dropdown-menu__avatar [width:38px] [height:38px] [border-radius:50%] [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [color:#fff] [font-size:0.78rem] [font-weight:700] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [letter-spacing:0.03em]">{initials}</div>
            <div>
              <div className="dash-dropdown-menu__fullname [font-size:0.9rem] [font-weight:600] [color:#0b2447] [line-height:1.3]">
                {user.firstName} {user.lastName}
              </div>
              <div className="dash-dropdown-menu__email [font-size:0.75rem] [color:#607d8b] [font-weight:400] [margin-top:1px] [overflow:hidden] [text-overflow:ellipsis] [white-space:nowrap] [max-width:160px]">{user.email}</div>
            </div>
          </div>
          <div className="dash-dropdown-menu__divider [height:1px] [background:rgba(11,_36,_71,_0.08)] [margin:0]" />
          <button
            className="dash-dropdown-menu__item [display:flex] [align-items:center] [gap:0.6rem] [width:100%] [padding:0.75rem_1rem] [background:transparent] [border:none] [cursor:pointer] [font-size:0.88rem] [font-weight:500] [color:#0b2447] [text-align:left] [transition:background_0.15s] hover:[background:rgba(11,_36,_71,_0.05)] disabled:[opacity:0.55] disabled:[cursor:not-allowed]"
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
          >
            <UserIcon /> My Profile
          </button>
          <div className="dash-dropdown-menu__divider [height:1px] [background:rgba(11,_36,_71,_0.08)] [margin:0]" />
          <button
            className="dash-dropdown-menu__item [display:flex] [align-items:center] [gap:0.6rem] [width:100%] [padding:0.75rem_1rem] [background:transparent] [border:none] [cursor:pointer] [font-size:0.88rem] [font-weight:500] [color:#0b2447] [text-align:left] [transition:background_0.15s] hover:[background:rgba(11,_36,_71,_0.05)] disabled:[opacity:0.55] disabled:[cursor:not-allowed] dash-dropdown-menu__item--logout [color:#c62828] hover:[background:rgba(198,_40,_40,_0.06)]"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            disabled={loggingOut}
          >
            <LogoutIcon /> {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Edit Appointment Modal (patient) ───────────────────────── */
function EditModal({ appointment, onClose, onSave }) {
  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      date: appointment.date ?? "",
      time: formatTime(appointment.startTime) ?? "",
      service:
        getServiceLabel(appointment.services) !== "—"
          ? getServiceLabel(appointment.services).split(", ")[0]
          : "",
      concerns: appointment.concerns ?? "",
    },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSave = async (form) => {
    try {
      setSaving(true);
      setError(null);
      const updated = await appointmentApi.update(appointment.id, {
        date: form.date,
        startTime: convertTo24h(form.time),
        services: [SERVICE_ENUM_MAP[form.service] ?? form.service],
        concerns: form.concerns.trim(),
      });
      onSave(updated);
    } catch (err) {
      setError(err.message || "Failed to update appointment.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="dash-modal-overlay [position:fixed] [inset:0] [z-index:1000] [background:rgba(11,_36,_71,_0.45)] [backdrop-filter:blur(5px)] [display:flex] [align-items:center] [justify-content:center] [padding:1rem]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dash-modal [background:#fff] [border:1px_solid_#e3eaf5] [border-radius:20px] [width:100%] [max-width:480px] [box-shadow:0_24px_80px_rgba(11,_36,_71,_0.22)] [overflow:hidden] animate-slide-up">
        <div className="dash-modal__header [display:flex] [align-items:center] [justify-content:space-between] [padding:1.4rem_1.6rem_1.1rem] [border-bottom:1px_solid_#f0f4f8] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <h3 className="dash-modal__title [font-size:1rem] [font-weight:700] [color:#0b2447] [margin:0] [letter-spacing:-0.015em]">Edit Appointment</h3>
          <button className="dash-modal__close [display:flex] [align-items:center] [justify-content:center] [width:30px] [height:30px] [border-radius:8px] [background:#f1f5f9] [border:none] [color:#607d8b] [cursor:pointer] [transition:background_0.15s,_color_0.15s] hover:[background:#e3eaf5] hover:[color:#0b2447]" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        {error && <div className="dash-modal__error [margin:0_1.6rem] [padding:0.7rem_1rem] [background:#ffebee] [border:1px_solid_#ffcdd2] [border-radius:10px] [font-size:0.83rem] [color:#c62828] max-[640px]:[margin-left:1.25rem] max-[640px]:[margin-right:1.25rem]">{error}</div>}
        <form onSubmit={handleSubmit(handleSave)} noValidate>
        <div className="dash-modal__body [padding:1.4rem_1.6rem] [display:flex] [flex-direction:column] [gap:1.1rem] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <div className="dash-modal__field [display:flex] [flex-direction:column] [gap:0.45rem] [&_label]:[font-size:0.75rem] [&_label]:[font-weight:700] [&_label]:[color:#607d8b] [&_label]:[text-transform:uppercase] [&_label]:[letter-spacing:0.06em] [&_input]:[background:#f8fafc] [&_input]:[border:1.5px_solid_#e3eaf5] [&_input]:[border-radius:10px] [&_input]:[padding:0.65rem_0.9rem] [&_input]:[color:#0b2447] [&_input]:[font-size:0.9rem] [&_input]:[font-family:DM_Sans,_sans-serif] [&_input]:[outline:none] [&_input]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_input]:[width:100%] [&_input]:[box-sizing:border-box] [&_select]:[background:#f8fafc] [&_select]:[border:1.5px_solid_#e3eaf5] [&_select]:[border-radius:10px] [&_select]:[padding:0.65rem_0.9rem] [&_select]:[color:#0b2447] [&_select]:[font-size:0.9rem] [&_select]:[font-family:DM_Sans,_sans-serif] [&_select]:[outline:none] [&_select]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_select]:[width:100%] [&_select]:[box-sizing:border-box] [&_textarea]:[background:#f8fafc] [&_textarea]:[border:1.5px_solid_#e3eaf5] [&_textarea]:[border-radius:10px] [&_textarea]:[padding:0.65rem_0.9rem] [&_textarea]:[color:#0b2447] [&_textarea]:[font-size:0.9rem] [&_textarea]:[font-family:DM_Sans,_sans-serif] [&_textarea]:[outline:none] [&_textarea]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_textarea]:[width:100%] [&_textarea]:[box-sizing:border-box] [&_input:focus]:[border-color:#1565c0] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_input:focus]:[background:#fff] [&_select:focus]:[border-color:#1565c0] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_select:focus]:[background:#fff] [&_textarea:focus]:[border-color:#1565c0] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_textarea:focus]:[background:#fff] [&_option]:[background:#fff] [&_option]:[color:#0b2447] [&_textarea]:[resize:vertical] [&_textarea]:[min-height:80px]">
            <label>Service</label>
            <select
              {...register("service", { required: "Please select a service." })}
              aria-invalid={Boolean(fieldErrors.service)}
            >
              <option value="">Select a service</option>
              {SERVICES_DISPLAY.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {fieldErrors.service && <span className="text-[0.75rem] text-[#c62828]">{fieldErrors.service.message}</span>}
          </div>
          <div className="dash-modal__field [display:flex] [flex-direction:column] [gap:0.45rem] [&_label]:[font-size:0.75rem] [&_label]:[font-weight:700] [&_label]:[color:#607d8b] [&_label]:[text-transform:uppercase] [&_label]:[letter-spacing:0.06em] [&_input]:[background:#f8fafc] [&_input]:[border:1.5px_solid_#e3eaf5] [&_input]:[border-radius:10px] [&_input]:[padding:0.65rem_0.9rem] [&_input]:[color:#0b2447] [&_input]:[font-size:0.9rem] [&_input]:[font-family:DM_Sans,_sans-serif] [&_input]:[outline:none] [&_input]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_input]:[width:100%] [&_input]:[box-sizing:border-box] [&_select]:[background:#f8fafc] [&_select]:[border:1.5px_solid_#e3eaf5] [&_select]:[border-radius:10px] [&_select]:[padding:0.65rem_0.9rem] [&_select]:[color:#0b2447] [&_select]:[font-size:0.9rem] [&_select]:[font-family:DM_Sans,_sans-serif] [&_select]:[outline:none] [&_select]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_select]:[width:100%] [&_select]:[box-sizing:border-box] [&_textarea]:[background:#f8fafc] [&_textarea]:[border:1.5px_solid_#e3eaf5] [&_textarea]:[border-radius:10px] [&_textarea]:[padding:0.65rem_0.9rem] [&_textarea]:[color:#0b2447] [&_textarea]:[font-size:0.9rem] [&_textarea]:[font-family:DM_Sans,_sans-serif] [&_textarea]:[outline:none] [&_textarea]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_textarea]:[width:100%] [&_textarea]:[box-sizing:border-box] [&_input:focus]:[border-color:#1565c0] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_input:focus]:[background:#fff] [&_select:focus]:[border-color:#1565c0] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_select:focus]:[background:#fff] [&_textarea:focus]:[border-color:#1565c0] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_textarea:focus]:[background:#fff] [&_option]:[background:#fff] [&_option]:[color:#0b2447] [&_textarea]:[resize:vertical] [&_textarea]:[min-height:80px]">
            <label>Date</label>
            <input
              type="date"
              min={today}
              {...register("date", { required: "Please select a date." })}
              aria-invalid={Boolean(fieldErrors.date)}
            />
            {fieldErrors.date && <span className="text-[0.75rem] text-[#c62828]">{fieldErrors.date.message}</span>}
          </div>
          <div className="dash-modal__field [display:flex] [flex-direction:column] [gap:0.45rem] [&_label]:[font-size:0.75rem] [&_label]:[font-weight:700] [&_label]:[color:#607d8b] [&_label]:[text-transform:uppercase] [&_label]:[letter-spacing:0.06em] [&_input]:[background:#f8fafc] [&_input]:[border:1.5px_solid_#e3eaf5] [&_input]:[border-radius:10px] [&_input]:[padding:0.65rem_0.9rem] [&_input]:[color:#0b2447] [&_input]:[font-size:0.9rem] [&_input]:[font-family:DM_Sans,_sans-serif] [&_input]:[outline:none] [&_input]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_input]:[width:100%] [&_input]:[box-sizing:border-box] [&_select]:[background:#f8fafc] [&_select]:[border:1.5px_solid_#e3eaf5] [&_select]:[border-radius:10px] [&_select]:[padding:0.65rem_0.9rem] [&_select]:[color:#0b2447] [&_select]:[font-size:0.9rem] [&_select]:[font-family:DM_Sans,_sans-serif] [&_select]:[outline:none] [&_select]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_select]:[width:100%] [&_select]:[box-sizing:border-box] [&_textarea]:[background:#f8fafc] [&_textarea]:[border:1.5px_solid_#e3eaf5] [&_textarea]:[border-radius:10px] [&_textarea]:[padding:0.65rem_0.9rem] [&_textarea]:[color:#0b2447] [&_textarea]:[font-size:0.9rem] [&_textarea]:[font-family:DM_Sans,_sans-serif] [&_textarea]:[outline:none] [&_textarea]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_textarea]:[width:100%] [&_textarea]:[box-sizing:border-box] [&_input:focus]:[border-color:#1565c0] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_input:focus]:[background:#fff] [&_select:focus]:[border-color:#1565c0] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_select:focus]:[background:#fff] [&_textarea:focus]:[border-color:#1565c0] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_textarea:focus]:[background:#fff] [&_option]:[background:#fff] [&_option]:[color:#0b2447] [&_textarea]:[resize:vertical] [&_textarea]:[min-height:80px]">
            <label>Time</label>
            <select
              {...register("time", { required: "Please select a time." })}
              aria-invalid={Boolean(fieldErrors.time)}
            >
              <option value="">Select a time</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {fieldErrors.time && <span className="text-[0.75rem] text-[#c62828]">{fieldErrors.time.message}</span>}
          </div>
          <div className="dash-modal__field [display:flex] [flex-direction:column] [gap:0.45rem] [&_label]:[font-size:0.75rem] [&_label]:[font-weight:700] [&_label]:[color:#607d8b] [&_label]:[text-transform:uppercase] [&_label]:[letter-spacing:0.06em] [&_input]:[background:#f8fafc] [&_input]:[border:1.5px_solid_#e3eaf5] [&_input]:[border-radius:10px] [&_input]:[padding:0.65rem_0.9rem] [&_input]:[color:#0b2447] [&_input]:[font-size:0.9rem] [&_input]:[font-family:DM_Sans,_sans-serif] [&_input]:[outline:none] [&_input]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_input]:[width:100%] [&_input]:[box-sizing:border-box] [&_select]:[background:#f8fafc] [&_select]:[border:1.5px_solid_#e3eaf5] [&_select]:[border-radius:10px] [&_select]:[padding:0.65rem_0.9rem] [&_select]:[color:#0b2447] [&_select]:[font-size:0.9rem] [&_select]:[font-family:DM_Sans,_sans-serif] [&_select]:[outline:none] [&_select]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_select]:[width:100%] [&_select]:[box-sizing:border-box] [&_textarea]:[background:#f8fafc] [&_textarea]:[border:1.5px_solid_#e3eaf5] [&_textarea]:[border-radius:10px] [&_textarea]:[padding:0.65rem_0.9rem] [&_textarea]:[color:#0b2447] [&_textarea]:[font-size:0.9rem] [&_textarea]:[font-family:DM_Sans,_sans-serif] [&_textarea]:[outline:none] [&_textarea]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_textarea]:[width:100%] [&_textarea]:[box-sizing:border-box] [&_input:focus]:[border-color:#1565c0] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_input:focus]:[background:#fff] [&_select:focus]:[border-color:#1565c0] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_select:focus]:[background:#fff] [&_textarea:focus]:[border-color:#1565c0] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_textarea:focus]:[background:#fff] [&_option]:[background:#fff] [&_option]:[color:#0b2447] [&_textarea]:[resize:vertical] [&_textarea]:[min-height:80px] dash-modal__field--full">
            <label>Concerns</label>
            <textarea
              rows={3}
              {...register("concerns")}
              placeholder="Describe your concern…"
            />
          </div>
        </div>
        <div className="dash-modal__footer [display:flex] [justify-content:flex-end] [gap:0.65rem] [padding:1rem_1.6rem_1.4rem] [border-top:1px_solid_#f0f4f8] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <button
            type="button"
            className="dash-modal__btn [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.85rem] [font-weight:600] [padding:0.6rem_1.25rem] [border-radius:10px] [border:none] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:transform_0.1s,_box-shadow_0.15s,_background_0.15s] disabled:[opacity:0.5] disabled:[cursor:not-allowed] disabled:[transform:none_!important] dash-modal__btn--cancel [background:#f1f5f9] [color:#455a64] [border:1.5px_solid_#e3eaf5] [&:hover:not(:disabled)]:[background:#e3eaf5]"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="dash-modal__btn [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.85rem] [font-weight:600] [padding:0.6rem_1.25rem] [border-radius:10px] [border:none] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:transform_0.1s,_box-shadow_0.15s,_background_0.15s] disabled:[opacity:0.5] disabled:[cursor:not-allowed] disabled:[transform:none_!important] dash-modal__btn--save [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [color:#fff] [box-shadow:0_4px_14px_rgba(21,_101,_192,_0.35)] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[box-shadow:0_6px_20px_rgba(21,_101,_192,_0.45)]"
            type="submit"
            disabled={saving}
          >
            <CheckIcon /> {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

/* ── Cancel Confirm Modal (patient) ─────────────────────────── */
function CancelModal({ appointment, onClose, onConfirm }) {
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    try {
      setCancelling(true);
      setError(null);
      await appointmentApi.cancel(appointment.id);
      onConfirm(appointment.id);
    } catch (err) {
      setError(err.message || "Failed to cancel appointment.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div
      className="dash-modal-overlay [position:fixed] [inset:0] [z-index:1000] [background:rgba(11,_36,_71,_0.45)] [backdrop-filter:blur(5px)] [display:flex] [align-items:center] [justify-content:center] [padding:1rem]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dash-modal [background:#fff] [border:1px_solid_#e3eaf5] [border-radius:20px] [width:100%] [max-width:480px] [box-shadow:0_24px_80px_rgba(11,_36,_71,_0.22)] [overflow:hidden] dash-modal--sm [max-width:380px] animate-slide-up">
        <div className="dash-modal__header [display:flex] [align-items:center] [justify-content:space-between] [padding:1.4rem_1.6rem_1.1rem] [border-bottom:1px_solid_#f0f4f8] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <h3 className="dash-modal__title [font-size:1rem] [font-weight:700] [color:#0b2447] [margin:0] [letter-spacing:-0.015em]">Cancel Appointment</h3>
          <button className="dash-modal__close [display:flex] [align-items:center] [justify-content:center] [width:30px] [height:30px] [border-radius:8px] [background:#f1f5f9] [border:none] [color:#607d8b] [cursor:pointer] [transition:background_0.15s,_color_0.15s] hover:[background:#e3eaf5] hover:[color:#0b2447]" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        <div className="dash-modal__body [padding:1.4rem_1.6rem] [display:flex] [flex-direction:column] [gap:1.1rem] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <p className="dash-modal__confirm-text [font-size:0.92rem] [color:#37474f] [line-height:1.6] [margin:0] [&_strong]:[color:#0b2447]">
            Are you sure you want to cancel your{" "}
            <strong>{getServiceLabel(appointment.services)}</strong> appointment
            on <strong>{formatDate(appointment.date)}</strong>?
          </p>
          <p className="dash-modal__confirm-sub [font-size:0.8rem] [color:#90a4ae] [margin:0.3rem_0_0]">
            This action cannot be undone.
          </p>
          {error && <div className="dash-modal__error [margin:0_1.6rem] [padding:0.7rem_1rem] [background:#ffebee] [border:1px_solid_#ffcdd2] [border-radius:10px] [font-size:0.83rem] [color:#c62828] max-[640px]:[margin-left:1.25rem] max-[640px]:[margin-right:1.25rem]">{error}</div>}
        </div>
        <div className="dash-modal__footer [display:flex] [justify-content:flex-end] [gap:0.65rem] [padding:1rem_1.6rem_1.4rem] [border-top:1px_solid_#f0f4f8] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <button
            className="dash-modal__btn [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.85rem] [font-weight:600] [padding:0.6rem_1.25rem] [border-radius:10px] [border:none] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:transform_0.1s,_box-shadow_0.15s,_background_0.15s] disabled:[opacity:0.5] disabled:[cursor:not-allowed] disabled:[transform:none_!important] dash-modal__btn--cancel [background:#f1f5f9] [color:#455a64] [border:1.5px_solid_#e3eaf5] [&:hover:not(:disabled)]:[background:#e3eaf5]"
            onClick={onClose}
            disabled={cancelling}
          >
            Keep It
          </button>
          <button
            className="dash-modal__btn [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.85rem] [font-weight:600] [padding:0.6rem_1.25rem] [border-radius:10px] [border:none] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:transform_0.1s,_box-shadow_0.15s,_background_0.15s] disabled:[opacity:0.5] disabled:[cursor:not-allowed] disabled:[transform:none_!important] dash-modal__btn--danger [background:linear-gradient(135deg,_#c62828_0%,_#ef5350_100%)] [color:#fff] [box-shadow:0_4px_14px_rgba(198,_40,_40,_0.3)] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[box-shadow:0_6px_20px_rgba(198,_40,_40,_0.4)]"
            onClick={handleConfirm}
            disabled={cancelling}
          >
            {cancelling ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Appointment Card (shared patient + doctor view) ────────── */
function AppointmentCard({ appt, onEdit, onCancel, isDoctor }) {
  const status = STATUS_STYLES[appt.status] ?? {
    label: appt.status,
    cls: "badge--pending [background:#fff8e1] [color:#f57f17]",
  };
  const editable =
    !isDoctor && (appt.status === "SCHEDULED" || appt.status === "PENDING");

  const fullName =
    `${appt.doctor?.firstName ?? ""} ${appt.doctor?.lastName ?? ""}`.trim();
  const rawName = appt.doctorName ?? fullName ?? null;

  const patientFull =
    `${appt.patient?.firstName ?? ""} ${appt.patient?.lastName ?? ""}`.trim();
  const patientName = appt.patientName ?? patientFull ?? null;

  return (
    <div
      className={`dash-appt-card [background:#f8fafc] [border:1px_solid_#e3eaf5] [border-radius:16px] [padding:1.1rem_1.25rem] [display:flex] [flex-direction:column] [gap:0.65rem] [transition:border-color_0.2s,_box-shadow_0.2s,_transform_0.15s] hover:[border-color:#90caf9] hover:[box-shadow:0_6px_24px_rgba(21,_101,_192,_0.1)] hover:[transform:translateY(-1px)] animate-fade-in dash-appt-card--${appt.status?.toLowerCase()}`}
    >
      <div className="dash-appt-card__top [display:flex] [align-items:center] [justify-content:space-between] [gap:0.5rem] [flex-wrap:wrap]">
        <span className={`dash-appt-badge [display:inline-block] [font-size:0.67rem] [font-weight:700] [letter-spacing:0.05em] [text-transform:uppercase] [padding:0.25rem_0.7rem] [border-radius:100px] ${status.cls}`}>{status.label}</span>
        {editable && (
          <div className="dash-appt-card__actions [display:flex] [gap:0.4rem]">
            <button
              className="dash-appt-card__btn [display:inline-flex] [align-items:center] [gap:0.3rem] [font-size:0.72rem] [font-weight:600] [padding:0.28rem_0.65rem] [border-radius:7px] [border:1.5px_solid_transparent] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:background_0.15s,_border-color_0.15s,_transform_0.1s] hover:[transform:translateY(-1px)] dash-appt-card__btn--edit [background:#e3f2fd] [border-color:#90caf9] [color:#1565c0] hover:[background:#bbdefb] hover:[border-color:#42a5f5]"
              onClick={() => onEdit(appt)}
              title="Edit"
            >
              <EditIcon /> Edit
            </button>
            <button
              className="dash-appt-card__btn [display:inline-flex] [align-items:center] [gap:0.3rem] [font-size:0.72rem] [font-weight:600] [padding:0.28rem_0.65rem] [border-radius:7px] [border:1.5px_solid_transparent] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:background_0.15s,_border-color_0.15s,_transform_0.1s] hover:[transform:translateY(-1px)] dash-appt-card__btn--cancel [background:#ffebee] [border-color:#ffcdd2] [color:#c62828] hover:[background:#ffcdd2] hover:[border-color:#ef9a9a]"
              onClick={() => onCancel(appt)}
              title="Cancel"
            >
              <XIcon /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="dash-appt-card__service [font-size:0.97rem] [font-weight:700] [color:#0b2447] [letter-spacing:-0.01em]">
        {getServiceLabel(appt.services)}
      </div>

      <div className="dash-appt-card__meta [display:flex] [flex-wrap:wrap] [gap:0.75rem]">
        <div className="dash-appt-card__meta-item [display:flex] [align-items:center] [gap:0.35rem] [font-size:0.8rem] [color:#607d8b] [&_svg]:[color:#90a4ae] [&_svg]:[flex-shrink:0]">
          <CalendarIcon />
          <span>{formatDate(appt.date)}</span>
        </div>
        <div className="dash-appt-card__meta-item [display:flex] [align-items:center] [gap:0.35rem] [font-size:0.8rem] [color:#607d8b] [&_svg]:[color:#90a4ae] [&_svg]:[flex-shrink:0]">
          <ClockIcon />
          <span>{formatTime(appt.startTime)}</span>
        </div>
      </div>

      {/* Show patient name for doctor, doctor name for patient */}
      <div className="dash-appt-card__doctor [font-size:0.82rem] [font-weight:600] [color:#1565c0]">
        {isDoctor
          ? patientName
            ? `Patient: ${patientName}`
            : "—"
          : rawName
            ? `Doctor: Dr. ${rawName}`
            : "—"}
      </div>

      {appt.concerns && (
        <div className="dash-appt-card__concerns [font-size:0.78rem] [color:#78909c] [line-height:1.5] [border-top:1px_solid_#e8edf3] [padding-top:0.6rem] [margin-top:0.1rem]">
          <span className="dash-appt-card__concerns-label [font-weight:600] [color:#455a64]">Notes:</span>{" "}
          {appt.concerns}
        </div>
      )}
    </div>
  );
}

/* ── Patient Appointments Section ───────────────────────────── */
function AppointmentsSection({ userId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    appointmentApi
      .getByPatient(userId)
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to load appointments"))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSaved = (updated) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a)),
    );
    setEditTarget(null);
  };

  const handleCancelled = (id) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a)),
    );
    setCancelTarget(null);
  };

  if (loading)
    return (
      <div className="dash-appts__loading [display:flex] [align-items:center] [gap:0.75rem] [padding:1.5rem_0] [font-size:0.9rem] [color:#607d8b]">
        <span className="dash-appts__spinner [display:inline-block] [width:16px] [height:16px] [border:2px_solid_#e3eaf5] [border-top-color:#1565c0] [border-radius:50%] animate-spin [flex-shrink:0]" /> Loading appointments…
      </div>
    );
  if (error)
    return (
      <div className="dash-appts__error [display:flex] [align-items:center] [gap:0.75rem] [padding:1rem_1.25rem] [border-radius:12px] [font-size:0.88rem] [color:#c62828] [background:#ffebee] [border:1px_solid_#ffcdd2]">
        Could not load appointments: {error}
      </div>
    );

  const upcoming = appointments.filter(
    (a) => a.status === "SCHEDULED" || a.status === "PENDING",
  );
  const past = appointments.filter(
    (a) => a.status === "COMPLETED" || a.status === "CANCELLED",
  );

  return (
    <>
      <div className="dash-appts [background:#fff] [border-radius:22px] [padding:2rem_2.5rem_2.5rem] [box-shadow:0_24px_80px_rgba(11,_36,_71,_0.22)] max-[640px]:[padding:1.5rem_1.25rem_2rem] max-[640px]:[border-radius:16px]">
        {appointments.length === 0 ? (
          <div className="dash-appts__empty [display:flex] [flex-direction:column] [align-items:center] [gap:0.85rem] [padding:3rem_1rem] [text-align:center] [color:#90a4ae] [background:#f8fafc] [border:1.5px_dashed_#cfd8dc] [border-radius:14px] [&_svg]:[color:#b0bec5] [&_p]:[margin:0] [&_p]:[font-size:0.88rem] [&_p]:[font-weight:400]">
            <CalendarIcon />
            <p>No appointments yet. Book one to get started!</p>
            <Link to="/appointment" className="dash-hero__cta [display:inline-flex] [align-items:center] [gap:0.6rem] [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [color:#fff] [text-decoration:none] [padding:0.85rem_1.6rem] [border-radius:12px] [font-size:0.97rem] [font-weight:600] [letter-spacing:0.01em] [box-shadow:0_4px_18px_rgba(21,_101,_192,_0.4)] [transition:transform_0.15s,_box-shadow_0.2s] hover:[transform:translateY(-2px)] hover:[box-shadow:0_10px_30px_rgba(21,_101,_192,_0.48)]">
              <span>Book an Appointment</span>
              <span className="dash-hero__cta-arrow [margin-left:0.2rem] [display:flex] [align-items:center] [opacity:0.85]">
                <ArrowRight />
              </span>
            </Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
                <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">Upcoming</div>
                <div className="dash-appts__grid [display:grid] [grid-template-columns:repeat(auto-fill,_minmax(260px,_1fr))] [gap:1rem] max-[640px]:[grid-template-columns:1fr]">
                  {upcoming.map((a) => (
                    <AppointmentCard
                      key={a.id}
                      appt={a}
                      onEdit={setEditTarget}
                      onCancel={setCancelTarget}
                      isDoctor={false}
                    />
                  ))}
                </div>
              </div>
            )}
            {upcoming.length === 0 && (
              <div className="dash-appts__empty [display:flex] [flex-direction:column] [align-items:center] [gap:0.85rem] [padding:3rem_1rem] [text-align:center] [color:#90a4ae] [background:#f8fafc] [border:1.5px_dashed_#cfd8dc] [border-radius:14px] [&_svg]:[color:#b0bec5] [&_p]:[margin:0] [&_p]:[font-size:0.88rem] [&_p]:[font-weight:400]">
                <CalendarIcon />
                <p>No active appointments. Book one to get started!</p>
                <Link to="/appointment" className="dash-hero__cta [display:inline-flex] [align-items:center] [gap:0.6rem] [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [color:#fff] [text-decoration:none] [padding:0.85rem_1.6rem] [border-radius:12px] [font-size:0.97rem] [font-weight:600] [letter-spacing:0.01em] [box-shadow:0_4px_18px_rgba(21,_101,_192,_0.4)] [transition:transform_0.15s,_box-shadow_0.2s] hover:[transform:translateY(-2px)] hover:[box-shadow:0_10px_30px_rgba(21,_101,_192,_0.48)]">
                  <span>Book an Appointment</span>
                  <span className="dash-hero__cta-arrow [margin-left:0.2rem] [display:flex] [align-items:center] [opacity:0.85]">
                    <ArrowRight />
                  </span>
                </Link>
              </div>
            )}
            {past.length > 0 && (
              <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
                <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">Past</div>
                <div className="dash-appts__grid [display:grid] [grid-template-columns:repeat(auto-fill,_minmax(260px,_1fr))] [gap:1rem] max-[640px]:[grid-template-columns:1fr]">
                  {past.map((a) => (
                    <AppointmentCard
                      key={a.id}
                      appt={a}
                      onEdit={setEditTarget}
                      onCancel={setCancelTarget}
                      isDoctor={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {editTarget && (
        <EditModal
          appointment={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSaved}
        />
      )}
      {cancelTarget && (
        <CancelModal
          appointment={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancelled}
        />
      )}
    </>
  );
}

/* ── Add Off-Day Modal ──────────────────────────────────────── */
function AddOffDayModal({ doctorId, onClose, onAdded }) {
  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { date: "", reason: "" },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (form) => {
    try {
      setSaving(true);
      setError(null);
      const created = await scheduleApi.createOverride(doctorId, {
        date: form.date,
        reason: form.reason.trim() || null,
      });
      onAdded(created);
    } catch (err) {
      setError(err.message || "Failed to block date.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="dash-modal-overlay [position:fixed] [inset:0] [z-index:1000] [background:rgba(11,_36,_71,_0.45)] [backdrop-filter:blur(5px)] [display:flex] [align-items:center] [justify-content:center] [padding:1rem]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dash-modal [background:#fff] [border:1px_solid_#e3eaf5] [border-radius:20px] [width:100%] [max-width:480px] [box-shadow:0_24px_80px_rgba(11,_36,_71,_0.22)] [overflow:hidden] dash-modal--sm [max-width:380px] animate-slide-up">
        <div className="dash-modal__header [display:flex] [align-items:center] [justify-content:space-between] [padding:1.4rem_1.6rem_1.1rem] [border-bottom:1px_solid_#f0f4f8] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <h3 className="dash-modal__title [font-size:1rem] [font-weight:700] [color:#0b2447] [margin:0] [letter-spacing:-0.015em]">Block Off Day</h3>
          <button className="dash-modal__close [display:flex] [align-items:center] [justify-content:center] [width:30px] [height:30px] [border-radius:8px] [background:#f1f5f9] [border:none] [color:#607d8b] [cursor:pointer] [transition:background_0.15s,_color_0.15s] hover:[background:#e3eaf5] hover:[color:#0b2447]" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        {error && <div className="dash-modal__error [margin:0_1.6rem] [padding:0.7rem_1rem] [background:#ffebee] [border:1px_solid_#ffcdd2] [border-radius:10px] [font-size:0.83rem] [color:#c62828] max-[640px]:[margin-left:1.25rem] max-[640px]:[margin-right:1.25rem]">{error}</div>}
        <form onSubmit={handleSubmit(handleSave)} noValidate>
        <div className="dash-modal__body [padding:1.4rem_1.6rem] [display:flex] [flex-direction:column] [gap:1.1rem] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <div className="dash-modal__field [display:flex] [flex-direction:column] [gap:0.45rem] [&_label]:[font-size:0.75rem] [&_label]:[font-weight:700] [&_label]:[color:#607d8b] [&_label]:[text-transform:uppercase] [&_label]:[letter-spacing:0.06em] [&_input]:[background:#f8fafc] [&_input]:[border:1.5px_solid_#e3eaf5] [&_input]:[border-radius:10px] [&_input]:[padding:0.65rem_0.9rem] [&_input]:[color:#0b2447] [&_input]:[font-size:0.9rem] [&_input]:[font-family:DM_Sans,_sans-serif] [&_input]:[outline:none] [&_input]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_input]:[width:100%] [&_input]:[box-sizing:border-box] [&_select]:[background:#f8fafc] [&_select]:[border:1.5px_solid_#e3eaf5] [&_select]:[border-radius:10px] [&_select]:[padding:0.65rem_0.9rem] [&_select]:[color:#0b2447] [&_select]:[font-size:0.9rem] [&_select]:[font-family:DM_Sans,_sans-serif] [&_select]:[outline:none] [&_select]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_select]:[width:100%] [&_select]:[box-sizing:border-box] [&_textarea]:[background:#f8fafc] [&_textarea]:[border:1.5px_solid_#e3eaf5] [&_textarea]:[border-radius:10px] [&_textarea]:[padding:0.65rem_0.9rem] [&_textarea]:[color:#0b2447] [&_textarea]:[font-size:0.9rem] [&_textarea]:[font-family:DM_Sans,_sans-serif] [&_textarea]:[outline:none] [&_textarea]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_textarea]:[width:100%] [&_textarea]:[box-sizing:border-box] [&_input:focus]:[border-color:#1565c0] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_input:focus]:[background:#fff] [&_select:focus]:[border-color:#1565c0] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_select:focus]:[background:#fff] [&_textarea:focus]:[border-color:#1565c0] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_textarea:focus]:[background:#fff] [&_option]:[background:#fff] [&_option]:[color:#0b2447] [&_textarea]:[resize:vertical] [&_textarea]:[min-height:80px]">
            <label>Date</label>
            <input
              type="date"
              min={today}
              {...register("date", { required: "Please select a date." })}
              aria-invalid={Boolean(fieldErrors.date)}
            />
            {fieldErrors.date && <span className="text-[0.75rem] text-[#c62828]">{fieldErrors.date.message}</span>}
          </div>
          <div className="dash-modal__field [display:flex] [flex-direction:column] [gap:0.45rem] [&_label]:[font-size:0.75rem] [&_label]:[font-weight:700] [&_label]:[color:#607d8b] [&_label]:[text-transform:uppercase] [&_label]:[letter-spacing:0.06em] [&_input]:[background:#f8fafc] [&_input]:[border:1.5px_solid_#e3eaf5] [&_input]:[border-radius:10px] [&_input]:[padding:0.65rem_0.9rem] [&_input]:[color:#0b2447] [&_input]:[font-size:0.9rem] [&_input]:[font-family:DM_Sans,_sans-serif] [&_input]:[outline:none] [&_input]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_input]:[width:100%] [&_input]:[box-sizing:border-box] [&_select]:[background:#f8fafc] [&_select]:[border:1.5px_solid_#e3eaf5] [&_select]:[border-radius:10px] [&_select]:[padding:0.65rem_0.9rem] [&_select]:[color:#0b2447] [&_select]:[font-size:0.9rem] [&_select]:[font-family:DM_Sans,_sans-serif] [&_select]:[outline:none] [&_select]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_select]:[width:100%] [&_select]:[box-sizing:border-box] [&_textarea]:[background:#f8fafc] [&_textarea]:[border:1.5px_solid_#e3eaf5] [&_textarea]:[border-radius:10px] [&_textarea]:[padding:0.65rem_0.9rem] [&_textarea]:[color:#0b2447] [&_textarea]:[font-size:0.9rem] [&_textarea]:[font-family:DM_Sans,_sans-serif] [&_textarea]:[outline:none] [&_textarea]:[transition:border-color_0.15s,_box-shadow_0.15s] [&_textarea]:[width:100%] [&_textarea]:[box-sizing:border-box] [&_input:focus]:[border-color:#1565c0] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_input:focus]:[background:#fff] [&_select:focus]:[border-color:#1565c0] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_select:focus]:[background:#fff] [&_textarea:focus]:[border-color:#1565c0] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] [&_textarea:focus]:[background:#fff] [&_option]:[background:#fff] [&_option]:[color:#0b2447] [&_textarea]:[resize:vertical] [&_textarea]:[min-height:80px]">
            <label>
              Reason{" "}
              <span
                className="[font-weight:400] [text-transform:none] [letter-spacing:0]"
              >
                (optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Personal leave, Conference…"
              {...register("reason")}
            />
          </div>
        </div>
        <div className="dash-modal__footer [display:flex] [justify-content:flex-end] [gap:0.65rem] [padding:1rem_1.6rem_1.4rem] [border-top:1px_solid_#f0f4f8] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <button
            type="button"
            className="dash-modal__btn [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.85rem] [font-weight:600] [padding:0.6rem_1.25rem] [border-radius:10px] [border:none] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:transform_0.1s,_box-shadow_0.15s,_background_0.15s] disabled:[opacity:0.5] disabled:[cursor:not-allowed] disabled:[transform:none_!important] dash-modal__btn--cancel [background:#f1f5f9] [color:#455a64] [border:1.5px_solid_#e3eaf5] [&:hover:not(:disabled)]:[background:#e3eaf5]"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="dash-modal__btn [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.85rem] [font-weight:600] [padding:0.6rem_1.25rem] [border-radius:10px] [border:none] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:transform_0.1s,_box-shadow_0.15s,_background_0.15s] disabled:[opacity:0.5] disabled:[cursor:not-allowed] disabled:[transform:none_!important] dash-modal__btn--save [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [color:#fff] [box-shadow:0_4px_14px_rgba(21,_101,_192,_0.35)] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[box-shadow:0_6px_20px_rgba(21,_101,_192,_0.45)]"
            type="submit"
            disabled={saving}
          >
            <CheckIcon /> {saving ? "Saving…" : "Block Date"}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

/* ── Doctor Dashboard Section ───────────────────────────────── */
function DoctorSection() {
  // ── Appointments state ────────────────────────────
  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(true);
  const [apptError, setApptError] = useState(null);

  // ── Overrides (off-days) state ────────────────────
  const [overrides, setOverrides] = useState([]);
  const [overrideLoad, setOverrideLoad] = useState(true);
  const [overrideError, setOverrideError] = useState(null);
  const [showAddOff, setShowAddOff] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ── Active tab ────────────────────────────────────
  // ── Active tab ────────────────────────────────────
  const [tab, setTab] = useState("appointments"); // "appointments" | "offdays"

  // doctorId = DoctorEntity.id, which differs from UserEntity.id.
  // Resolved once on mount via GET /doctors/me.
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    doctorApi
      .getMe()
      .then((doctor) => {
        const id = doctor.id;
        setDoctorId(id);

        appointmentApi
          .getByDoctor(id)
          .then((data) => setAppointments(Array.isArray(data) ? data : []))
          .catch((err) =>
            setApptError(err.message || "Failed to load appointments"),
          )
          .finally(() => setApptLoading(false));

        scheduleApi
          .getOverrides(id)
          .then((data) => setOverrides(Array.isArray(data) ? data : []))
          .catch((err) =>
            setOverrideError(err.message || "Failed to load off-days"),
          )
          .finally(() => setOverrideLoad(false));
      })
      .catch(() => {
        setApptError("Could not resolve doctor profile.");
        setApptLoading(false);
        setOverrideError("Could not resolve doctor profile.");
        setOverrideLoad(false);
      });
  }, []);

  const handleOverrideAdded = (created) => {
    setOverrides((prev) =>
      [...prev, created].sort((a, b) => a.date.localeCompare(b.date)),
    );
    setShowAddOff(false);
  };

  const handleDeleteOverride = async (overrideId) => {
    try {
      setDeletingId(overrideId);
      await scheduleApi.deleteOverride(doctorId, overrideId);
      setOverrides((prev) => prev.filter((o) => o.id !== overrideId));
    } catch (err) {
      alert(err.message || "Failed to remove off-day.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Derived appointment lists ─────────────────────
  const upcoming = appointments.filter(
    (a) => a.status === "SCHEDULED" || a.status === "PENDING",
  );
  const past = appointments.filter(
    (a) => a.status === "COMPLETED" || a.status === "CANCELLED",
  );

  // ── Upcoming off-days (future only) ──────────────
  const futureOff = overrides.filter((o) => o.date >= today);
  const pastOff = overrides.filter((o) => o.date < today);

  return (
    <>
      {/* ── Tab bar ── */}
      <div className="doc-tabs [display:flex] [gap:0.5rem] [flex-wrap:wrap] max-[640px]:[gap:0.4rem]">
          <button
            className={`doc-tab${tab === "appointments" ? " doc-tab--active" : ""}`}
            aria-pressed={tab === "appointments"}
            onClick={() => setTab("appointments")}
          >
            <UserGroupIcon />
            My Schedule
            {upcoming.length > 0 && (
              <span className="doc-tab__badge [display:inline-flex] [align-items:center] [justify-content:center] [min-width:18px] [height:18px] [padding:0_5px] [border-radius:100px] [font-size:0.65rem] [font-weight:700] [background:#e3f2fd] [color:#1565c0]">{upcoming.length}</span>
            )}
          </button>
          <button
            className={`doc-tab${tab === "offdays" ? " doc-tab--active" : ""}`}
            aria-pressed={tab === "offdays"}
            onClick={() => setTab("offdays")}
          >
            <BanIcon />
            Off Days
            {futureOff.length > 0 && (
              <span className="doc-tab__badge [display:inline-flex] [align-items:center] [justify-content:center] [min-width:18px] [height:18px] [padding:0_5px] [border-radius:100px] [font-size:0.65rem] [font-weight:700] [background:#e3f2fd] [color:#1565c0] doc-tab__badge--warn [background:#fff3e0] [color:#e65100]">
                {futureOff.length}
              </span>
            )}
          </button>
      </div>

      <div className="doc-section [background:#fff] [border-radius:22px] [box-shadow:0_24px_80px_rgba(11,_36,_71,_0.22)] [overflow:hidden] [scroll-margin-top:80px]">
        {/* ── Appointments tab ── */}
        {tab === "appointments" && (
          <div className="doc-panel [padding:1.75rem_2.5rem_2.25rem] max-[640px]:[padding:1.5rem_1.25rem_2rem]">
            {apptLoading ? (
              <div className="dash-appts__loading [display:flex] [align-items:center] [gap:0.75rem] [padding:1.5rem_0] [font-size:0.9rem] [color:#607d8b]">
                <span className="dash-appts__spinner [display:inline-block] [width:16px] [height:16px] [border:2px_solid_#e3eaf5] [border-top-color:#1565c0] [border-radius:50%] animate-spin [flex-shrink:0]" /> Loading schedule…
              </div>
            ) : apptError ? (
              <div className="dash-appts__error [display:flex] [align-items:center] [gap:0.75rem] [padding:1rem_1.25rem] [border-radius:12px] [font-size:0.88rem] [color:#c62828] [background:#ffebee] [border:1px_solid_#ffcdd2]">{apptError}</div>
            ) : appointments.length === 0 ? (
              <div className="dash-appts__empty [display:flex] [flex-direction:column] [align-items:center] [gap:0.85rem] [padding:3rem_1rem] [text-align:center] [color:#90a4ae] [background:#f8fafc] [border:1.5px_dashed_#cfd8dc] [border-radius:14px] [&_svg]:[color:#b0bec5] [&_p]:[margin:0] [&_p]:[font-size:0.88rem] [&_p]:[font-weight:400]">
                <CalendarIcon />
                <p>No appointments booked for you yet.</p>
              </div>
            ) : (
              <>
                {upcoming.length > 0 && (
                  <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
                    <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">
                      Upcoming ({upcoming.length})
                    </div>
                    <div className="dash-appts__grid [display:grid] [grid-template-columns:repeat(auto-fill,_minmax(260px,_1fr))] [gap:1rem] max-[640px]:[grid-template-columns:1fr]">
                      {upcoming.map((a) => (
                        <AppointmentCard key={a.id} appt={a} isDoctor={true} />
                      ))}
                    </div>
                  </div>
                )}
                {past.length > 0 && (
                  <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
                    <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">Past</div>
                    <div className="dash-appts__grid [display:grid] [grid-template-columns:repeat(auto-fill,_minmax(260px,_1fr))] [gap:1rem] max-[640px]:[grid-template-columns:1fr]">
                      {past.map((a) => (
                        <AppointmentCard key={a.id} appt={a} isDoctor={true} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Off Days tab ── */}
        {tab === "offdays" && (
          <div className="doc-panel [padding:1.75rem_2.5rem_2.25rem] max-[640px]:[padding:1.5rem_1.25rem_2rem]">
            <div className="doc-offdays__toolbar [display:flex] [align-items:flex-start] [justify-content:space-between] [gap:1rem] [margin-bottom:1.5rem] [flex-wrap:wrap] max-[640px]:[flex-direction:column] max-[640px]:[align-items:stretch]">
              <p className="doc-offdays__hint [font-size:0.82rem] [color:#78909c] [font-weight:400] [margin:0] [line-height:1.5] [max-width:400px]">
                Block dates when you're unavailable. Patients won't be able to
                book on these days.
              </p>
              <button
                className="doc-offdays__add-btn [display:inline-flex] [align-items:center] [gap:0.4rem] [font-size:0.82rem] [font-weight:700] [padding:0.55rem_1.1rem] [border-radius:10px] [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [color:#fff] [border:none] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [box-shadow:0_4px_12px_rgba(21,_101,_192,_0.3)] [transition:transform_0.15s,_box-shadow_0.2s] [white-space:nowrap] [flex-shrink:0] hover:[transform:translateY(-1px)] hover:[box-shadow:0_6px_18px_rgba(21,_101,_192,_0.4)] max-[640px]:[width:100%] max-[640px]:[justify-content:center]"
                onClick={() => setShowAddOff(true)}
              >
                <PlusIcon /> Add Off Day
              </button>
            </div>

            {overrideLoad ? (
              <div className="dash-appts__loading [display:flex] [align-items:center] [gap:0.75rem] [padding:1.5rem_0] [font-size:0.9rem] [color:#607d8b]">
                <span className="dash-appts__spinner [display:inline-block] [width:16px] [height:16px] [border:2px_solid_#e3eaf5] [border-top-color:#1565c0] [border-radius:50%] animate-spin [flex-shrink:0]" /> Loading off days…
              </div>
            ) : overrideError ? (
              <div className="dash-appts__error [display:flex] [align-items:center] [gap:0.75rem] [padding:1rem_1.25rem] [border-radius:12px] [font-size:0.88rem] [color:#c62828] [background:#ffebee] [border:1px_solid_#ffcdd2]">{overrideError}</div>
            ) : overrides.length === 0 ? (
              <div className="dash-appts__empty [display:flex] [flex-direction:column] [align-items:center] [gap:0.85rem] [padding:3rem_1rem] [text-align:center] [color:#90a4ae] [background:#f8fafc] [border:1.5px_dashed_#cfd8dc] [border-radius:14px] [&_svg]:[color:#b0bec5] [&_p]:[margin:0] [&_p]:[font-size:0.88rem] [&_p]:[font-weight:400]">
                <BanIcon />
                <p>No off days scheduled. You're fully available!</p>
              </div>
            ) : (
              <>
                {futureOff.length > 0 && (
                  <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
                    <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">
                      Upcoming Off Days
                    </div>
                    <div className="doc-offdays__list [display:flex] [flex-direction:column] [gap:0.6rem]">
                      {futureOff.map((o) => (
                        <OffDayRow
                          key={o.id}
                          override={o}
                          onDelete={handleDeleteOverride}
                          deleting={deletingId === o.id}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {pastOff.length > 0 && (
                  <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
                    <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">Past Off Days</div>
                    <div className="doc-offdays__list [display:flex] [flex-direction:column] [gap:0.6rem]">
                      {pastOff.map((o) => (
                        <OffDayRow
                          key={o.id}
                          override={o}
                          onDelete={null}
                          deleting={false}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {showAddOff && (
        <AddOffDayModal
          doctorId={doctorId}
          onClose={() => setShowAddOff(false)}
          onAdded={handleOverrideAdded}
        />
      )}
    </>
  );
}

/* ── Off Day Row ────────────────────────────────────────────── */
function OffDayRow({ override, onDelete, deleting }) {
  return (
    <div className="doc-offday-row [display:flex] [align-items:center] [justify-content:space-between] [gap:1rem] [padding:0.85rem_1.1rem] [background:#f8fafc] [border:1px_solid_#e3eaf5] [border-radius:12px] [transition:border-color_0.15s,_box-shadow_0.15s] hover:[border-color:#90caf9] hover:[box-shadow:0_3px_12px_rgba(21,_101,_192,_0.08)]">
      <div className="doc-offday-row__left [display:flex] [align-items:center] [gap:0.75rem]">
        <div className="doc-offday-row__icon [width:34px] [height:34px] [border-radius:9px] [background:#fff3e0] [border:1px_solid_#ffe0b2] [color:#e65100] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0]">
          <BanIcon />
        </div>
        <div>
          <div className="doc-offday-row__date [font-size:0.88rem] [font-weight:700] [color:#0b2447]">
            {formatDate(override.date)}
          </div>
          {override.reason && (
            <div className="doc-offday-row__reason [font-size:0.75rem] [color:#78909c] [font-weight:400] [margin-top:2px]">{override.reason}</div>
          )}
        </div>
      </div>
      {onDelete && (
        <button
          className="doc-offday-row__del [display:flex] [align-items:center] [justify-content:center] [width:30px] [height:30px] [border-radius:8px] [background:#ffebee] [border:1px_solid_#ffcdd2] [color:#c62828] [cursor:pointer] [transition:background_0.15s,_border-color_0.15s,_transform_0.1s] [flex-shrink:0] [&:hover:not(:disabled)]:[background:#ffcdd2] [&:hover:not(:disabled)]:[border-color:#ef9a9a] [&:hover:not(:disabled)]:[transform:scale(1.05)] disabled:[opacity:0.5] disabled:[cursor:not-allowed]"
          onClick={() => onDelete(override.id)}
          disabled={deleting}
          title="Remove off day"
        >
          {deleting ? (
            <span
              className="dash-appts__spinner [display:inline-block] [width:16px] [height:16px] [border:2px_solid_#e3eaf5] [border-top-color:#1565c0] [border-radius:50%] animate-spin [flex-shrink:0]"
            />
          ) : (
            <TrashIcon />
          )}
        </button>
      )}
    </div>
  );
}

/* ── Dashboard Page ─────────────────────────────────────────── */
export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!user) return null;

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const isDoctor = user.role === "DOCTOR";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="dash-page min-h-screen flex flex-col relative overflow-x-hidden font-body">
      <div className="dash-page__bg [position:fixed] [inset:0] [z-index:0] [pointer-events:none] [background-image:linear-gradient(155deg,#0b2447_0%,#1565c0_55%,#1e88e5_100%)]" />
      <div className="dash-page__glow-1 [position:fixed] [inset:0] [pointer-events:none] [background:radial-gradient(_ellipse_60%_50%_at_30%_60%,_rgba(30,_136,_229,_0.2)_0%,_transparent_70%_)] [z-index:0]" />
      <div className="dash-page__glow-2 [position:absolute] [top:-100px] [right:-100px] [width:420px] [height:420px] [border-radius:50%] [background:rgba(255,_255,_255,_0.04)] [pointer-events:none] [z-index:0]" />

      {/* ── Nav ── */}
      <nav className="dash-nav [position:sticky] [top:0] [z-index:100] [padding:0_2rem] [background:rgba(11,_36,_71,_0.85)] [backdrop-filter:blur(14px)] [border-bottom:1px_solid_rgba(255,_255,_255,_0.08)] max-[640px]:[padding:1rem_1.25rem]">
        <div className="dash-nav__inner [max-width:1200px] [margin:0_auto] [height:68px] [display:flex] [align-items:center] [gap:2rem]">
          <div className="dash-nav__logo [flex:0_0_auto]">
            <img
              src="/logo.png"
              alt="DentalCare"
              className="dash-nav__logo-img [height:38px] [width:auto] [display:block] [min-width:120px] [border-radius:6px] [object-fit:contain]"
            />
          </div>
          <ul className="dash-nav__links [display:flex] [list-style:none] [gap:2rem] [margin-left:auto] [&_a]:[color:rgba(255,_255,_255,_0.8)] [&_a]:[text-decoration:none] [&_a]:[font-size:0.95rem] [&_a]:[font-weight:500] [&_a]:[letter-spacing:0.01em] [&_a]:[transition:color_0.2s] [&_a:hover]:[color:#fff]"></ul>
          <div className="dash-nav__actions [display:flex] [gap:0.75rem] [align-items:center]">
            <ProfileDropdown
              user={user}
              initials={initials}
              onLogout={handleLogout}
              loggingOut={loggingOut}
            />
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="dash-main [position:relative] [z-index:1] [flex:1] [max-width:860px] [width:100%] [margin:0_auto] [padding:2.5rem_1.5rem_4rem] [display:flex] [flex-direction:column] [gap:1.5rem] max-[640px]:[padding:1.75rem_1rem_3rem]">
        {/* Hero welcome card */}
        <div className="dash-hero [background:#fff] [border-radius:22px] [padding:2.5rem_2.5rem] [box-shadow:0_24px_80px_rgba(11,_36,_71,_0.22)] [display:flex] [align-items:center] [justify-content:space-between] [gap:1.5rem] [overflow:hidden] [position:relative] max-[640px]:[flex-direction:column] max-[640px]:[padding:2rem_1.5rem] max-[640px]:[text-align:center]">
          <div className="dash-hero__text [flex:1] [min-width:0]">
            <span className="dash-hero__greeting [display:block] [font-size:0.85rem] [font-weight:500] [color:#607d8b] [margin-bottom:0.25rem] [letter-spacing:0.02em]">{greeting},</span>
            <h1 className="dash-hero__name [font-size:2rem] [font-weight:700] [color:#0b2447] [letter-spacing:-0.025em] [line-height:1.15] [margin:0_0_0.75rem] max-[640px]:[font-size:1.6rem]">
              {" "}
              {user.firstName} {user.lastName} 👋
            </h1>
            <p className="dash-hero__sub [font-size:0.9rem] [color:#607d8b] [font-weight:300] [line-height:1.6] [max-width:360px] max-[640px]:[max-width:100%]">Welcome to your DentalCare portal.</p>
          </div>
          <div className="dash-hero__illustration [flex-shrink:0] max-[640px]:[display:none]">
            <div className="dash-hero__tooth-bg [width:110px] [height:110px] [border-radius:50%] [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [box-shadow:0_4px_18px_rgba(21,_101,_192,_0.4)] [display:flex] [align-items:center] [justify-content:center]">
              <img
                src="../../../../public/tab.png"
                alt="DentalCare tooth"
                className="dash-hero__tooth-img [width:64px] [height:64px] [object-fit:contain]"
              />
            </div>
          </div>
        </div>

        {/* Doctor section OR Patient appointments */}
        {user.role === "ADMIN" ? (
          <AdminSection />
        ) : isDoctor ? (
          <DoctorSection user={user} />
        ) : (
          <AppointmentsSection userId={user.id} />
        )}

        {/* Tip cards */}
        <div className="dash-tips">
          <h2 className="dash-tips__heading [font-size:0.75rem] [font-weight:700] [color:rgba(255,_255,_255,_0.65)] [letter-spacing:0.08em] [text-transform:uppercase] [margin:0_0_0.85rem]">Why regular visits matter</h2>
          <div className="dash-tips__grid [display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:1rem] max-[640px]:[grid-template-columns:1fr]">
            {TIPS.map((tip, i) => (
              <div className="dash-tip-card [background:rgba(255,_255,_255,_0.1)] [border:1px_solid_rgba(255,_255,_255,_0.18)] [border-radius:16px] [padding:1.4rem_1.25rem] [backdrop-filter:blur(6px)] [transition:background_0.2s,_border-color_0.2s] hover:[background:rgba(255,_255,_255,_0.16)] hover:[border-color:rgba(255,_255,_255,_0.3)]" key={i}>
                <div className="dash-tip-card__icon [color:rgba(255,_255,_255,_0.75)] [margin-bottom:0.75rem] [display:flex]">{tip.icon}</div>
                <div className="dash-tip-card__title [font-size:0.92rem] [font-weight:600] [color:#fff] [margin-bottom:0.4rem]">{tip.title}</div>
                <div className="dash-tip-card__desc [font-size:0.8rem] [color:rgba(255,_255,_255,_0.65)] [font-weight:300] [line-height:1.55]">{tip.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick action card */}
        <div className="dash-quick [background:#fff] [border-radius:18px] [padding:1.6rem_2rem] [box-shadow:0_12px_40px_rgba(11,_36,_71,_0.18)] [display:flex] [align-items:center] [justify-content:space-between] [gap:1.5rem] max-[640px]:[flex-direction:column] max-[640px]:[text-align:center] max-[640px]:[padding:1.5rem]">
          <div className="dash-quick__text">
            <h3 className="dash-quick__title [font-size:1.05rem] [font-weight:700] [color:#0b2447] [margin:0_0_0.3rem]">
              {isDoctor ? "Your schedule" : "Ready to book?"}
            </h3>
            <p className="dash-quick__desc [font-size:0.85rem] [color:#607d8b] [font-weight:300] [margin:0] [line-height:1.5]">
              {isDoctor
                ? "Review upcoming appointments and manage your availability."
                : "Choose from a range of dental services and pick a time that works for you."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );

}
