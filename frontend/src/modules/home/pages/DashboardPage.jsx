import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.js";
import { appointmentApi, scheduleApi, doctorApi } from "../../../app/api.js";
import AdminSection from "./AdminSection.jsx"; // adjust path
import "./AdminSection.css";
import "./DashboardPage.css";

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
  SCHEDULED: { label: "Scheduled", cls: "badge--scheduled" },
  COMPLETED: { label: "Completed", cls: "badge--completed" },
  CANCELLED: { label: "Cancelled", cls: "badge--cancelled" },
  PENDING: { label: "Pending", cls: "badge--pending" },
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
    <div className="dash-profile-dropdown" ref={ref}>
      <button
        className={`dash-profile-btn${open ? " dash-profile-btn--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        title={`${user.firstName} ${user.lastName}`}
      >
        <span className="dash-nav__avatar">{initials}</span>
        <span className="dash-profile-btn__name">{user.firstName}</span>
        <ChevronDown />
      </button>

      {open && (
        <div className="dash-dropdown-menu">
          <div className="dash-dropdown-menu__header">
            <div className="dash-dropdown-menu__avatar">{initials}</div>
            <div>
              <div className="dash-dropdown-menu__fullname">
                {user.firstName} {user.lastName}
              </div>
              <div className="dash-dropdown-menu__email">{user.email}</div>
            </div>
          </div>
          <div className="dash-dropdown-menu__divider" />
          <button
            className="dash-dropdown-menu__item"
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
          >
            <UserIcon /> My Profile
          </button>
          <div className="dash-dropdown-menu__divider" />
          <button
            className="dash-dropdown-menu__item dash-dropdown-menu__item--logout"
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
  const [form, setForm] = useState({
    date: appointment.date ?? "",
    time: formatTime(appointment.startTime) ?? "",
    service:
      getServiceLabel(appointment.services) !== "—"
        ? getServiceLabel(appointment.services).split(", ")[0]
        : "",
    concerns: appointment.concerns ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.date || !form.time || !form.service) {
      setError("Date, time and service are required.");
      return;
    }
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
      className="dash-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dash-modal">
        <div className="dash-modal__header">
          <h3 className="dash-modal__title">Edit Appointment</h3>
          <button className="dash-modal__close" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        {error && <div className="dash-modal__error">{error}</div>}
        <div className="dash-modal__body">
          <div className="dash-modal__field">
            <label>Service</label>
            <select
              value={form.service}
              onChange={(e) => onChange("service", e.target.value)}
            >
              <option value="">Select a service</option>
              {SERVICES_DISPLAY.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="dash-modal__field">
            <label>Date</label>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => onChange("date", e.target.value)}
            />
          </div>
          <div className="dash-modal__field">
            <label>Time</label>
            <select
              value={form.time}
              onChange={(e) => onChange("time", e.target.value)}
            >
              <option value="">Select a time</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="dash-modal__field dash-modal__field--full">
            <label>Concerns</label>
            <textarea
              rows={3}
              value={form.concerns}
              onChange={(e) => onChange("concerns", e.target.value)}
              placeholder="Describe your concern…"
            />
          </div>
        </div>
        <div className="dash-modal__footer">
          <button
            className="dash-modal__btn dash-modal__btn--cancel"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="dash-modal__btn dash-modal__btn--save"
            onClick={handleSave}
            disabled={saving}
          >
            <CheckIcon /> {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
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
      className="dash-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dash-modal dash-modal--sm">
        <div className="dash-modal__header">
          <h3 className="dash-modal__title">Cancel Appointment</h3>
          <button className="dash-modal__close" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        <div className="dash-modal__body">
          <p className="dash-modal__confirm-text">
            Are you sure you want to cancel your{" "}
            <strong>{getServiceLabel(appointment.services)}</strong> appointment
            on <strong>{formatDate(appointment.date)}</strong>?
          </p>
          <p className="dash-modal__confirm-sub">
            This action cannot be undone.
          </p>
          {error && <div className="dash-modal__error">{error}</div>}
        </div>
        <div className="dash-modal__footer">
          <button
            className="dash-modal__btn dash-modal__btn--cancel"
            onClick={onClose}
            disabled={cancelling}
          >
            Keep It
          </button>
          <button
            className="dash-modal__btn dash-modal__btn--danger"
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
    cls: "badge--pending",
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
      className={`dash-appt-card dash-appt-card--${appt.status?.toLowerCase()}`}
    >
      <div className="dash-appt-card__top">
        <span className={`dash-appt-badge ${status.cls}`}>{status.label}</span>
        {editable && (
          <div className="dash-appt-card__actions">
            <button
              className="dash-appt-card__btn dash-appt-card__btn--edit"
              onClick={() => onEdit(appt)}
              title="Edit"
            >
              <EditIcon /> Edit
            </button>
            <button
              className="dash-appt-card__btn dash-appt-card__btn--cancel"
              onClick={() => onCancel(appt)}
              title="Cancel"
            >
              <XIcon /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="dash-appt-card__service">
        {getServiceLabel(appt.services)}
      </div>

      <div className="dash-appt-card__meta">
        <div className="dash-appt-card__meta-item">
          <CalendarIcon />
          <span>{formatDate(appt.date)}</span>
        </div>
        <div className="dash-appt-card__meta-item">
          <ClockIcon />
          <span>{formatTime(appt.startTime)}</span>
        </div>
      </div>

      {/* Show patient name for doctor, doctor name for patient */}
      <div className="dash-appt-card__doctor">
        {isDoctor
          ? patientName
            ? `Patient: ${patientName}`
            : "—"
          : rawName
            ? `Doctor: Dr. ${rawName}`
            : "—"}
      </div>

      {appt.concerns && (
        <div className="dash-appt-card__concerns">
          <span className="dash-appt-card__concerns-label">Notes:</span>{" "}
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
      <div className="dash-appts__loading">
        <span className="dash-appts__spinner" /> Loading appointments…
      </div>
    );
  if (error)
    return (
      <div className="dash-appts__error">
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
      <div className="dash-appts">
        {appointments.length === 0 ? (
          <div className="dash-appts__empty">
            <CalendarIcon />
            <p>No appointments yet. Book one to get started!</p>
            <Link to="/appointment" className="dash-hero__cta">
              <span>Book an Appointment</span>
              <span className="dash-hero__cta-arrow">
                <ArrowRight />
              </span>
            </Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="dash-appts__group">
                <div className="dash-appts__group-label">Upcoming</div>
                <div className="dash-appts__grid">
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
            {past.length > 0 && (
              <div className="dash-appts__group">
                <div className="dash-appts__group-label">Past</div>
                <div className="dash-appts__grid">
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
  const [form, setForm] = useState({ date: "", reason: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!form.date) {
      setError("Please select a date.");
      return;
    }
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
      className="dash-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dash-modal dash-modal--sm">
        <div className="dash-modal__header">
          <h3 className="dash-modal__title">Block Off Day</h3>
          <button className="dash-modal__close" onClick={onClose}>
            <XIcon />
          </button>
        </div>
        {error && <div className="dash-modal__error">{error}</div>}
        <div className="dash-modal__body">
          <div className="dash-modal__field">
            <label>Date</label>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div className="dash-modal__field">
            <label>
              Reason{" "}
              <span
                style={{
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                (optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Personal leave, Conference…"
              value={form.reason}
              onChange={(e) =>
                setForm((f) => ({ ...f, reason: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="dash-modal__footer">
          <button
            className="dash-modal__btn dash-modal__btn--cancel"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="dash-modal__btn dash-modal__btn--save"
            onClick={handleSave}
            disabled={saving}
          >
            <CheckIcon /> {saving ? "Saving…" : "Block Date"}
          </button>
        </div>
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
      <div className="doc-section">
        <div className="doc-tabs">
          <button
            className={`doc-tab${tab === "appointments" ? " doc-tab--active" : ""}`}
            onClick={() => setTab("appointments")}
          >
            <UserGroupIcon />
            My Schedule
            {upcoming.length > 0 && (
              <span className="doc-tab__badge">{upcoming.length}</span>
            )}
          </button>
          <button
            className={`doc-tab${tab === "offdays" ? " doc-tab--active" : ""}`}
            onClick={() => setTab("offdays")}
          >
            <BanIcon />
            Off Days
            {futureOff.length > 0 && (
              <span className="doc-tab__badge doc-tab__badge--warn">
                {futureOff.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Appointments tab ── */}
        {tab === "appointments" && (
          <div className="doc-panel">
            {apptLoading ? (
              <div className="dash-appts__loading">
                <span className="dash-appts__spinner" /> Loading schedule…
              </div>
            ) : apptError ? (
              <div className="dash-appts__error">{apptError}</div>
            ) : appointments.length === 0 ? (
              <div className="dash-appts__empty">
                <CalendarIcon />
                <p>No appointments booked for you yet.</p>
              </div>
            ) : (
              <>
                {upcoming.length > 0 && (
                  <div className="dash-appts__group">
                    <div className="dash-appts__group-label">
                      Upcoming ({upcoming.length})
                    </div>
                    <div className="dash-appts__grid">
                      {upcoming.map((a) => (
                        <AppointmentCard key={a.id} appt={a} isDoctor={true} />
                      ))}
                    </div>
                  </div>
                )}
                {past.length > 0 && (
                  <div className="dash-appts__group">
                    <div className="dash-appts__group-label">Past</div>
                    <div className="dash-appts__grid">
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
          <div className="doc-panel">
            <div className="doc-offdays__toolbar">
              <p className="doc-offdays__hint">
                Block dates when you're unavailable. Patients won't be able to
                book on these days.
              </p>
              <button
                className="doc-offdays__add-btn"
                onClick={() => setShowAddOff(true)}
              >
                <PlusIcon /> Add Off Day
              </button>
            </div>

            {overrideLoad ? (
              <div className="dash-appts__loading">
                <span className="dash-appts__spinner" /> Loading off days…
              </div>
            ) : overrideError ? (
              <div className="dash-appts__error">{overrideError}</div>
            ) : overrides.length === 0 ? (
              <div className="dash-appts__empty">
                <BanIcon />
                <p>No off days scheduled. You're fully available!</p>
              </div>
            ) : (
              <>
                {futureOff.length > 0 && (
                  <div className="dash-appts__group">
                    <div className="dash-appts__group-label">
                      Upcoming Off Days
                    </div>
                    <div className="doc-offdays__list">
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
                  <div className="dash-appts__group">
                    <div className="dash-appts__group-label">Past Off Days</div>
                    <div className="doc-offdays__list">
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
    <div className="doc-offday-row">
      <div className="doc-offday-row__left">
        <div className="doc-offday-row__icon">
          <BanIcon />
        </div>
        <div>
          <div className="doc-offday-row__date">
            {formatDate(override.date)}
          </div>
          {override.reason && (
            <div className="doc-offday-row__reason">{override.reason}</div>
          )}
        </div>
      </div>
      {onDelete && (
        <button
          className="doc-offday-row__del"
          onClick={() => onDelete(override.id)}
          disabled={deleting}
          title="Remove off day"
        >
          {deleting ? (
            <span
              className="dash-appts__spinner"
              style={{ width: 12, height: 12 }}
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
    <div className="dash-page">
      <div className="dash-page__glow-1" />
      <div className="dash-page__glow-2" />

      {/* ── Nav ── */}
      <nav className="dash-nav">
        <div className="dash-nav__inner">
          <div className="dash-nav__logo">
            <img
              src="/logo.png"
              alt="DentalCare"
              className="dash-nav__logo-img"
            />
          </div>
          <ul className="dash-nav__links"></ul>
          <div className="dash-nav__actions">
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
      <main className="dash-main">
        {/* Hero welcome card */}
        <div className="dash-hero">
          <div className="dash-hero__text">
            <span className="dash-hero__greeting">{greeting},</span>
            <h1 className="dash-hero__name">
              {" "}
              {user.firstName} {user.lastName} 👋
            </h1>
            <p className="dash-hero__sub">
            
                Welcome to your DentalCare portal.
            </p>
          </div>
          <div className="dash-hero__illustration">
            <div className="dash-hero__tooth-bg">
              <img
                src="/tab.png"
                alt="DentalCare tooth"
                className="dash-hero__tooth-img"
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
          <h2 className="dash-tips__heading">Why regular visits matter</h2>
          <div className="dash-tips__grid">
            {TIPS.map((tip, i) => (
              <div className="dash-tip-card" key={i}>
                <div className="dash-tip-card__icon">{tip.icon}</div>
                <div className="dash-tip-card__title">{tip.title}</div>
                <div className="dash-tip-card__desc">{tip.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick action card */}
        <div className="dash-quick">
          <div className="dash-quick__text">
            <h3 className="dash-quick__title">
              {isDoctor ? "Your schedule" : "Ready to book?"}
            </h3>
            <p className="dash-quick__desc">
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
