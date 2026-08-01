import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../../app/api.js";
import "./RegisterPage.css";

/* ── Icons ──────────────────────────────────────────────────── */
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const ArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ── Success Toast ──────────────────────────────────────────── */
const SuccessToast = ({ name, onClose }) => (
  <div className="register-toast register-toast--success">
    <div className="register-toast__icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <div className="register-toast__body">
      <div className="register-toast__title">Account created!</div>
      <div className="register-toast__msg">Welcome, {name}! You can now sign in.</div>
    </div>
    <button className="register-toast__close" onClick={onClose}>×</button>
  </div>
);

/* ── Error Banner ───────────────────────────────────────────── */
const ErrorBanner = ({ message }) => (
  <div className="register-error-banner">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    {message}
  </div>
);

/* ── Field ──────────────────────────────────────────────────── */
const Field = ({ label, required, error, children, half, full }) => (
  <div className={`reg-field ${full ? "reg-field--full" : half ? "reg-field--half" : "reg-field--full"}`}>
    <label className="reg-field__label">
      {label}{required && <span className="reg-field__required">*</span>}
    </label>
    {children}
    {error && <span className="reg-field__error">{error}</span>}
  </div>
);

const Input = ({ type = "text", placeholder, value, onChange, error, hasToggle, showPass, onToggle }) => (
  <div className="reg-input-wrapper">
    <input
      type={hasToggle ? (showPass ? "text" : "password") : type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={["reg-input", error ? "reg-input--error" : "", hasToggle ? "reg-input--with-toggle" : ""].join(" ")}
    />
    {hasToggle && (
      <button type="button" onClick={onToggle} className="reg-toggle">
        <EyeIcon open={showPass} />
      </button>
    )}
  </div>
);

const Select = ({ value, onChange, error, children }) => (
  <select
    value={value}
    onChange={onChange}
    className={["reg-input", "reg-select", error ? "reg-input--error" : ""].join(" ")}
  >
    {children}
  </select>
);

/* ── Steps config ───────────────────────────────────────────── */
const STEPS = [
  { id: 1, title: "Personal Info",  icon: "👤", desc: "Your name & basic details" },
  { id: 2, title: "Address",        icon: "📍", desc: "Where you're located" },
  { id: 3, title: "Account",        icon: "🔐", desc: "Contact & credentials" },
  { id: 4, title: "Review",         icon: "✅", desc: "Confirm your details" },
];

/* ── Stepper bar ────────────────────────────────────────────── */
const StepBar = ({ current }) => (
  <div className="step-bar">
    {STEPS.map((s, i) => (
      <div key={s.id} className="step-bar__item" style={{ flex: i < STEPS.length - 1 ? 1 : "none" }}>
        <div className={["step-bar__circle", current > s.id ? "step-bar__circle--done" : current === s.id ? "step-bar__circle--active" : "step-bar__circle--pending"].join(" ")}>
          {current > s.id ? <CheckIcon /> : s.id}
        </div>
        {i < STEPS.length - 1 && (
          <div className={["step-bar__connector", current > s.id ? "step-bar__connector--done" : "step-bar__connector--pending"].join(" ")} />
        )}
      </div>
    ))}
  </div>
);

/* ── Validation helpers ─────────────────────────────────────── */
const validators = {
  1: (d) => {
    const e = {};
    if (!d.firstName?.trim()) e.firstName = "First name is required";
    else if (d.firstName.length < 2 || d.firstName.length > 20) e.firstName = "Must be 2–20 characters";
    if (d.middleName && (d.middleName.length < 1 || d.middleName.length > 20)) e.middleName = "Must be 1–20 characters";
    if (!d.lastName?.trim()) e.lastName = "Last name is required";
    else if (d.lastName.length < 2 || d.lastName.length > 20) e.lastName = "Must be 2–20 characters";
    if (d.suffix && (d.suffix.length < 1 || d.suffix.length > 8)) e.suffix = "Must be 1–8 characters";
    if (!d.gender) e.gender = "Gender is required";
    if (!d.dateOfBirth) e.dateOfBirth = "Birthdate is required";
    else if (new Date(d.dateOfBirth) >= new Date()) e.dateOfBirth = "Must be a past date";
    return e;
  },
  2: (d) => {
    const e = {};
    if (!d.street?.trim()) e.street = "Street is required";
    if (!d.barangay?.trim()) e.barangay = "Barangay is required";
    if (!d.city?.trim()) e.city = "City is required";
    if (!d.province?.trim()) e.province = "Province is required";
    if (!d.postalCode?.trim()) e.postalCode = "Postal code is required";
    else if (!/^\d{4}$/.test(d.postalCode)) e.postalCode = "Must be a 4-digit code";
    return e;
  },
  3: (d) => {
    const e = {};
    if (!d.contactNumber?.trim()) e.contactNumber = "Contact number is required";
    else if (!/^9\d{9}$/.test(d.contactNumber)) e.contactNumber = "Format: 9XXXXXXXXX (10 digits starting with 9)";
    if (!d.email?.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Enter a valid email";
    if (!d.password) e.password = "Password is required";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(d.password)) e.password = "Min 8 chars with uppercase, lowercase, number & special character";
    if (!d.confirm) e.confirm = "Please confirm your password";
    else if (d.confirm !== d.password) e.confirm = "Passwords don't match";
    return e;
  },
};

/* ── Step components ────────────────────────────────────────── */
const Step1 = ({ data, errors, onChange }) => (
  <div className="step-grid">
    <Field label="First Name" required error={errors.firstName} half>
      <Input placeholder="Jane" value={data.firstName} onChange={e => onChange("firstName", e.target.value)} error={errors.firstName} />
    </Field>
    <Field label="Middle Name" error={errors.middleName} half>
      <Input placeholder="Maria (optional)" value={data.middleName} onChange={e => onChange("middleName", e.target.value)} error={errors.middleName} />
    </Field>
    <Field label="Last Name" required error={errors.lastName} half>
      <Input placeholder="Doe" value={data.lastName} onChange={e => onChange("lastName", e.target.value)} error={errors.lastName} />
    </Field>
    <Field label="Suffix" error={errors.suffix} half>
      <Input placeholder="Jr., Sr. (optional)" value={data.suffix} onChange={e => onChange("suffix", e.target.value)} error={errors.suffix} />
    </Field>
    <Field label="Gender" required error={errors.gender} half>
      <Select value={data.gender} onChange={e => onChange("gender", e.target.value)} error={errors.gender}>
        <option value="">Select gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
      </Select>
    </Field>
    <Field label="Date of Birth" required error={errors.dateOfBirth} half>
      <Input type="date" value={data.dateOfBirth} onChange={e => onChange("dateOfBirth", e.target.value)} error={errors.dateOfBirth} />
    </Field>
  </div>
);

const Step2 = ({ data, errors, onChange }) => (
  <div className="step-grid">
    <Field label="Street" required error={errors.street} full>
      <Input placeholder="123 Rizal St." value={data.street} onChange={e => onChange("street", e.target.value)} error={errors.street} />
    </Field>
    <Field label="Barangay" required error={errors.barangay} half>
      <Input placeholder="Brgy. San Isidro" value={data.barangay} onChange={e => onChange("barangay", e.target.value)} error={errors.barangay} />
    </Field>
    <Field label="City / Municipality" required error={errors.city} half>
      <Input placeholder="Quezon City" value={data.city} onChange={e => onChange("city", e.target.value)} error={errors.city} />
    </Field>
    <Field label="Province" required error={errors.province} half>
      <Input placeholder="Metro Manila" value={data.province} onChange={e => onChange("province", e.target.value)} error={errors.province} />
    </Field>
    <Field label="Postal Code" required error={errors.postalCode} half>
      <Input placeholder="1100" value={data.postalCode} onChange={e => onChange("postalCode", e.target.value)} error={errors.postalCode} />
    </Field>
  </div>
);

const Step3 = ({ data, errors, onChange }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = !data.password ? 0 :
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(data.password) ? 3 :
    data.password.length >= 8 ? 2 : 1;
  const strengthColor = ["transparent", "#E53935", "#F9A825", "#43A047"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];

  return (
    <div className="step-grid">
      <Field label="Contact Number" required error={errors.contactNumber} full>
        <div className="reg-phone-row">
          <span className="reg-phone-prefix">+63</span>
          <input
            type="tel"
            placeholder="9XXXXXXXXX"
            value={data.contactNumber}
            onChange={e => onChange("contactNumber", e.target.value)}
            className={["reg-input", "reg-phone-input", errors.contactNumber ? "reg-input--error" : ""].join(" ")}
          />
        </div>
        {errors.contactNumber && <span className="reg-field__error">{errors.contactNumber}</span>}
      </Field>

      <Field label="Email Address" required error={errors.email} full>
        <Input type="email" placeholder="you@email.com" value={data.email} onChange={e => onChange("email", e.target.value)} error={errors.email} />
      </Field>

      <Field label="Password" required error={errors.password} half>
        <Input placeholder="Create a password" value={data.password} onChange={e => onChange("password", e.target.value)} error={errors.password} hasToggle showPass={showPass} onToggle={() => setShowPass(v => !v)} />
        {data.password && (
          <div className="reg-strength">
            <div className="reg-strength__bars">
              {[1, 2, 3].map(i => (
                <div key={i} className="reg-strength__bar" style={{ background: i <= strength ? strengthColor : "rgba(11,36,71,.1)" }} />
              ))}
            </div>
            <span className="reg-strength__label" style={{ color: strengthColor }}>{strengthLabel}</span>
          </div>
        )}
      </Field>

      <Field label="Confirm Password" required error={errors.confirm} half>
        <Input placeholder="Repeat your password" value={data.confirm} onChange={e => onChange("confirm", e.target.value)} error={errors.confirm} hasToggle showPass={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
        {data.confirm && data.confirm === data.password && (
          <span className="reg-match"><CheckIcon /> Passwords match</span>
        )}
      </Field>
    </div>
  );
};

const ReviewSection = ({ title, children }) => (
  <div className="review-section">
    <div className="review-section__title">{title}</div>
    <div className="review-section__grid">{children}</div>
  </div>
);

const ReviewRow = ({ label, value, full }) => (
  <div className={full ? "review-row review-row--full" : "review-row"}>
    <div className="review-row__label">{label}</div>
    <div className={`review-row__value ${value ? "review-row__value--filled" : "review-row__value--empty"}`}>
      {value || "—"}
    </div>
  </div>
);

const Step4 = ({ data }) => {
  const fullName = [data.firstName, data.middleName, data.lastName, data.suffix].filter(Boolean).join(" ");
  return (
    <div>
      <ReviewSection title="Personal Information">
        <ReviewRow label="Full Name" value={fullName} full />
        <ReviewRow label="Gender" value={data.gender?.charAt(0) + (data.gender?.slice(1).toLowerCase() || "")} />
        <ReviewRow label="Date of Birth" value={data.dateOfBirth} />
      </ReviewSection>
      <ReviewSection title="Address">
        <ReviewRow label="Street" value={data.street} full />
        <ReviewRow label="Barangay" value={data.barangay} />
        <ReviewRow label="City / Municipality" value={data.city} />
        <ReviewRow label="Province" value={data.province} />
        <ReviewRow label="Postal Code" value={data.postalCode} />
      </ReviewSection>
      <ReviewSection title="Account">
        <ReviewRow label="Contact Number" value={data.contactNumber ? `+63 ${data.contactNumber}` : ""} />
        <ReviewRow label="Email Address" value={data.email} />
        <ReviewRow label="Password" value={data.password ? "••••••••" : ""} />
      </ReviewSection>
    </div>
  );
};

/* ── Main RegisterPage ──────────────────────────────────────── */
export default function RegisterPage() {
  const navigate = useNavigate();

  const [step, setStep]       = useState(1);
  const [errors, setErrors]   = useState({});
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [toast, setToast]     = useState(null); // { name }

  const [data, setData] = useState({
    firstName: "", middleName: "", lastName: "", suffix: "",
    gender: "", dateOfBirth: "",
    street: "", barangay: "", city: "", province: "", postalCode: "",
    contactNumber: "", email: "", password: "", confirm: "",
  });

  const onChange = (key, val) => {
    setData(d => ({ ...d, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const next = () => {
    if (step < 4) {
      const errs = validators[step]?.(data) || {};
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setErrors({});
      setStep(s => s + 1);
    }
  };

  const back = () => { setErrors({}); setApiError(""); setStep(s => s - 1); };

  const submit = async () => {
    if (!agreed) return;

    setApiError("");
    setLoading(true);

    // Build payload matching RegisterRequest
    const payload = {
      firstName:     data.firstName,
      middleName:    data.middleName || undefined,
      lastName:      data.lastName,
      suffix:        data.suffix || undefined,
      gender:        data.gender,
      dateOfBirth:   data.dateOfBirth,           // "YYYY-MM-DD" — LocalDate compatible
      contactNumber: data.contactNumber,
      street:        data.street,
      barangay:      data.barangay,
      city:          data.city,
      province:      data.province,
      postalCode:    data.postalCode,
      email:         data.email,
      password:      data.password,
    };

    try {
      await authApi.register(payload);

      // Show success toast then redirect to login after 2.5s
      setToast({ name: data.firstName });
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setApiError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ["Personal Info", "Address", "Account", "Review & Confirm"];
  const stepDescs  = [
    "Tell us a bit about yourself",
    "Where are you located?",
    "Set up your contact details and login",
    "Review your information before submitting",
  ];

  return (
    <div className="register-page">
      <div className="register-page__glow-1" />
      <div className="register-page__glow-2" />

      {/* Success Toast */}
      {toast && <SuccessToast name={toast.name} onClose={() => navigate("/login")} />}

      {/* Back to home */}
      <div className="register-page__back">
        <Link to="/" className="register-page__back-link">
          <ArrowLeft /> Back to home
        </Link>
      </div>

      {/* Card */}
      <div className="register-card">
        <div className="register-card__logo">
          <img src="/logo.png" alt="DentalCare Logo" className="register-card__logo-img" />
        </div>

        <StepBar current={step} />

        <div className="register-card__step-header">
          <span className="register-card__step-label">Step {step} of {STEPS.length}</span>
          <h2 className="register-card__step-title">{stepTitles[step - 1]}</h2>
          <p className="register-card__step-desc">{stepDescs[step - 1]}</p>
        </div>

        {/* API error banner (step 4) */}
        {apiError && <ErrorBanner message={apiError} />}

        <div className="register-card__content">
          {step === 1 && <Step1 data={data} errors={errors} onChange={onChange} />}
          {step === 2 && <Step2 data={data} errors={errors} onChange={onChange} />}
          {step === 3 && <Step3 data={data} errors={errors} onChange={onChange} />}
          {step === 4 && <Step4 data={data} />}
        </div>

        {/* Terms (step 4 only) */}
        {step === 4 && (
          <label className="register-card__terms">
            <div
              onClick={() => setAgreed(v => !v)}
              className={`register-card__checkbox ${agreed ? "register-card__checkbox--checked" : "register-card__checkbox--unchecked"}`}
            >
              {agreed && <CheckIcon />}
            </div>
            <span className="register-card__terms-text">
              I agree to the{" "}
              <a href="#" className="register-card__terms-link">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="register-card__terms-link">Privacy Policy</a>
            </span>
          </label>
        )}

        {/* Navigation */}
        <div className="register-card__nav">
          {step > 1 && (
            <button type="button" onClick={back} className="register-card__back-btn">
              <ArrowLeft /> Back
            </button>
          )}

          {step < 4 ? (
            <button type="button" onClick={next} className="register-card__next-btn">
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!agreed || loading}
              className={`register-card__submit-btn ${agreed && !loading ? "register-card__submit-btn--enabled" : "register-card__submit-btn--disabled"}`}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          )}
        </div>

        <p className="register-card__footer">
          Already have an account?{" "}
          <Link to="/login" className="register-card__footer-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}