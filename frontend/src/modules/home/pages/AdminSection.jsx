import { useState, useEffect } from "react";
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
  SCHEDULED: { label: "Scheduled", cls: "badge--scheduled" },
  COMPLETED:  { label: "Completed",  cls: "badge--completed" },
  CANCELLED:  { label: "Cancelled",  cls: "badge--cancelled" },
  PENDING:    { label: "Pending",    cls: "badge--pending"   },
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
    <div className="dash-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dash-modal dash-modal--sm">
        <div className="dash-modal__header">
          <h3 className="dash-modal__title">Delete User</h3>
          <button className="dash-modal__close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="dash-modal__body">
          <p className="dash-modal__confirm-text">
            Are you sure you want to delete <strong>{user.firstName} {user.lastName}</strong>?
          </p>
          <p className="dash-modal__confirm-sub">This action cannot be undone.</p>
          {error && <div className="dash-modal__error">{error}</div>}
        </div>
        <div className="dash-modal__footer">
          <button className="dash-modal__btn dash-modal__btn--cancel" onClick={onClose} disabled={deleting}>
            Keep
          </button>
          <button className="dash-modal__btn dash-modal__btn--danger" onClick={handleConfirm} disabled={deleting}>
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
    <div className="dash-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dash-modal dash-modal--sm">
        <div className="dash-modal__header">
          <h3 className="dash-modal__title">Delete Appointment</h3>
          <button className="dash-modal__close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="dash-modal__body">
          <p className="dash-modal__confirm-text">
            Are you sure you want to delete the{" "}
            <strong>{getServiceLabel(appointment.services)}</strong> appointment on{" "}
            <strong>{formatDate(appointment.date)}</strong>?
          </p>
          <p className="dash-modal__confirm-sub">This action cannot be undone.</p>
          {error && <div className="dash-modal__error">{error}</div>}
        </div>
        <div className="dash-modal__footer">
          <button className="dash-modal__btn dash-modal__btn--cancel" onClick={onClose} disabled={deleting}>Keep</button>
          <button className="dash-modal__btn dash-modal__btn--danger" onClick={handleConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Admin Appointment Card ────────────────────────────────────────────── */
function AdminAppointmentCard({ appt, onDelete }) {
  const status = STATUS_STYLES[appt.status] ?? { label: appt.status, cls: "badge--pending" };
  const canDelete = appt.status !== "COMPLETED";

  const patientFull = `${appt.patient?.firstName ?? ""} ${appt.patient?.lastName ?? ""}`.trim();
  const patientName = appt.patientName ?? patientFull ?? null;

  const doctorFull = `${appt.doctor?.firstName ?? ""} ${appt.doctor?.lastName ?? ""}`.trim();
  const rawName = appt.doctorName ?? doctorFull ?? null;

  return (
    <div className={`dash-appt-card dash-appt-card--${appt.status?.toLowerCase()}`}>
      <div className="dash-appt-card__top">
        <span className={`dash-appt-badge ${status.cls}`}>{status.label}</span>
        {canDelete && (
          <button
            className="doc-offday-row__del"
            onClick={() => onDelete(appt)}
            title="Cancel appointment"
          >
            <TrashIcon />
          </button>
        )}
      </div>

      <div className="dash-appt-card__service">{getServiceLabel(appt.services)}</div>

      <div className="dash-appt-card__meta">
        <div className="dash-appt-card__meta-item">
          <CalendarIcon /><span>{formatDate(appt.date)}</span>
        </div>
        <div className="dash-appt-card__meta-item">
          <ClockIcon /><span>{formatTime(appt.startTime)}</span>
        </div>
      </div>

      <div className="admin-appt-card__people">
        {patientName && (
          <div className="admin-appt-card__person admin-appt-card__person--patient">
            <UserIcon /> {patientName}
          </div>
        )}
        {rawName && (
          <div className="admin-appt-card__person admin-appt-card__person--doctor">
            <StethoscopeIcon /> Dr. {rawName}
          </div>
        )}
      </div>

      {appt.concerns && (
        <div className="dash-appt-card__concerns">
          <span className="dash-appt-card__concerns-label">Notes:</span> {appt.concerns}
        </div>
      )}
    </div>
  );
}

/* ── Admin Appointments Tab ────────────────────────────────────────────── */
function AdminAppointmentsTab({ appointments, loading, error, onDelete }) {
  const [filter, setFilter] = useState("ALL");

  if (loading) return (
    <div className="dash-appts__loading"><span className="dash-appts__spinner" /> Loading appointments…</div>
  );
  if (error) return <div className="dash-appts__error">{error}</div>;

  const filtered = filter === "ALL"
    ? appointments
    : appointments.filter((a) => a.status === filter);

  const groups = {
    UPCOMING: filtered.filter((a) => a.status === "SCHEDULED" || a.status === "PENDING"),
    PAST:     filtered.filter((a) => a.status === "COMPLETED" || a.status === "CANCELLED"),
  };

  return (
    <div className="admin-tab-panel">
      <div className="admin-filter-bar">
        {["ALL", ...ALL_STATUSES].map((s) => (
          <button
            key={s}
            className={`admin-filter-chip${filter === s ? " admin-filter-chip--active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s === "ALL" ? "All" : (STATUS_STYLES[s]?.label ?? s)}
            <span className="admin-filter-chip__count">
              {s === "ALL"
                ? appointments.length
                : appointments.filter((a) => a.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="dash-appts__empty">
          <CalendarIcon /><p>No appointments match this filter.</p>
        </div>
      ) : (
        <>
          {groups.UPCOMING.length > 0 && (
            <div className="dash-appts__group">
              <div className="dash-appts__group-label">Upcoming ({groups.UPCOMING.length})</div>
              <div className="dash-appts__grid">
                {groups.UPCOMING.map((a) => (
                  <AdminAppointmentCard key={a.id} appt={a} onDelete={onDelete} />
                ))}
              </div>
            </div>
          )}
          {groups.PAST.length > 0 && (
            <div className="dash-appts__group">
              <div className="dash-appts__group-label">Past ({groups.PAST.length})</div>
              <div className="dash-appts__grid">
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
    <div className="admin-user-row">
      <div className="admin-user-row__left">
        <div className={`admin-user-row__avatar admin-user-row__avatar--${user.role?.toLowerCase()}`}>
          {initials}
        </div>
        <div className="admin-user-row__info">
          <div className="admin-user-row__name">
            {user.firstName} {user.lastName}
          </div>
          <div className="admin-user-row__email">{user.email}</div>
        </div>
      </div>
      <div className="admin-user-row__right">
        <span className={`admin-user-role-badge admin-user-role-badge--${user.role?.toLowerCase()}`}>
          {isDoctor ? <StethoscopeIcon /> : isPatient ? <UserIcon /> : <ShieldIcon />}
          {user.role?.charAt(0) + user.role?.slice(1).toLowerCase()}
        </span>
        <button
          className="doc-offday-row__del"
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
  const [search, setSearch]         = useState("");

  if (loading) return (
    <div className="dash-appts__loading"><span className="dash-appts__spinner" /> Loading users…</div>
  );
  if (error) return <div className="dash-appts__error">{error}</div>;

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
    <div className="admin-tab-panel">
      <div className="admin-users__toolbar">
        <input
          className="admin-users__search"
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="admin-filter-bar admin-filter-bar--inline">
          {["ALL", "DOCTOR", "PATIENT"].map((r) => (
            <button
              key={r}
              className={`admin-filter-chip${roleFilter === r ? " admin-filter-chip--active" : ""}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === "ALL" ? "All" : r.charAt(0) + r.slice(1).toLowerCase()}
              <span className="admin-filter-chip__count">
                {r === "ALL"
                  ? nonAdmins.length
                  : nonAdmins.filter((u) => u.role === r).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="dash-appts__empty">
          <UsersIcon /><p>No users match your search.</p>
        </div>
      ) : (
        <>
          {doctors.length > 0 && (
            <div className="dash-appts__group">
              <div className="dash-appts__group-label">Doctors ({doctors.length})</div>
              <div className="admin-users__list">
                {doctors.map((u) => <UserRow key={u.id} user={u} onDelete={onDelete} />)}
              </div>
            </div>
          )}
          {patients.length > 0 && (
            <div className="dash-appts__group">
              <div className="dash-appts__group-label">Patients ({patients.length})</div>
              <div className="admin-users__list">
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
    <div className="dash-appts__loading"><span className="dash-appts__spinner" /> Loading off days…</div>
  );
  if (error || overrideError) return <div className="dash-appts__error">{error || overrideError}</div>;

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
    <div className="admin-tab-panel">
      {/* Doctor filter */}
      <div className="admin-filter-bar admin-filter-bar--scroll">
        <button
          className={`admin-filter-chip${selectedDoctor === "ALL" ? " admin-filter-chip--active" : ""}`}
          onClick={() => setSelectedDoctor("ALL")}
        >
          All Doctors
          <span className="admin-filter-chip__count">{allOffDays.length}</span>
        </button>
        {doctors.map((d) => (
          <button
            key={d.id}
            className={`admin-filter-chip${String(selectedDoctor) === String(d.id) ? " admin-filter-chip--active" : ""}`}
            onClick={() => setSelectedDoctor(d.id)}
          >
            Dr. {getDoctorName(d)}
            <span className="admin-filter-chip__count">
              {(overridesMap[d.id] ?? []).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="dash-appts__empty">
          <BanIcon /><p>No off days scheduled.</p>
        </div>
      ) : (
        <>
          {future.length > 0 && (
            <div className="dash-appts__group">
              <div className="dash-appts__group-label">Upcoming Off Days ({future.length})</div>
              <div className="doc-offdays__list">
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
            <div className="dash-appts__group">
              <div className="dash-appts__group-label">Past Off Days ({past.length})</div>
              <div className="doc-offdays__list">
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
    <div className="doc-offday-row admin-offday-row">
      <div className="doc-offday-row__left">
        <div className="doc-offday-row__icon"><BanIcon /></div>
        <div>
          <div className="doc-offday-row__date">{formatDate(override.date)}</div>
          {doctorName && (
            <div className="admin-offday-row__doctor">{doctorName}</div>
          )}
          {override.reason && (
            <div className="doc-offday-row__reason">{override.reason}</div>
          )}
        </div>
      </div>
      {onDelete && (
        <button
          className="doc-offday-row__del"
          onClick={onDelete}
          disabled={deleting}
          title="Remove off day"
        >
          {deleting
            ? <span className="dash-appts__spinner" style={{ width: 12, height: 12 }} />
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
      <div className="doc-section">
        {/* ── Tab bar ── */}
        <div className="doc-tabs">
          <button
            className={`doc-tab${tab === "appointments" ? " doc-tab--active" : ""}`}
            onClick={() => setTab("appointments")}
          >
            <CalendarIcon />
            Appointments
            {upcoming.length > 0 && (
              <span className="doc-tab__badge">{upcoming.length}</span>
            )}
          </button>

          <button
            className={`doc-tab${tab === "users" ? " doc-tab--active" : ""}`}
            onClick={() => setTab("users")}
          >
            <UsersIcon />
            Users
            {nonAdmins.length > 0 && (
              <span className="doc-tab__badge">{nonAdmins.length}</span>
            )}
          </button>

          <button
            className={`doc-tab${tab === "offdays" ? " doc-tab--active" : ""}`}
            onClick={() => setTab("offdays")}
          >
            <BanIcon />
            Off Days
          </button>
        </div>

        {/* ── Panels ── */}
        <div className="doc-panel">
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