import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../auth/useAuth.js";
import { userApi } from "../../../app/api.js";
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

function Field({ label, name, type = "text", options, error, placeholder, ...fieldProps }) {
  if (options) {
    return (
      <div className="pf-field [display:flex] [flex-direction:column] [gap:0.35rem]">
        <label className="pf-field__label [font-size:0.78rem] [font-weight:600] [color:#546e7a] [letter-spacing:0.01em]">{label}</label>
        <select {...fieldProps} aria-invalid={Boolean(error)} className={`pf-field__input [padding:0.6rem_0.9rem] [border:1.5px_solid_#cfd8dc] [border-radius:10px] [font-family:DM_Sans,_sans-serif] [font-size:0.9rem] [color:#0b2447] [background:#f8fbff] [transition:border-color_0.18s,_box-shadow_0.18s] [outline:none] [width:100%] [box-sizing:border-box] focus:[border-color:#1565c0] focus:[box-shadow:0_0_0_3px_rgba(21,101,192,0.1)] focus:[background:#fff]${error ? " pf-field__input--err [border-color:#E53935] [background:rgba(229,_57,_53,_0.04)] focus:[box-shadow:0_0_0_3px_rgba(239,83,80,0.1)]" : ""}`} name={name}>
          <option value="">Select…</option>
          {options.map(o => <option key={o} value={o}>{o.charAt(0) + o.slice(1).toLowerCase()}</option>)}
        </select>
        {error && <span className="pf-field__error [font-size:0.75rem] [color:#E53935] [font-weight:400]">{error}</span>}
      </div>
    );
  }
  return (
    <div className="pf-field [display:flex] [flex-direction:column] [gap:0.35rem]">
      <label className="pf-field__label [font-size:0.78rem] [font-weight:600] [color:#546e7a] [letter-spacing:0.01em]">{label}</label>
      <input
        {...fieldProps}
        aria-invalid={Boolean(error)}
        className={`pf-field__input [padding:0.6rem_0.9rem] [border:1.5px_solid_#cfd8dc] [border-radius:10px] [font-family:DM_Sans,_sans-serif] [font-size:0.9rem] [color:#0b2447] [background:#f8fbff] [transition:border-color_0.18s,_box-shadow_0.18s] [outline:none] [width:100%] [box-sizing:border-box] focus:[border-color:#1565c0] focus:[box-shadow:0_0_0_3px_rgba(21,101,192,0.1)] focus:[background:#fff]${error ? " pf-field__input--err [border-color:#E53935] [background:rgba(229,_57,_53,_0.04)] focus:[box-shadow:0_0_0_3px_rgba(239,83,80,0.1)]" : ""}`}
        type={type}
        name={name}
        placeholder={placeholder}
      />
      {error && <span className="pf-field__error [font-size:0.75rem] [color:#E53935] [font-weight:400]">{error}</span>}
    </div>
  );
}

function PasswordField({ label, name, error, ...fieldProps }) {
  const [show, setShow] = useState(false);
  return (
    <div className="pf-field [display:flex] [flex-direction:column] [gap:0.35rem]">
      <label className="pf-field__label [font-size:0.78rem] [font-weight:600] [color:#546e7a] [letter-spacing:0.01em]">{label}</label>
      <div className="pf-field__pw-wrap [position:relative]">
        <input
          {...fieldProps}
          aria-invalid={Boolean(error)}
          className={`pf-field__input [padding:0.6rem_0.9rem] [border:1.5px_solid_#cfd8dc] [border-radius:10px] [font-family:DM_Sans,_sans-serif] [font-size:0.9rem] [color:#0b2447] [background:#f8fbff] [transition:border-color_0.18s,_box-shadow_0.18s] [outline:none] [width:100%] [box-sizing:border-box] focus:[border-color:#1565c0] focus:[box-shadow:0_0_0_3px_rgba(21,101,192,0.1)] focus:[background:#fff] pf-field__input--pw [padding-right:2.5rem]${error ? " pf-field__input--err [border-color:#E53935] [background:rgba(229,_57,_53,_0.04)] focus:[box-shadow:0_0_0_3px_rgba(239,83,80,0.1)]" : ""}`}
          type={show ? "text" : "password"}
          name={name}
          autoComplete="new-password"
        />
        <button type="button" className="pf-field__eye [position:absolute] [right:0.75rem] [top:50%] [transform:translateY(-50%)] [background:none] [border:none] [cursor:pointer] [color:#90a4ae] [display:flex] [align-items:center] [padding:0] [transition:color_0.15s] hover:[color:#546e7a]" onClick={() => setShow(s => !s)} tabIndex={-1}>
          <EyeIcon show={show} />
        </button>
      </div>
      {error && <span className="pf-field__error [font-size:0.75rem] [color:#E53935] [font-weight:400]">{error}</span>}
    </div>
  );
}

/* ── Section components ─────────────────────────────────────── */
function Toast({ msg, ok }) {
  if (!msg) return null;
  return (
    <div className={`pf-toast [display:flex] [align-items:center] [gap:0.5rem] [padding:0.7rem_1rem] [border-radius:10px] [font-size:0.85rem] [font-weight:500] [margin-bottom:1rem] animate-profile-toast-in${ok ? " pf-toast--ok [background:#e8f5e9] [color:#2e7d32] [border:1px_solid_#a5d6a7]" : " pf-toast--err [background:#ffebee] [color:#c62828] [border:1px_solid_#ef9a9a]"}`}>
      {ok && <CheckIcon />} {msg}
    </div>
  );
}

function UpdateSection({ user }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
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
    },
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async values => {
    setLoading(true);
    try {
      const body = {};
      Object.entries(values).forEach(([k, v]) => { if (v !== "") body[k] = v; });
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
    <section className="pf-section [background:#fff] [border-radius:20px] [padding:2rem_2rem_1.75rem] [box-shadow:0_12px_40px_rgba(11,36,71,0.15)] max-[640px]:[padding:1.5rem_1.25rem]">
      <div className="pf-section__header [display:flex] [align-items:flex-start] [gap:0.85rem] [margin-bottom:1.5rem]">
        <span className="pf-section__icon [width:34px] [height:34px] [border-radius:10px] [background:#e3f2fd] [color:#1565c0] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px]"><EditIcon /></span>
        <div>
          <h2 className="pf-section__title [font-size:1rem] [font-weight:700] [color:#0b2447] [margin:0_0_0.2rem]">Personal Information</h2>
          <p className="pf-section__sub [font-size:0.8rem] [color:#90a4ae] [margin:0] [font-weight:300]">Update your profile details below.</p>
        </div>
      </div>
      <Toast {...(toast ?? {})} msg={toast?.msg} ok={toast?.ok} />
      <form onSubmit={handleSubmit(submit)} noValidate>
      <div className="pf-grid [display:grid] [gap:1rem] pf-grid--2 [grid-template-columns:1fr_1fr] max-[640px]:[grid-template-columns:1fr]">
        <Field label="First Name" name="firstName" {...register("firstName", { validate: value => !value || value.length >= 2 || "Min 2 characters" })} error={errors.firstName?.message} />
        <Field label="Middle Name" name="middleName" {...register("middleName")} />
        <Field label="Last Name" name="lastName" {...register("lastName", { validate: value => !value || value.length >= 2 || "Min 2 characters" })} error={errors.lastName?.message} />
        <Field label="Suffix" name="suffix" placeholder="Jr., Sr., III…" {...register("suffix")} />
        <Field label="Gender" name="gender" options={GENDER_OPTIONS} {...register("gender")} />
        <Field label="Date of Birth" name="dateOfBirth" type="date" {...register("dateOfBirth")} />
        <Field label="Contact Number" name="contactNumber" placeholder="+639XXXXXXXXX" {...register("contactNumber", { validate: value => !value || /^\+?[1-9]\d{1,14}$/.test(value) || "Invalid phone number" })} error={errors.contactNumber?.message} />
        <Field label="Email" name="email" type="email" {...register("email", { validate: value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email" })} error={errors.email?.message} />
      </div>
      <div className="pf-section__divider [height:1px] [background:#f0f4f8] [margin:1.25rem_0]" />
      <p className="pf-section__group-label [font-size:0.72rem] [font-weight:700] [letter-spacing:0.08em] [text-transform:uppercase] [color:#90a4ae] [margin:0_0_0.85rem]">Address</p>
      <div className="pf-grid [display:grid] [gap:1rem] pf-grid--2 [grid-template-columns:1fr_1fr] max-[640px]:[grid-template-columns:1fr]">
        <Field label="Street" name="street" {...register("street")} />
        <Field label="Barangay" name="barangay" {...register("barangay")} />
        <Field label="City" name="city" {...register("city")} />
        <Field label="Province" name="province" {...register("province")} />
        <Field label="Postal Code" name="postalCode" {...register("postalCode")} />
      </div>
      <div className="pf-section__actions [margin-top:1.5rem] [display:flex] [justify-content:flex-end]">
        <button type="submit" className="pf-btn [display:inline-flex] [align-items:center] [gap:0.4rem] [padding:0.7rem_1.5rem] [border-radius:10px] [font-family:DM_Sans,_sans-serif] [font-size:0.9rem] [font-weight:600] [cursor:pointer] [transition:transform_0.14s,_box-shadow_0.18s,_background_0.18s] [border:none] disabled:[opacity:0.6] disabled:[cursor:not-allowed] pf-btn--primary [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [color:#fff] [box-shadow:0_4px_16px_rgba(21,101,192,0.35)] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[box-shadow:0_8px_24px_rgba(21,101,192,0.45)]" disabled={loading}>
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </div>
      </form>
    </section>
  );
}

function ChangePasswordSection({ user }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async values => {
    setLoading(true);
    try {
      await userApi.changePassword(user.id, values);
      setToast({ msg: "Password changed.", ok: true });
      reset();
    } catch (e) {
      setToast({ msg: e.message, ok: false });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <section className="pf-section [background:#fff] [border-radius:20px] [padding:2rem_2rem_1.75rem] [box-shadow:0_12px_40px_rgba(11,36,71,0.15)] max-[640px]:[padding:1.5rem_1.25rem]">
      <div className="pf-section__header [display:flex] [align-items:flex-start] [gap:0.85rem] [margin-bottom:1.5rem]">
        <span className="pf-section__icon [width:34px] [height:34px] [border-radius:10px] [background:#e3f2fd] [color:#1565c0] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px]"><LockIcon /></span>
        <div>
          <h2 className="pf-section__title [font-size:1rem] [font-weight:700] [color:#0b2447] [margin:0_0_0.2rem]">Change Password</h2>
          <p className="pf-section__sub [font-size:0.8rem] [color:#90a4ae] [margin:0] [font-weight:300]">Use a strong password you don't use elsewhere.</p>
        </div>
      </div>
      <Toast msg={toast?.msg} ok={toast?.ok} />
      <form onSubmit={handleSubmit(submit)} noValidate>
      <div className="pf-grid [display:grid] [gap:1rem] pf-grid--1 [grid-template-columns:1fr]">
        <PasswordField label="Current Password" name="currentPassword" {...register("currentPassword", { required: "Required" })} error={errors.currentPassword?.message} />
        <PasswordField label="New Password" name="newPassword" {...register("newPassword", {
          required: "Required",
          deps: "confirmPassword",
          minLength: { value: 8, message: "Min 8 characters" },
          pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, message: "Must include uppercase, lowercase, digit & special character" },
        })} error={errors.newPassword?.message} />
        <PasswordField label="Confirm New Password" name="confirmPassword" {...register("confirmPassword", {
          validate: (value, values) => value === values.newPassword || "Passwords do not match",
        })} error={errors.confirmPassword?.message} />
      </div>
      <div className="pf-section__actions [margin-top:1.5rem] [display:flex] [justify-content:flex-end]">
        <button type="submit" className="pf-btn [display:inline-flex] [align-items:center] [gap:0.4rem] [padding:0.7rem_1.5rem] [border-radius:10px] [font-family:DM_Sans,_sans-serif] [font-size:0.9rem] [font-weight:600] [cursor:pointer] [transition:transform_0.14s,_box-shadow_0.18s,_background_0.18s] [border:none] disabled:[opacity:0.6] disabled:[cursor:not-allowed] pf-btn--primary [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [color:#fff] [box-shadow:0_4px_16px_rgba(21,101,192,0.35)] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[box-shadow:0_8px_24px_rgba(21,101,192,0.45)]" disabled={loading}>
          {loading ? "Updating…" : "Update Password"}
        </button>
      </div>
      </form>
    </section>
  );
}

function DeleteSection({ user, onDeleted }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange", reValidateMode: "onChange", defaultValues: { confirm: "" } });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState("");

  const submit = async () => {
    setLoading(true);
    try {
      await userApi.deleteUser(user.id);
      onDeleted();
    } catch (e) {
      setRequestError(e.message);
      setLoading(false);
    }
  };

  return (
    <section className="pf-section [background:#fff] [border-radius:20px] [padding:2rem_2rem_1.75rem] [box-shadow:0_12px_40px_rgba(11,36,71,0.15)] max-[640px]:[padding:1.5rem_1.25rem] pf-section--danger [border:1.5px_solid_#ffcdd2]">
      <div className="pf-section__header [display:flex] [align-items:flex-start] [gap:0.85rem] [margin-bottom:1.5rem]">
        <span className="pf-section__icon [width:34px] [height:34px] [border-radius:10px] [background:#e3f2fd] [color:#1565c0] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [margin-top:2px] pf-section__icon--danger [background:#ffebee] [color:#c62828]"><TrashIcon /></span>
        <div>
          <h2 className="pf-section__title [font-size:1rem] [font-weight:700] [color:#0b2447] [margin:0_0_0.2rem] pf-section__title--danger [color:#c62828]">Delete Account</h2>
          <p className="pf-section__sub [font-size:0.8rem] [color:#90a4ae] [margin:0] [font-weight:300]">This action is permanent and cannot be undone.</p>
        </div>
      </div>
      {!open ? (
        <button type="button" className="pf-btn [display:inline-flex] [align-items:center] [gap:0.4rem] [padding:0.7rem_1.5rem] [border-radius:10px] [font-family:DM_Sans,_sans-serif] [font-size:0.9rem] [font-weight:600] [cursor:pointer] [transition:transform_0.14s,_box-shadow_0.18s,_background_0.18s] [border:none] pf-btn--danger [background:#c62828] [color:#fff] [box-shadow:0_4px_14px_rgba(198,40,40,0.3)] hover:[background:#b71c1c] hover:[transform:translateY(-1px)]" onClick={() => setOpen(true)}>
          <TrashIcon />
          Delete My Account
        </button>
      ) : (
        <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="pf-delete-confirm [display:flex] [flex-direction:column] [gap:0.85rem]">
          <p className="pf-delete-confirm__warn [font-size:0.85rem] [color:#546e7a] [margin:0] [line-height:1.55] [&_strong]:[color:#c62828]">
            All your data will be permanently removed. Type <strong>DELETE</strong> below to proceed.
          </p>
          {requestError && <span className="pf-field__error [font-size:0.75rem] [color:#E53935]">{requestError}</span>}
          <input
            {...register("confirm", { validate: value => value === "DELETE" || "Type DELETE to confirm" })}
            aria-invalid={Boolean(errors.confirm)}
            className={`pf-field__input [padding:0.6rem_0.9rem] [border:1.5px_solid_#cfd8dc] [border-radius:10px] [font-family:DM_Sans,_sans-serif] [font-size:0.9rem] [color:#0b2447] [background:#f8fbff] [transition:border-color_0.18s,_box-shadow_0.18s] [outline:none] [width:100%] [box-sizing:border-box] focus:[border-color:#1565c0] focus:[box-shadow:0_0_0_3px_rgba(21,101,192,0.1)] focus:[background:#fff]${errors.confirm ? " pf-field__input--err [border-color:#E53935] [background:rgba(229,_57,_53,_0.04)] focus:[box-shadow:0_0_0_3px_rgba(239,83,80,0.1)]" : ""}`}
            placeholder="Type DELETE to confirm"
          />
          {errors.confirm && <span className="pf-field__error [font-size:0.75rem] [color:#E53935] [font-weight:400]">{errors.confirm.message}</span>}
          <div className="pf-delete-confirm__btns [display:flex] [gap:0.75rem] [flex-wrap:wrap]">
            <button type="button" className="pf-btn [display:inline-flex] [align-items:center] [gap:0.4rem] [padding:0.7rem_1.5rem] [border-radius:10px] [font-family:DM_Sans,_sans-serif] [font-size:0.9rem] [font-weight:600] [cursor:pointer] [transition:transform_0.14s,_box-shadow_0.18s,_background_0.18s] [border:none] disabled:[opacity:0.6] disabled:[cursor:not-allowed] pf-btn--ghost [background:none] [border:1.5px_solid_#cfd8dc] [color:#546e7a] hover:[background:#f0f4f8]" onClick={() => { setOpen(false); reset(); setRequestError(""); }}>
              Cancel
            </button>
            <button type="submit" className="pf-btn [display:inline-flex] [align-items:center] [gap:0.4rem] [padding:0.7rem_1.5rem] [border-radius:10px] [font-family:DM_Sans,_sans-serif] [font-size:0.9rem] [font-weight:600] [cursor:pointer] [transition:transform_0.14s,_box-shadow_0.18s,_background_0.18s] [border:none] disabled:[opacity:0.6] disabled:[cursor:not-allowed] pf-btn--danger [background:#c62828] [color:#fff] [box-shadow:0_4px_14px_rgba(198,40,40,0.3)] [&:hover:not(:disabled)]:[background:#b71c1c] [&:hover:not(:disabled)]:[transform:translateY(-1px)]" disabled={loading}>
              {loading ? "Deleting…" : "Permanently Delete"}
            </button>
          </div>
        </div>
        </form>
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
  <div className="pf-page min-h-screen flex flex-col relative overflow-x-hidden font-body">
    <div className="pf-page__bg [position:fixed] [inset:0] [z-index:0] [pointer-events:none] [background-image:linear-gradient(155deg,#0b2447_0%,#1565c0_55%,#1e88e5_100%)]" />
    <div className="pf-page__glow-1 ..." />
    <div className="pf-page__glow-2 ..." />
    

      <main className="pf-main [position:relative] [z-index:1] [flex:1] [max-width:780px] [width:100%] [margin:0_auto] [padding:2rem_1.5rem_5rem] [display:flex] [flex-direction:column] [gap:1.25rem] max-[640px]:[padding:1.5rem_1rem_4rem]">
        {/* Back */}
        <button className="pf-back [display:inline-flex] [align-items:center] [gap:0.4rem] [background:none] [border:none] [color:rgba(255,255,255,0.75)] [font-family:DM_Sans,_sans-serif] [font-size:0.88rem] [font-weight:500] [cursor:pointer] [padding:0] [transition:color_0.18s] [width:fit-content] hover:[color:#fff]" onClick={() => navigate("/dashboard")}>
          <ChevronLeft /> Back to Dashboard
        </button>

        {/* Profile header */}
        <div className="pf-header-card [background:#fff] [border-radius:20px] [padding:1.75rem_2rem] [box-shadow:0_20px_60px_rgba(11,36,71,0.2)] [display:flex] [align-items:center] [gap:1.25rem] max-[640px]:[padding:1.25rem]">
          <div className="pf-header-card__avatar [width:62px] [height:62px] [border-radius:50%] [background:linear-gradient(135deg,_#0b2447_0%,_#1565c0_100%)] [color:#fff] [font-size:1.2rem] [font-weight:700] [display:flex] [align-items:center] [justify-content:center] [flex-shrink:0] [letter-spacing:0.04em] [box-shadow:0_4px_16px_rgba(21,101,192,0.35)]">{initials}</div>
          <div className="pf-header-card__info">
            <h1 className="pf-header-card__name [font-size:1.25rem] [font-weight:700] [color:#0b2447] [margin:0_0_0.25rem] [letter-spacing:-0.02em]">{user.firstName} {user.middleName ? user.middleName + " " : ""}{user.lastName}{user.suffix ? ", " + user.suffix : ""}</h1>
            <p className="pf-header-card__meta [font-size:0.83rem] [color:#607d8b] [margin:0]">{user.email} · <span className="pf-header-card__role [background:#e3f2fd] [color:#1565c0] [font-size:0.72rem] [font-weight:700] [letter-spacing:0.07em] [text-transform:uppercase] [padding:0.15rem_0.55rem] [border-radius:50px]">{user.role}</span></p>
          </div>
        </div>

        {/* Tab strip */}
        <div className="pf-tabs [display:flex] [gap:0.5rem] [flex-wrap:wrap] max-[640px]:[gap:0.4rem]">
          {[
            { key: "info", label: "Profile Info", icon: <EditIcon /> },
            { key: "password", label: "Change Password", icon: <LockIcon /> },
            { key: "delete", label: "Delete Account", icon: <TrashIcon />, danger: true },
          ].map(t => (
            <button
              key={t.key}
              className={`pf-tab [display:inline-flex] [align-items:center] [gap:0.45rem] [padding:0.6rem_1.1rem] [border-radius:50px] [border:1.5px_solid_rgba(255,255,255,0.25)] [background:rgba(255,255,255,0.1)] [color:rgba(255,255,255,0.75)] [font-family:DM_Sans,_sans-serif] [font-size:0.86rem] [font-weight:500] [cursor:pointer] [transition:border-color_0.18s,_color_0.18s,_box-shadow_0.18s] [backdrop-filter:blur(6px)] hover:[color:#fff] focus-visible:[outline:2px_solid_#fff] focus-visible:[outline-offset:3px] max-[640px]:[font-size:0.8rem] max-[640px]:[padding:0.5rem_0.85rem]${tab === t.key ? " pf-tab--active" : ""}${t.danger ? " pf-tab--danger [color:rgba(255,120,120,0.85)] [border-color:rgba(255,100,100,0.3)] hover:[color:#ffb3b3]" : ""}`}
              style={tab === t.key ? {
                background: "rgba(255,255,255,0.1)",
                color: t.danger ? "#ffd1d1" : "#fff",
                borderColor: t.danger ? "#ffcdd2" : "#fff",
                fontWeight: 600,
                boxShadow: `0 0 0 2px ${t.danger ? "rgba(255,205,210,0.45)" : "rgba(255,255,255,0.35)"}`,
              } : undefined}
              aria-pressed={tab === t.key}
              onClick={() => setTab(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="pf-content [display:flex] [flex-direction:column] [gap:1.25rem]">
          {tab === "info" && <UpdateSection user={user} />}
          {tab === "password" && <ChangePasswordSection user={user} />}
          {tab === "delete" && <DeleteSection user={user} onDeleted={handleDeleted} />}
        </div>
      </main>
    </div>
  );
}