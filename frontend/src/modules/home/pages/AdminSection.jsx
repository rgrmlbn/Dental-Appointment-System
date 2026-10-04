import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { appointmentApi, doctorApi, scheduleApi, userApi } from "../../../app/api.js";

/* ── Icons ──────────────────────────────────────────────────── */
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BanIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const StethoscopeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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

const STATUS_STYLES = {
  SCHEDULED: { label: "Scheduled", cls: "badge--scheduled [background:#e3f2fd] [color:#1565c0]" },
  COMPLETED:  { label: "Completed",  cls: "badge--completed [background:#e8f5e9] [color:#2e7d32]" },
  CANCELLED:  { label: "Cancelled",  cls: "badge--cancelled [background:#ffebee] [color:#c62828]" },
  PENDING:    { label: "Pending",    cls: "badge--pending [background:#fff8e1] [color:#f57f17]"   },
};

const ALL_STATUSES = ["SCHEDULED", "PENDING", "COMPLETED", "CANCELLED"];

/* ── Helpers ────────────────────────────────────────────────── */
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
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
};

const getServiceLabel = (services) => {
  if (!services || services.length === 0) return "—";
  return services.map((s) => SERVICE_MAP[s] ?? s).join(", ");
};

const today = new Date().toISOString().split("T")[0];

// DoctorResponse may nest names under .user or expose them directly
const getDoctorName = (d) => {
  if (!d) return "Unknown Doctor";
  const first = d.firstName ?? d.user?.firstName ?? "";
  const last  = d.lastName  ?? d.user?.lastName  ?? "";
  return `${first} ${last}`.trim() || "Unknown Doctor";
};

/* ── Delete Confirm Modal ───────────────────────────────────── */
function DeleteUserModal({ user, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState(null);

  const handleConfirm = async () => {
    try {
      setDeleting(true);
      setError(null);
      await userApi.deleteUser(user.id);
      onConfirm(user.id);
    } catch (err) {
      setError(err.message || "Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="dash-modal-overlay [position:fixed] [inset:0] [z-index:1000] [background:rgba(11,_36,_71,_0.45)] [backdrop-filter:blur(5px)] [display:flex] [align-items:center] [justify-content:center] [padding:1rem]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dash-modal [background:#fff] [border:1px_solid_#e3eaf5] [border-radius:20px] [width:100%] [max-width:480px] [box-shadow:0_24px_80px_rgba(11,_36,_71,_0.22)] [overflow:hidden] dash-modal--sm [max-width:380px] animate-slide-up">
        <div className="dash-modal__header [display:flex] [align-items:center] [justify-content:space-between] [padding:1.4rem_1.6rem_1.1rem] [border-bottom:1px_solid_#f0f4f8] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <h3 className="dash-modal__title [font-size:1rem] [font-weight:700] [color:#0b2447] [margin:0] [letter-spacing:-0.015em]">Delete User</h3>
          <button className="dash-modal__close [display:flex] [align-items:center] [justify-content:center] [width:30px] [height:30px] [border-radius:8px] [background:#f1f5f9] [border:none] [color:#607d8b] [cursor:pointer] [transition:background_0.15s,_color_0.15s] hover:[background:#e3eaf5] hover:[color:#0b2447]" onClick={onClose}><XIcon /></button>
        </div>
        <div className="dash-modal__body [padding:1.4rem_1.6rem] [display:flex] [flex-direction:column] [gap:1.1rem] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <p className="dash-modal__confirm-text [font-size:0.92rem] [color:#37474f] [line-height:1.6] [margin:0] [&_strong]:[color:#0b2447]">
            Are you sure you want to delete <strong>{user.firstName} {user.lastName}</strong>?
          </p>
          <p className="dash-modal__confirm-sub [font-size:0.8rem] [color:#90a4ae] [margin:0.3rem_0_0]">This action cannot be undone.</p>
          {error && <div className="dash-modal__error [margin:0_1.6rem] [padding:0.7rem_1rem] [background:#ffebee] [border:1px_solid_#ffcdd2] [border-radius:10px] [font-size:0.83rem] [color:#c62828] max-[640px]:[margin-left:1.25rem] max-[640px]:[margin-right:1.25rem]">{error}</div>}
        </div>
        <div className="dash-modal__footer [display:flex] [justify-content:flex-end] [gap:0.65rem] [padding:1rem_1.6rem_1.4rem] [border-top:1px_solid_#f0f4f8] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <button className="dash-modal__btn [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.85rem] [font-weight:600] [padding:0.6rem_1.25rem] [border-radius:10px] [border:none] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:transform_0.1s,_box-shadow_0.15s,_background_0.15s] disabled:[opacity:0.5] disabled:[cursor:not-allowed] disabled:[transform:none_!important] dash-modal__btn--cancel [background:#f1f5f9] [color:#455a64] [border:1.5px_solid_#e3eaf5] [&:hover:not(:disabled)]:[background:#e3eaf5]" onClick={onClose} disabled={deleting}>
            Keep
          </button>
          <button className="dash-modal__btn [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.85rem] [font-weight:600] [padding:0.6rem_1.25rem] [border-radius:10px] [border:none] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:transform_0.1s,_box-shadow_0.15s,_background_0.15s] disabled:[opacity:0.5] disabled:[cursor:not-allowed] disabled:[transform:none_!important] dash-modal__btn--danger [background:linear-gradient(135deg,_#c62828_0%,_#ef5350_100%)] [color:#fff] [box-shadow:0_4px_14px_rgba(198,_40,_40,_0.3)] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[box-shadow:0_6px_20px_rgba(198,_40,_40,_0.4)]" onClick={handleConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Appointment Modal ───────────────────────────────────────────── */
function DeleteAppointmentModal({ appointment, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState(null);

  const handleConfirm = async () => {
    try {
      setDeleting(true);
      setError(null);
      await appointmentApi.delete(appointment.id);  // ✅ uses DELETE endpoint
      onConfirm(appointment.id);
    } catch (err) {
      setError(err.message || "Failed to delete appointment.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="dash-modal-overlay [position:fixed] [inset:0] [z-index:1000] [background:rgba(11,_36,_71,_0.45)] [backdrop-filter:blur(5px)] [display:flex] [align-items:center] [justify-content:center] [padding:1rem]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dash-modal [background:#fff] [border:1px_solid_#e3eaf5] [border-radius:20px] [width:100%] [max-width:480px] [box-shadow:0_24px_80px_rgba(11,_36,_71,_0.22)] [overflow:hidden] dash-modal--sm [max-width:380px] animate-slide-up">
        <div className="dash-modal__header [display:flex] [align-items:center] [justify-content:space-between] [padding:1.4rem_1.6rem_1.1rem] [border-bottom:1px_solid_#f0f4f8] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <h3 className="dash-modal__title [font-size:1rem] [font-weight:700] [color:#0b2447] [margin:0] [letter-spacing:-0.015em]">Delete Appointment</h3>
          <button className="dash-modal__close [display:flex] [align-items:center] [justify-content:center] [width:30px] [height:30px] [border-radius:8px] [background:#f1f5f9] [border:none] [color:#607d8b] [cursor:pointer] [transition:background_0.15s,_color_0.15s] hover:[background:#e3eaf5] hover:[color:#0b2447]" onClick={onClose}><XIcon /></button>
        </div>
        <div className="dash-modal__body [padding:1.4rem_1.6rem] [display:flex] [flex-direction:column] [gap:1.1rem] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <p className="dash-modal__confirm-text [font-size:0.92rem] [color:#37474f] [line-height:1.6] [margin:0] [&_strong]:[color:#0b2447]">
            Are you sure you want to delete the{" "}
            <strong>{getServiceLabel(appointment.services)}</strong> appointment on{" "}
            <strong>{formatDate(appointment.date)}</strong>?
          </p>
          <p className="dash-modal__confirm-sub [font-size:0.8rem] [color:#90a4ae] [margin:0.3rem_0_0]">This action cannot be undone.</p>
          {error && <div className="dash-modal__error [margin:0_1.6rem] [padding:0.7rem_1rem] [background:#ffebee] [border:1px_solid_#ffcdd2] [border-radius:10px] [font-size:0.83rem] [color:#c62828] max-[640px]:[margin-left:1.25rem] max-[640px]:[margin-right:1.25rem]">{error}</div>}
        </div>
        <div className="dash-modal__footer [display:flex] [justify-content:flex-end] [gap:0.65rem] [padding:1rem_1.6rem_1.4rem] [border-top:1px_solid_#f0f4f8] max-[640px]:[padding-left:1.25rem] max-[640px]:[padding-right:1.25rem]">
          <button className="dash-modal__btn [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.85rem] [font-weight:600] [padding:0.6rem_1.25rem] [border-radius:10px] [border:none] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:transform_0.1s,_box-shadow_0.15s,_background_0.15s] disabled:[opacity:0.5] disabled:[cursor:not-allowed] disabled:[transform:none_!important] dash-modal__btn--cancel [background:#f1f5f9] [color:#455a64] [border:1.5px_solid_#e3eaf5] [&:hover:not(:disabled)]:[background:#e3eaf5]" onClick={onClose} disabled={deleting}>Keep</button>
          <button className="dash-modal__btn [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.85rem] [font-weight:600] [padding:0.6rem_1.25rem] [border-radius:10px] [border:none] [cursor:pointer] [font-family:DM_Sans,_sans-serif] [transition:transform_0.1s,_box-shadow_0.15s,_background_0.15s] disabled:[opacity:0.5] disabled:[cursor:not-allowed] disabled:[transform:none_!important] dash-modal__btn--danger [background:linear-gradient(135deg,_#c62828_0%,_#ef5350_100%)] [color:#fff] [box-shadow:0_4px_14px_rgba(198,_40,_40,_0.3)] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[box-shadow:0_6px_20px_rgba(198,_40,_40,_0.4)]" onClick={handleConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Admin Appointment Card ────────────────────────────────────────────── */
function AdminAppointmentCard({ appt, onDelete }) {
  const status = STATUS_STYLES[appt.status] ?? { label: appt.status, cls: "badge--pending [background:#fff8e1] [color:#f57f17]" };
  const canDelete = appt.status !== "COMPLETED";

  const patientFull = `${appt.patient?.firstName ?? ""} ${appt.patient?.lastName ?? ""}`.trim();
  const patientName = appt.patientName ?? patientFull ?? null;

  const doctorFull = `${appt.doctor?.firstName ?? ""} ${appt.doctor?.lastName ?? ""}`.trim();
  const rawName = appt.doctorName ?? doctorFull ?? null;

  return (
    <div className={`dash-appt-card [background:#f8fafc] [border:1px_solid_#e3eaf5] [border-radius:16px] [padding:1.1rem_1.25rem] [display:flex] [flex-direction:column] [gap:0.65rem] [transition:border-color_0.2s,_box-shadow_0.2s,_transform_0.15s] hover:[border-color:#90caf9] hover:[box-shadow:0_6px_24px_rgba(21,_101,_192,_0.1)] hover:[transform:translateY(-1px)] animate-fade-in dash-appt-card--${appt.status?.toLowerCase()}`}>
      <div className="dash-appt-card__top [display:flex] [align-items:center] [justify-content:space-between] [gap:0.5rem] [flex-wrap:wrap]">
        <span className={`dash-appt-badge [display:inline-block] [font-size:0.67rem] [font-weight:700] [letter-spacing:0.05em] [text-transform:uppercase] [padding:0.25rem_0.7rem] [border-radius:100px] ${status.cls}`}>{status.label}</span>
        {canDelete && (
          <button
            className="doc-offday-row__del [display:flex] [align-items:center] [justify-content:center] [width:30px] [height:30px] [border-radius:8px] [background:#ffebee] [border:1px_solid_#ffcdd2] [color:#c62828] [cursor:pointer] [transition:background_0.15s,_border-color_0.15s,_transform_0.1s] [flex-shrink:0] [&:hover:not(:disabled)]:[background:#ffcdd2] [&:hover:not(:disabled)]:[border-color:#ef9a9a] [&:hover:not(:disabled)]:[transform:scale(1.05)] disabled:[opacity:0.5] disabled:[cursor:not-allowed]"
            onClick={() => onDelete(appt)}
            title="Cancel appointment"
          >
            <TrashIcon />
          </button>
        )}
      </div>

      <div className="dash-appt-card__service [font-size:0.97rem] [font-weight:700] [color:#0b2447] [letter-spacing:-0.01em]">{getServiceLabel(appt.services)}</div>

      <div className="dash-appt-card__meta [display:flex] [flex-wrap:wrap] [gap:0.75rem]">
        <div className="dash-appt-card__meta-item [display:flex] [align-items:center] [gap:0.35rem] [font-size:0.8rem] [color:#607d8b] [&_svg]:[color:#90a4ae] [&_svg]:[flex-shrink:0]">
          <CalendarIcon /><span>{formatDate(appt.date)}</span>
        </div>
        <div className="dash-appt-card__meta-item [display:flex] [align-items:center] [gap:0.35rem] [font-size:0.8rem] [color:#607d8b] [&_svg]:[color:#90a4ae] [&_svg]:[flex-shrink:0]">
          <ClockIcon /><span>{formatTime(appt.startTime)}</span>
        </div>
      </div>

      <div className="admin-appt-card__people [display:flex] [flex-direction:column] [gap:0.3rem]">
        {patientName && (
          <div className="admin-appt-card__person [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.79rem] [font-weight:600] admin-appt-card__person--patient [color:#2e7d32]">
            <UserIcon /> {patientName}
          </div>
        )}
        {rawName && (
          <div className="admin-appt-card__person [display:inline-flex] [align-items:center] [gap:0.35rem] [font-size:0.79rem] [font-weight:600] admin-appt-card__person--doctor [color:#1565c0]">
            <StethoscopeIcon /> Dr. {rawName}
          </div>
        )}
      </div>

      {appt.concerns && (
        <div className="dash-appt-card__concerns [font-size:0.78rem] [color:#78909c] [line-height:1.5] [border-top:1px_solid_#e8edf3] [padding-top:0.6rem] [margin-top:0.1rem]">
          <span className="dash-appt-card__concerns-label [font-weight:600] [color:#455a64]">Notes:</span> {appt.concerns}
        </div>
      )}
    </div>
  );
}

/* ── Admin Appointments Tab ────────────────────────────────────────────── */
function AdminAppointmentsTab({ appointments, loading, error, onDelete }) {
  const [filter, setFilter] = useState("ALL");

  if (loading) return (
    <div className="dash-appts__loading [display:flex] [align-items:center] [gap:0.75rem] [padding:1.5rem_0] [font-size:0.9rem] [color:#607d8b]"><span className="dash-appts__spinner [display:inline-block] [width:16px] [height:16px] [border:2px_solid_#e3eaf5] [border-top-color:#1565c0] [border-radius:50%] animate-spin [flex-shrink:0]" /> Loading appointments…</div>
  );
  if (error) return <div className="dash-appts__error [display:flex] [align-items:center] [gap:0.75rem] [padding:1rem_1.25rem] [border-radius:12px] [font-size:0.88rem] [color:#c62828] [background:#ffebee] [border:1px_solid_#ffcdd2]">{error}</div>;

  const filtered = filter === "ALL"
    ? appointments
    : appointments.filter((a) => a.status === filter);

  const groups = {
    UPCOMING: filtered.filter((a) => a.status === "SCHEDULED" || a.status === "PENDING"),
    PAST:     filtered.filter((a) => a.status === "COMPLETED" || a.status === "CANCELLED"),
  };

  return (
    <div className="admin-tab-panel [display:flex] [flex-direction:column] [gap:1.5rem]">
      <div className="admin-filter-bar [display:flex] [flex-wrap:wrap] [gap:0.45rem]">
        {["ALL", ...ALL_STATUSES].map((s) => (
          <button
            key={s}
            className={`admin-filter-chip [display:inline-flex] [align-items:center] [gap:0.4rem] [padding:0.38rem_0.85rem] [border-radius:100px] [border:1.5px_solid_#e3eaf5] [background:#f8fafc] [font-family:DM_Sans,_sans-serif] [font-size:0.78rem] [font-weight:600] [color:#607d8b] [cursor:pointer] [white-space:nowrap] [transition:background_0.15s,_border-color_0.15s,_color_0.15s] hover:[background:#e3eaf5] hover:[color:#0b2447]${filter === s ? " admin-filter-chip--active [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [border-color:transparent] [color:#fff] hover:[background:linear-gradient(135deg,_#0d2d5c_0%,_#1976d2_100%)] hover:[color:#fff]" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s === "ALL" ? "All" : (STATUS_STYLES[s]?.label ?? s)}
            <span className="admin-filter-chip__count [display:inline-flex] [align-items:center] [justify-content:center] [min-width:18px] [height:18px] [padding:0_5px] [border-radius:100px] [font-size:0.65rem] [font-weight:700] [background:rgba(255,_255,_255,_0.22)] [color:inherit] [.admin-filter-chip:not(.admin-filter-chip--active)_&]:[background:#e3eaf5] [.admin-filter-chip:not(.admin-filter-chip--active)_&]:[color:#607d8b]">
              {s === "ALL"
                ? appointments.length
                : appointments.filter((a) => a.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="dash-appts__empty [display:flex] [flex-direction:column] [align-items:center] [gap:0.85rem] [padding:3rem_1rem] [text-align:center] [color:#90a4ae] [background:#f8fafc] [border:1.5px_dashed_#cfd8dc] [border-radius:14px] [&_svg]:[color:#b0bec5] [&_p]:[margin:0] [&_p]:[font-size:0.88rem] [&_p]:[font-weight:400]">
          <CalendarIcon /><p>No appointments match this filter.</p>
        </div>
      ) : (
        <>
          {groups.UPCOMING.length > 0 && (
            <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
              <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">Upcoming ({groups.UPCOMING.length})</div>
              <div className="dash-appts__grid [display:grid] [grid-template-columns:repeat(auto-fill,_minmax(260px,_1fr))] [gap:1rem] max-[640px]:[grid-template-columns:1fr]">
                {groups.UPCOMING.map((a) => (
                  <AdminAppointmentCard key={a.id} appt={a} onDelete={onDelete} />
                ))}
              </div>
            </div>
          )}
          {groups.PAST.length > 0 && (
            <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
              <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">Past ({groups.PAST.length})</div>
              <div className="dash-appts__grid [display:grid] [grid-template-columns:repeat(auto-fill,_minmax(260px,_1fr))] [gap:1rem] max-[640px]:[grid-template-columns:1fr]">
                {groups.PAST.map((a) => (
                  <AdminAppointmentCard key={a.id} appt={a} onDelete={onDelete} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
/* ── User Row ───────────────────────────────────────────────── */
function UserRow({ user, onDelete }) {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const isDoctor = user.role === "DOCTOR";
  const isPatient = user.role === "PATIENT";

  return (
    <div className="admin-user-row [display:flex] [align-items:center] [justify-content:space-between] [gap:1rem] [padding:0.85rem_1.1rem] [background:#f8fafc] [border:1px_solid_#e3eaf5] [border-radius:12px] [transition:border-color_0.15s,_box-shadow_0.15s] hover:[border-color:#90caf9] hover:[box-shadow:0_3px_12px_rgba(21,_101,_192,_0.08)]">
      <div className="admin-user-row__left [display:flex] [align-items:center] [gap:0.85rem] [min-width:0]">
        <div className={`admin-user-row__avatar [width:38px] [height:38px] [border-radius:50%] [font-size:0.76rem] [font-weight:700] [letter-spacing:0.03em] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [color:#fff] ${
          isDoctor
            ? "[background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)]"
            : isPatient
              ? "[background:linear-gradient(135deg,_#1b5e20_0%,_#43a047_100%)]"
              : "[background:linear-gradient(135deg,_#4a148c_0%,_#7b1fa2_100%)]"
        }`}>
          {initials}
        </div>
        <div className="admin-user-row__info [min-width:0]">
          <div className="admin-user-row__name [font-size:0.9rem] [font-weight:700] [color:#0b2447] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">
            {user.firstName} {user.lastName}
          </div>
          <div className="admin-user-row__email [font-size:0.76rem] [color:#78909c] [font-weight:400] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis] [max-width:220px] max-[640px]:[max-width:140px]">{user.email}</div>
        </div>
      </div>
      <div className="admin-user-row__right [display:flex] [align-items:center] [gap:0.65rem] [flex-shrink:0]">
        <span className={`admin-user-role-badge [display:inline-flex] [align-items:center] [gap:0.3rem] [padding:0.25rem_0.65rem] [border-radius:100px] [font-size:0.68rem] [font-weight:700] [letter-spacing:0.04em] [text-transform:uppercase] [white-space:nowrap] max-[640px]:[display:none] ${
          isDoctor
            ? "[background:#e3f2fd] [color:#1565c0]"
            : isPatient
              ? "[background:#e8f5e9] [color:#2e7d32]"
              : "[background:#f3e5f5] [color:#7b1fa2]"
        }`}>
          {isDoctor ? <StethoscopeIcon /> : isPatient ? <UserIcon /> : <ShieldIcon />}
          {user.role?.charAt(0) + user.role?.slice(1).toLowerCase()}
        </span>
        <button
          className="doc-offday-row__del [display:flex] [align-items:center] [justify-content:center] [width:30px] [height:30px] [border-radius:8px] [background:#ffebee] [border:1px_solid_#ffcdd2] [color:#c62828] [cursor:pointer] [transition:background_0.15s,_border-color_0.15s,_transform_0.1s] [flex-shrink:0] [&:hover:not(:disabled)]:[background:#ffcdd2] [&:hover:not(:disabled)]:[border-color:#ef9a9a] [&:hover:not(:disabled)]:[transform:scale(1.05)] disabled:[opacity:0.5] disabled:[cursor:not-allowed]"
          onClick={() => onDelete(user)}
          title="Delete user"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

/* ── Admin Users Tab ────────────────────────────────────────── */
function AdminUsersTab({ users, loading, error, onDelete }) {
  const [roleFilter, setRoleFilter] = useState("ALL");
  const { register, control } = useForm({
    mode: "onChange",
    defaultValues: { search: "" },
  });
  const search = useWatch({ control, name: "search" });

  if (loading) return (
    <div className="dash-appts__loading [display:flex] [align-items:center] [gap:0.75rem] [padding:1.5rem_0] [font-size:0.9rem] [color:#607d8b]"><span className="dash-appts__spinner [display:inline-block] [width:16px] [height:16px] [border:2px_solid_#e3eaf5] [border-top-color:#1565c0] [border-radius:50%] animate-spin [flex-shrink:0]" /> Loading users…</div>
  );
  if (error) return <div className="dash-appts__error [display:flex] [align-items:center] [gap:0.75rem] [padding:1rem_1.25rem] [border-radius:12px] [font-size:0.88rem] [color:#c62828] [background:#ffebee] [border:1px_solid_#ffcdd2]">{error}</div>;

  // Exclude admins
  const nonAdmins = users.filter((u) => u.role !== "ADMIN");

  const filtered = nonAdmins.filter((u) => {
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const doctors  = filtered.filter((u) => u.role === "DOCTOR");
  const patients = filtered.filter((u) => u.role === "PATIENT");

  return (
    <div className="admin-tab-panel [display:flex] [flex-direction:column] [gap:1.5rem]">
      <div className="admin-users__toolbar [display:flex] [align-items:center] [gap:0.75rem] [flex-wrap:wrap] max-[640px]:[flex-direction:column] max-[640px]:[align-items:stretch]">
        <input
          className="admin-users__search [flex:1] [min-width:180px] [background:#f8fafc] [border:1.5px_solid_#e3eaf5] [border-radius:10px] [padding:0.6rem_0.9rem] [font-family:DM_Sans,_sans-serif] [font-size:0.88rem] [color:#0b2447] [outline:none] [transition:border-color_0.15s,_box-shadow_0.15s] focus:[border-color:#1565c0] focus:[box-shadow:0_0_0_3px_rgba(21,_101,_192,_0.1)] focus:[background:#fff] placeholder:[color:#b0bec5]"
          type="text"
          placeholder="Search by name or email…"
          {...register("search")}
        />
        <div className="admin-filter-bar [display:flex] [flex-wrap:wrap] [gap:0.45rem] admin-filter-bar--inline [flex-wrap:nowrap] max-[640px]:[flex-wrap:wrap]">
          {["ALL", "DOCTOR", "PATIENT"].map((r) => (
            <button
              key={r}
              className={`admin-filter-chip [display:inline-flex] [align-items:center] [gap:0.4rem] [padding:0.38rem_0.85rem] [border-radius:100px] [border:1.5px_solid_#e3eaf5] [background:#f8fafc] [font-family:DM_Sans,_sans-serif] [font-size:0.78rem] [font-weight:600] [color:#607d8b] [cursor:pointer] [white-space:nowrap] [transition:background_0.15s,_border-color_0.15s,_color_0.15s] hover:[background:#e3eaf5] hover:[color:#0b2447]${roleFilter === r ? " admin-filter-chip--active [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [border-color:transparent] [color:#fff] hover:[background:linear-gradient(135deg,_#0d2d5c_0%,_#1976d2_100%)] hover:[color:#fff]" : ""}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === "ALL" ? "All" : r.charAt(0) + r.slice(1).toLowerCase()}
              <span className="admin-filter-chip__count [display:inline-flex] [align-items:center] [justify-content:center] [min-width:18px] [height:18px] [padding:0_5px] [border-radius:100px] [font-size:0.65rem] [font-weight:700] [background:rgba(255,_255,_255,_0.22)] [color:inherit] [.admin-filter-chip:not(.admin-filter-chip--active)_&]:[background:#e3eaf5] [.admin-filter-chip:not(.admin-filter-chip--active)_&]:[color:#607d8b]">
                {r === "ALL"
                  ? nonAdmins.length
                  : nonAdmins.filter((u) => u.role === r).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="dash-appts__empty [display:flex] [flex-direction:column] [align-items:center] [gap:0.85rem] [padding:3rem_1rem] [text-align:center] [color:#90a4ae] [background:#f8fafc] [border:1.5px_dashed_#cfd8dc] [border-radius:14px] [&_svg]:[color:#b0bec5] [&_p]:[margin:0] [&_p]:[font-size:0.88rem] [&_p]:[font-weight:400]">
          <UsersIcon /><p>No users match your search.</p>
        </div>
      ) : (
        <>
          {doctors.length > 0 && (
            <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
              <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">Doctors ({doctors.length})</div>
              <div className="admin-users__list [display:flex] [flex-direction:column] [gap:0.55rem]">
                {doctors.map((u) => <UserRow key={u.id} user={u} onDelete={onDelete} />)}
              </div>
            </div>
          )}
          {patients.length > 0 && (
            <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
              <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">Patients ({patients.length})</div>
              <div className="admin-users__list [display:flex] [flex-direction:column] [gap:0.55rem]">
                {patients.map((u) => <UserRow key={u.id} user={u} onDelete={onDelete} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Admin Off Days Tab ─────────────────────────────────────── */
function AdminOffDaysTab({ doctors, loading, error }) {
  const [overridesMap, setOverridesMap]       = useState({});
  const [overrideLoading, setOverrideLoading] = useState(true);
  const [overrideError, setOverrideError]     = useState(null);
  const [selectedDoctor, setSelectedDoctor]   = useState("ALL");
  const [deletingId, setDeletingId]           = useState(null);

  useEffect(() => {
    if (!doctors.length) {
      setOverridesMap({});
      setOverrideLoading(false);   // stop the spinner when there's nothing to fetch
      setOverrideError(null);
      return;
    }

    setOverrideLoading(true);
    Promise.all(
      doctors.map((d) =>
        scheduleApi.getOverrides(d.id)
          .then((data) => ({ id: d.id, data: Array.isArray(data) ? data : [] }))
          .catch(() => ({ id: d.id, data: [] }))
      )
    )
      .then((results) => {
        const map = {};
        results.forEach(({ id, data }) => { map[id] = data; });
        setOverridesMap(map);
      })
      .catch(() => setOverrideError("Failed to load off days."))
      .finally(() => setOverrideLoading(false));
  }, [doctors]);

  const handleDelete = async (doctorId, overrideId) => {
    try {
      setDeletingId(overrideId);
      await scheduleApi.deleteOverride(doctorId, overrideId);
      setOverridesMap((prev) => ({
        ...prev,
        [doctorId]: prev[doctorId].filter((o) => o.id !== overrideId),
      }));
    } catch (err) {
      alert(err.message || "Failed to remove off day.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading || overrideLoading) return (
    <div className="dash-appts__loading [display:flex] [align-items:center] [gap:0.75rem] [padding:1.5rem_0] [font-size:0.9rem] [color:#607d8b]"><span className="dash-appts__spinner [display:inline-block] [width:16px] [height:16px] [border:2px_solid_#e3eaf5] [border-top-color:#1565c0] [border-radius:50%] animate-spin [flex-shrink:0]" /> Loading off days…</div>
  );
  if (error || overrideError) return <div className="dash-appts__error [display:flex] [align-items:center] [gap:0.75rem] [padding:1rem_1.25rem] [border-radius:12px] [font-size:0.88rem] [color:#c62828] [background:#ffebee] [border:1px_solid_#ffcdd2]">{error || overrideError}</div>;

  // Flatten all off days, attach doctor info
  const allOffDays = doctors.flatMap((d) =>
    (overridesMap[d.id] ?? []).map((o) => ({ ...o, doctor: d }))
  );

  const filtered = selectedDoctor === "ALL"
    ? allOffDays
    : allOffDays.filter((o) => String(o.doctor.id) === String(selectedDoctor));

  const future = filtered.filter((o) => o.date >= today);
  const past   = filtered.filter((o) => o.date <  today);

  return (
    <div className="admin-tab-panel [display:flex] [flex-direction:column] [gap:1.5rem]">
      {/* Doctor filter */}
      <div className="admin-filter-bar [display:flex] [flex-wrap:wrap] [gap:0.45rem] admin-filter-bar--scroll [overflow-x:auto] [flex-wrap:nowrap] [padding-bottom:0.25rem] [scrollbar-width:none] [&::-webkit-scrollbar]:[display:none]">
        <button
          className={`admin-filter-chip [display:inline-flex] [align-items:center] [gap:0.4rem] [padding:0.38rem_0.85rem] [border-radius:100px] [border:1.5px_solid_#e3eaf5] [background:#f8fafc] [font-family:DM_Sans,_sans-serif] [font-size:0.78rem] [font-weight:600] [color:#607d8b] [cursor:pointer] [white-space:nowrap] [transition:background_0.15s,_border-color_0.15s,_color_0.15s] hover:[background:#e3eaf5] hover:[color:#0b2447]${selectedDoctor === "ALL" ? " admin-filter-chip--active [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [border-color:transparent] [color:#fff] hover:[background:linear-gradient(135deg,_#0d2d5c_0%,_#1976d2_100%)] hover:[color:#fff]" : ""}`}
          onClick={() => setSelectedDoctor("ALL")}
        >
          All Doctors
          <span className="admin-filter-chip__count [display:inline-flex] [align-items:center] [justify-content:center] [min-width:18px] [height:18px] [padding:0_5px] [border-radius:100px] [font-size:0.65rem] [font-weight:700] [background:rgba(255,_255,_255,_0.22)] [color:inherit] [.admin-filter-chip:not(.admin-filter-chip--active)_&]:[background:#e3eaf5] [.admin-filter-chip:not(.admin-filter-chip--active)_&]:[color:#607d8b]">{allOffDays.length}</span>
        </button>
        {doctors.map((d) => (
          <button
            key={d.id}
            className={`admin-filter-chip [display:inline-flex] [align-items:center] [gap:0.4rem] [padding:0.38rem_0.85rem] [border-radius:100px] [border:1.5px_solid_#e3eaf5] [background:#f8fafc] [font-family:DM_Sans,_sans-serif] [font-size:0.78rem] [font-weight:600] [color:#607d8b] [cursor:pointer] [white-space:nowrap] [transition:background_0.15s,_border-color_0.15s,_color_0.15s] hover:[background:#e3eaf5] hover:[color:#0b2447]${String(selectedDoctor) === String(d.id) ? " admin-filter-chip--active [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [border-color:transparent] [color:#fff] hover:[background:linear-gradient(135deg,_#0d2d5c_0%,_#1976d2_100%)] hover:[color:#fff]" : ""}`}
            onClick={() => setSelectedDoctor(d.id)}
          >
            Dr. {getDoctorName(d)}
            <span className="admin-filter-chip__count [display:inline-flex] [align-items:center] [justify-content:center] [min-width:18px] [height:18px] [padding:0_5px] [border-radius:100px] [font-size:0.65rem] [font-weight:700] [background:rgba(255,_255,_255,_0.22)] [color:inherit] [.admin-filter-chip:not(.admin-filter-chip--active)_&]:[background:#e3eaf5] [.admin-filter-chip:not(.admin-filter-chip--active)_&]:[color:#607d8b]">
              {(overridesMap[d.id] ?? []).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="dash-appts__empty [display:flex] [flex-direction:column] [align-items:center] [gap:0.85rem] [padding:3rem_1rem] [text-align:center] [color:#90a4ae] [background:#f8fafc] [border:1.5px_dashed_#cfd8dc] [border-radius:14px] [&_svg]:[color:#b0bec5] [&_p]:[margin:0] [&_p]:[font-size:0.88rem] [&_p]:[font-weight:400]">
          <BanIcon /><p>No off days scheduled.</p>
        </div>
      ) : (
        <>
          {future.length > 0 && (
            <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
              <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">Upcoming Off Days ({future.length})</div>
              <div className="doc-offdays__list [display:flex] [flex-direction:column] [gap:0.6rem]">
                {future.map((o) => (
                  <AdminOffDayRow
                    key={o.id}
                    override={o}
                    onDelete={() => handleDelete(o.doctor.id, o.id)}
                    deleting={deletingId === o.id}
                  />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div className="dash-appts__group [margin-bottom:1.75rem] [&:last-child]:[margin-bottom:0]">
              <div className="dash-appts__group-label [font-size:0.7rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase] [color:#607d8b] [margin:0.85rem_0]">Past Off Days ({past.length})</div>
              <div className="doc-offdays__list [display:flex] [flex-direction:column] [gap:0.6rem]">
                {past.map((o) => (
                  <AdminOffDayRow key={o.id} override={o} onDelete={null} deleting={false} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Admin Off Day Row ──────────────────────────────────────── */
function AdminOffDayRow({ override, onDelete, deleting }) {
  const doctorName = override.doctor ? `Dr. ${getDoctorName(override.doctor)}` : null;

  return (
    <div className="doc-offday-row [display:flex] [align-items:center] [justify-content:space-between] [gap:1rem] [padding:0.85rem_1.1rem] [background:#f8fafc] [border:1px_solid_#e3eaf5] [border-radius:12px] [transition:border-color_0.15s,_box-shadow_0.15s] hover:[border-color:#90caf9] hover:[box-shadow:0_3px_12px_rgba(21,_101,_192,_0.08)] admin-offday-row">
      <div className="doc-offday-row__left [display:flex] [align-items:center] [gap:0.75rem]">
        <div className="doc-offday-row__icon [width:34px] [height:34px] [border-radius:9px] [background:#fff3e0] [border:1px_solid_#ffe0b2] [color:#e65100] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0]"><BanIcon /></div>
        <div>
          <div className="doc-offday-row__date [font-size:0.88rem] [font-weight:700] [color:#0b2447]">{formatDate(override.date)}</div>
          {doctorName && (
            <div className="admin-offday-row__doctor [font-size:0.78rem] [font-weight:600] [color:#1565c0] [margin-top:1px]">{doctorName}</div>
          )}
          {override.reason && (
            <div className="doc-offday-row__reason [font-size:0.75rem] [color:#78909c] [font-weight:400] [margin-top:2px]">{override.reason}</div>
          )}
        </div>
      </div>
      {onDelete && (
        <button
          className="doc-offday-row__del [display:flex] [align-items:center] [justify-content:center] [width:30px] [height:30px] [border-radius:8px] [background:#ffebee] [border:1px_solid_#ffcdd2] [color:#c62828] [cursor:pointer] [transition:background_0.15s,_border-color_0.15s,_transform_0.1s] [flex-shrink:0] [&:hover:not(:disabled)]:[background:#ffcdd2] [&:hover:not(:disabled)]:[border-color:#ef9a9a] [&:hover:not(:disabled)]:[transform:scale(1.05)] disabled:[opacity:0.5] disabled:[cursor:not-allowed]"
          onClick={onDelete}
          disabled={deleting}
          title="Remove off day"
        >
          {deleting
            ? <span className="dash-appts__spinner [display:inline-block] [border:2px_solid_#e3eaf5] [border-top-color:#1565c0] [border-radius:50%] animate-spin h-3 w-3 [flex-shrink:0]" />
            : <TrashIcon />}
        </button>
      )}
    </div>
  );
}

/* ── Admin Section (main export) ────────────────────────────── */
export default function AdminSection() {
  const [tab, setTab] = useState("appointments");

  // Appointments
  const [appointments, setAppointments]     = useState([]);
  const [apptLoading, setApptLoading]       = useState(true);
  const [apptError, setApptError]           = useState(null);

  // Users
  const [users, setUsers]                   = useState([]);
  const [usersLoading, setUsersLoading]     = useState(true);
  const [usersError, setUsersError]         = useState(null);
  const [deleteTarget, setDeleteTarget]         = useState(null);
  const [apptDeleteTarget, setApptDeleteTarget] = useState(null);

  // Doctors (for off-days tab)
  const [doctors, setDoctors]               = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError]     = useState(null);

  useEffect(() => {
    // Load all doctors' appointments by fetching each doctor then their appointments
    doctorApi.getAll()
      .then(async (docs) => {
        setDoctors(Array.isArray(docs) ? docs : []);
        setDoctorsLoading(false);

        // Fetch appointments for every doctor, flatten
        const allAppts = await Promise.all(
          (Array.isArray(docs) ? docs : []).map((d) =>
            appointmentApi.getByDoctor(d.id).catch(() => [])
          )
        );
        const flat = allAppts.flat();
        // Deduplicate by id (in case of overlap)
        const unique = [...new Map(flat.map((a) => [a.id, a])).values()];
        unique.sort((a, b) => a.date?.localeCompare(b.date) || 0);
        setAppointments(unique);
      })
      .catch((err) => {
        setApptError(err.message || "Failed to load appointments.");
        setDoctorsError(err.message || "Failed to load doctors.");
        setDoctorsLoading(false);
      })
      .finally(() => setApptLoading(false));

    // Load all users
    userApi.getAllUsers
      ? userApi.getAllUsers()
          .then((data) => setUsers(Array.isArray(data) ? data : []))
          .catch((err) => setUsersError(err.message || "Failed to load users."))
          .finally(() => setUsersLoading(false))
      // fallback: the api file exposes no getAllUsers — use authRequest directly via /users
      : fetch("http://13.236.134.79:8080/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        })
          .then((r) => r.json())
          .then((data) => setUsers(Array.isArray(data) ? data : []))
          .catch((err) => setUsersError(err.message || "Failed to load users."))
          .finally(() => setUsersLoading(false));
  }, []);

  const handleApptDeleted = (id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setApptDeleteTarget(null);
  };

  const handleUserDeleted = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteTarget(null);
  };

  const nonAdmins = users.filter((u) => u.role !== "ADMIN");
  const upcoming  = appointments.filter((a) => a.status === "SCHEDULED" || a.status === "PENDING");

  return (
    <>
      {/* ── Tab bar ── */}
      <div className="doc-tabs [display:flex] [gap:0.5rem] [flex-wrap:wrap] max-[640px]:[gap:0.4rem]">
        <button
          className={`dash-tab [display:inline-flex] [align-items:center] [gap:0.45rem] [padding:0.6rem_1.1rem] [border-radius:50px] [border:1.5px_solid_rgba(255,255,255,0.25)] [background:rgba(255,255,255,0.1)] [color:rgba(255,255,255,0.75)] [font-family:DM_Sans,_sans-serif] [font-size:0.86rem] [font-weight:500] [cursor:pointer] [transition:border-color_0.18s,_color_0.18s,_box-shadow_0.18s] [backdrop-filter:blur(6px)] hover:[color:#fff] focus-visible:[outline:2px_solid_#fff] focus-visible:[outline-offset:3px] max-[640px]:[font-size:0.8rem] max-[640px]:[padding:0.5rem_0.85rem]${tab === "appointments" ? " dash-tab--active" : ""}`}
          style={tab === "appointments" ? {
            background: "rgba(255,255,255,0.1)",
            color: "#fff",
            borderColor: "#fff",
            fontWeight: 600,
            boxShadow: "0 0 0 2px rgba(255,255,255,0.35)",
          } : undefined}
          aria-pressed={tab === "appointments"}
          onClick={() => setTab("appointments")}
        >
          <CalendarIcon />
          Appointments
          {upcoming.length > 0 && (
            <span className="doc-tab__badge [display:inline-flex] [align-items:center] [justify-content:center] [min-width:18px] [height:18px] [padding:0_5px] [border-radius:100px] [font-size:0.65rem] [font-weight:700] [background:#e3f2fd] [color:#1565c0]">{upcoming.length}</span>
          )}
        </button>

        <button
          className={`dash-tab [display:inline-flex] [align-items:center] [gap:0.45rem] [padding:0.6rem_1.1rem] [border-radius:50px] [border:1.5px_solid_rgba(255,255,255,0.25)] [background:rgba(255,255,255,0.1)] [color:rgba(255,255,255,0.75)] [font-family:DM_Sans,_sans-serif] [font-size:0.86rem] [font-weight:500] [cursor:pointer] [transition:border-color_0.18s,_color_0.18s,_box-shadow_0.18s] [backdrop-filter:blur(6px)] hover:[color:#fff] focus-visible:[outline:2px_solid_#fff] focus-visible:[outline-offset:3px] max-[640px]:[font-size:0.8rem] max-[640px]:[padding:0.5rem_0.85rem]${tab === "users" ? " dash-tab--active" : ""}`}
          style={tab === "users" ? {
            background: "rgba(255,255,255,0.1)",
            color: "#fff",
            borderColor: "#fff",
            fontWeight: 600,
            boxShadow: "0 0 0 2px rgba(255,255,255,0.35)",
          } : undefined}
          aria-pressed={tab === "users"}
          onClick={() => setTab("users")}
        >
          <UsersIcon />
          Users
          {nonAdmins.length > 0 && (
            <span className="doc-tab__badge [display:inline-flex] [align-items:center] [justify-content:center] [min-width:18px] [height:18px] [padding:0_5px] [border-radius:100px] [font-size:0.65rem] [font-weight:700] [background:#e3f2fd] [color:#1565c0]">{nonAdmins.length}</span>
          )}
        </button>

        <button
          className={`dash-tab [display:inline-flex] [align-items:center] [gap:0.45rem] [padding:0.6rem_1.1rem] [border-radius:50px] [border:1.5px_solid_rgba(255,255,255,0.25)] [background:rgba(255,255,255,0.1)] [color:rgba(255,255,255,0.75)] [font-family:DM_Sans,_sans-serif] [font-size:0.86rem] [font-weight:500] [cursor:pointer] [transition:border-color_0.18s,_color_0.18s,_box-shadow_0.18s] [backdrop-filter:blur(6px)] hover:[color:#fff] focus-visible:[outline:2px_solid_#fff] focus-visible:[outline-offset:3px] max-[640px]:[font-size:0.8rem] max-[640px]:[padding:0.5rem_0.85rem]${tab === "offdays" ? " dash-tab--active" : ""}`}
          style={tab === "offdays" ? {
            background: "rgba(255,255,255,0.1)",
            color: "#fff",
            borderColor: "#fff",
            fontWeight: 600,
            boxShadow: "0 0 0 2px rgba(255,255,255,0.35)",
          } : undefined}
          aria-pressed={tab === "offdays"}
          onClick={() => setTab("offdays")}
        >
          <BanIcon />
          Off Days
        </button>
      </div>

      <div className="doc-section [background:#fff] [border-radius:22px] [box-shadow:0_24px_80px_rgba(11,_36,_71,_0.22)] [overflow:hidden] [scroll-margin-top:80px]">
        {/* ── Panels ── */}
        <div className="doc-panel [padding:1.75rem_2.5rem_2.25rem] max-[640px]:[padding:1.5rem_1.25rem_2rem]">
          {tab === "appointments" && (
            <AdminAppointmentsTab
              appointments={appointments}
              loading={apptLoading}
              error={apptError}
              onDelete={setApptDeleteTarget}
            />
          )}
          {tab === "users" && (
            <AdminUsersTab
              users={users}
              loading={usersLoading}
              error={usersError}
              onDelete={setDeleteTarget}
            />
          )}
          {tab === "offdays" && (
            <AdminOffDaysTab
              doctors={doctors}
              loading={doctorsLoading}
              error={doctorsError}
            />
          )}
        </div>
      </div>

      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleUserDeleted}
        />
      )}
      {apptDeleteTarget && (
        <DeleteAppointmentModal
          appointment={apptDeleteTarget}
          onClose={() => setApptDeleteTarget(null)}
          onConfirm={handleApptDeleted}
        />
      )}
    </>
  );
}