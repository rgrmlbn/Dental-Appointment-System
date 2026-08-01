import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.js";
import { userApi } from "../../../app/api.js";
import "./ProfilePage.css";

/* ── Icons ──────────────────────────────────────────────────── */

const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const EyeIcon = ({ show }) => show ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Helpers ────────────────────────────────────────────────── */
const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"];

function Field({ label, name, value, onChange, type = "text", options, error, placeholder }) {
  if (options) {
    return (
      <div className="pf-field">
        <label className="pf-field__label">{label}</label>
        <select className={`pf-field__input${error ? " pf-field__input--err" : ""}`} name={name} value={value ?? ""} onChange={onChange}>
          <option value="">Select…</option>
          {options.map(o => <option key={o} value={o}>{o.charAt(0) + o.slice(1).toLowerCase()}</option>)}
        </select>
        {error && <span className="pf-field__error">{error}</span>}
      </div>
    );
  }
  return (
    <div className="pf-field">
      <label className="pf-field__label">{label}</label>
      <input
        className={`pf-field__input${error ? " pf-field__input--err" : ""}`}
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <span className="pf-field__error">{error}</span>}
    </div>
  );
}

function PasswordField({ label, name, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="pf-field">
      <label className="pf-field__label">{label}</label>
      <div className="pf-field__pw-wrap">
        <input
          className={`pf-field__input pf-field__input--pw${error ? " pf-field__input--err" : ""}`}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete="new-password"
        />
        <button type="button" className="pf-field__eye" onClick={() => setShow(s => !s)} tabIndex={-1}>
          <EyeIcon show={show} />
        </button>
      </div>
      {error && <span className="pf-field__error">{error}</span>}
    </div>
  );
}

/* ── Section components ─────────────────────────────────────── */
function Toast({ msg, ok }) {
  if (!msg) return null;
  return (
    <div className={`pf-toast${ok ? " pf-toast--ok" : " pf-toast--err"}`}>
      {ok && <CheckIcon />} {msg}
    </div>
  );
}

function UpdateSection({ user }) {
  const [form, setForm] = useState({
    firstName: user.firstName ?? "",
    middleName: user.middleName ?? "",
    lastName: user.lastName ?? "",
    suffix: user.suffix ?? "",
    gender: user.gender ?? "",
    dateOfBirth: user.dateOfBirth ?? "",
    contactNumber: user.contactNumber ?? "",
    street: user.street ?? "",
    barangay: user.barangay ?? "",
    city: user.city ?? "",
    province: user.province ?? "",
    postalCode: user.postalCode ?? "",
    email: user.email ?? "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (form.firstName && form.firstName.length < 2) errs.firstName = "Min 2 characters";
    if (form.lastName && form.lastName.length < 2) errs.lastName = "Min 2 characters";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (form.contactNumber && !/^\+?[1-9]\d{1,14}$/.test(form.contactNumber)) errs.contactNumber = "Invalid phone number";
    return errs;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const body = {};
      Object.entries(form).forEach(([k, v]) => { if (v !== "") body[k] = v; });
      await userApi.updateUser(user.id, body);
      setToast({ msg: "Profile updated successfully.", ok: true });
    } catch (e) {
      setToast({ msg: e.message, ok: false });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <section className="pf-section">
      <div className="pf-section__header">
        <span className="pf-section__icon"><EditIcon /></span>
        <div>
          <h2 className="pf-section__title">Personal Information</h2>
          <p className="pf-section__sub">Update your profile details below.</p>
        </div>
      </div>
      <Toast {...(toast ?? {})} msg={toast?.msg} ok={toast?.ok} />
      <div className="pf-grid pf-grid--2">
        <Field label="First Name" name="firstName" value={form.firstName} onChange={handle} error={errors.firstName} />
        <Field label="Middle Name" name="middleName" value={form.middleName} onChange={handle} />
        <Field label="Last Name" name="lastName" value={form.lastName} onChange={handle} error={errors.lastName} />
        <Field label="Suffix" name="suffix" value={form.suffix} onChange={handle} placeholder="Jr., Sr., III…" />
        <Field label="Gender" name="gender" value={form.gender} onChange={handle} options={GENDER_OPTIONS} />
        <Field label="Date of Birth" name="dateOfBirth" value={form.dateOfBirth} onChange={handle} type="date" />
        <Field label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handle} error={errors.contactNumber} placeholder="+639XXXXXXXXX" />
        <Field label="Email" name="email" value={form.email} onChange={handle} type="email" error={errors.email} />
      </div>
      <div className="pf-section__divider" />
      <p className="pf-section__group-label">Address</p>
      <div className="pf-grid pf-grid--2">
        <Field label="Street" name="street" value={form.street} onChange={handle} />
        <Field label="Barangay" name="barangay" value={form.barangay} onChange={handle} />
        <Field label="City" name="city" value={form.city} onChange={handle} />
        <Field label="Province" name="province" value={form.province} onChange={handle} />
        <Field label="Postal Code" name="postalCode" value={form.postalCode} onChange={handle} />
      </div>
      <div className="pf-section__actions">
        <button className="pf-btn pf-btn--primary" onClick={submit} disabled={loading}>
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </section>
  );
}

function ChangePasswordSection({ user }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = "Required";
    if (!form.newPassword) errs.newPassword = "Required";
    else if (form.newPassword.length < 8) errs.newPassword = "Min 8 characters";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(form.newPassword))
      errs.newPassword = "Must include uppercase, lowercase, digit & special character";
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await userApi.changePassword(user.id, form);
      setToast({ msg: "Password changed. You may need to log in again.", ok: true });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      setToast({ msg: e.message, ok: false });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <section className="pf-section">
      <div className="pf-section__header">
        <span className="pf-section__icon"><LockIcon /></span>
        <div>
          <h2 className="pf-section__title">Change Password</h2>
          <p className="pf-section__sub">Use a strong password you don't use elsewhere.</p>
        </div>
      </div>
      <Toast msg={toast?.msg} ok={toast?.ok} />
      <div className="pf-grid pf-grid--1">
        <PasswordField label="Current Password" name="currentPassword" value={form.currentPassword} onChange={handle} error={errors.currentPassword} />
        <PasswordField label="New Password" name="newPassword" value={form.newPassword} onChange={handle} error={errors.newPassword} />
        <PasswordField label="Confirm New Password" name="confirmPassword" value={form.confirmPassword} onChange={handle} error={errors.confirmPassword} />
      </div>
      <div className="pf-section__actions">
        <button className="pf-btn pf-btn--primary" onClick={submit} disabled={loading}>
          {loading ? "Updating…" : "Update Password"}
        </button>
      </div>
    </section>
  );
}

function DeleteSection({ user, onDeleted }) {
  const [confirm, setConfirm] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (confirm !== "DELETE") { setError('Type DELETE to confirm'); return; }
    setLoading(true);
    try {
      await userApi.deleteUser(user.id);
      onDeleted();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <section className="pf-section pf-section--danger">
      <div className="pf-section__header">
        <span className="pf-section__icon pf-section__icon--danger"><TrashIcon /></span>
        <div>
          <h2 className="pf-section__title pf-section__title--danger">Delete Account</h2>
          <p className="pf-section__sub">This action is permanent and cannot be undone.</p>
        </div>
      </div>
      {!open ? (
        <button className="pf-btn pf-btn--danger-outline" onClick={() => setOpen(true)}>
          Delete My Account
        </button>
      ) : (
        <div className="pf-delete-confirm">
          <p className="pf-delete-confirm__warn">
            All your data will be permanently removed. Type <strong>DELETE</strong> below to proceed.
          </p>
          <input
            className={`pf-field__input${error ? " pf-field__input--err" : ""}`}
            value={confirm}
            onChange={e => { setConfirm(e.target.value); setError(""); }}
            placeholder="Type DELETE to confirm"
          />
          {error && <span className="pf-field__error">{error}</span>}
          <div className="pf-delete-confirm__btns">
            <button className="pf-btn pf-btn--ghost" onClick={() => { setOpen(false); setConfirm(""); setError(""); }}>
              Cancel
            </button>
            <button className="pf-btn pf-btn--danger" onClick={submit} disabled={loading}>
              {loading ? "Deleting…" : "Permanently Delete"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ── Profile Page ───────────────────────────────────────────── */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("info"); // "info" | "password" | "delete"

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  const handleDeleted = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="pf-page">
      <div className="pf-page__glow-1" />
      <div className="pf-page__glow-2" />

      <main className="pf-main">
        {/* Back */}
        <button className="pf-back" onClick={() => navigate("/dashboard")}>
          <ChevronLeft /> Back to Dashboard
        </button>

        {/* Profile header */}
        <div className="pf-header-card">
          <div className="pf-header-card__avatar">{initials}</div>
          <div className="pf-header-card__info">
            <h1 className="pf-header-card__name">{user.firstName} {user.middleName ? user.middleName + " " : ""}{user.lastName}{user.suffix ? ", " + user.suffix : ""}</h1>
            <p className="pf-header-card__meta">{user.email} · <span className="pf-header-card__role">{user.role}</span></p>
          </div>
        </div>

        {/* Tab strip */}
        <div className="pf-tabs">
          {[
            { key: "info", label: "Profile Info", icon: <EditIcon /> },
            { key: "password", label: "Change Password", icon: <LockIcon /> },
            { key: "delete", label: "Delete Account", icon: <TrashIcon />, danger: true },
          ].map(t => (
            <button
              key={t.key}
              className={`pf-tab${tab === t.key ? " pf-tab--active" : ""}${t.danger ? " pf-tab--danger" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="pf-content">
          {tab === "info" && <UpdateSection user={user} />}
          {tab === "password" && <ChangePasswordSection user={user} />}
          {tab === "delete" && <DeleteSection user={user} onDeleted={handleDeleted} />}
        </div>
      </main>
    </div>
  );
}