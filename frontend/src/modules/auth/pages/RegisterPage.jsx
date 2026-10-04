import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { authApi } from "../../../app/api.js";

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
  <div className="fixed top-6 left-1/2 z-[9999] flex min-w-[300px] max-w-[420px] -translate-x-1/2 animate-register-toast-in items-start gap-3 rounded-xl border border-[#86efac] bg-[#f0fdf4] px-[18px] py-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-white">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <div className="flex-1">
      <div className="mb-0.5 text-[0.9rem] font-bold text-[#15803d]">Account created!</div>
      <div className="text-[0.82rem] text-[#166534]">Welcome, {name}! You can now sign in.</div>
    </div>
    <button className="shrink-0 cursor-pointer border-0 bg-transparent px-0.5 text-[1.2rem] leading-none text-[#15803d]" onClick={onClose}>×</button>
  </div>
);

/* ── Error Banner ───────────────────────────────────────────── */
const ErrorBanner = ({ message }) => (
  <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#ffa39e] bg-[#fff1f0] px-[14px] py-[10px] text-[0.84rem] text-[#cf1322]">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    {message}
  </div>
);

/* ── Field ──────────────────────────────────────────────────── */
const Field = ({ label, required, error, children, half, full }) => (
  <div className={`flex flex-col gap-[5px] ${full || !half ? "col-span-2" : "col-span-1"}`}>
    <label className="text-[0.78rem] font-semibold tracking-[0.015em] text-[#0B2447]">
      {label}{required && <span className="ml-[2px] text-[#E53935]">*</span>}
    </label>
    {children}
    {error && <span className="text-[0.73rem] font-medium text-[#E53935]">{error}</span>}
  </div>
);

const Input = ({ type = "text", placeholder, name, value, onChange, onBlur, ref, error, hasToggle, showPass, onToggle }) => (
  <div className="relative flex items-center">
    <input
      type={hasToggle ? (showPass ? "text" : "password") : type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
      aria-invalid={Boolean(error)}
      className={`box-border w-full rounded-lg border-[1.5px] border-[rgba(21,101,192,0.18)] bg-[rgba(227,242,253,0.3)] px-[0.9rem] py-[0.65rem] text-[0.9rem] text-[#0B2447] outline-none transition-[border-color,box-shadow,background-color] duration-200 [font-family:inherit] focus:border-[#1565C0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.1)] ${error ? "border-[#E53935] bg-[rgba(229,57,53,0.04)]" : ""} ${hasToggle ? "pr-10" : ""}`}
    />
    {hasToggle && (
      <button type="button" onClick={onToggle} className="absolute right-[11px] flex cursor-pointer items-center border-0 bg-transparent p-0 text-[rgba(11,36,71,0.4)] transition-colors duration-200 hover:text-[#1565C0]">
        <EyeIcon open={showPass} />
      </button>
    )}
  </div>
);

const Select = ({ name, value, onChange, onBlur, ref, error, children }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    ref={ref}
    aria-invalid={Boolean(error)}
    className={`box-border w-full cursor-pointer appearance-none rounded-lg border-[1.5px] border-[rgba(21,101,192,0.18)] bg-[rgba(227,242,253,0.3)] px-[0.9rem] py-[0.65rem] text-[0.9rem] text-[#0B2447] outline-none transition-[border-color,box-shadow,background-color] duration-200 [font-family:inherit] focus:border-[#1565C0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.1)] ${error ? "border-[#E53935] bg-[rgba(229,57,53,0.04)]" : ""}`}
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
  <div className="mb-8 flex items-center">
    {STEPS.map((s, i) => (
      <div key={s.id} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : "flex-none"}`}>
        <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.82rem] font-bold transition-all duration-300 ${current > s.id ? "border-0 bg-[#1565C0] text-white" : current === s.id ? "border-2 border-[#1565C0] bg-[linear-gradient(135deg,#0B2447,#1565C0)] text-white shadow-[0_4px_16px_rgba(21,101,192,0.3)]" : "border-[1.5px] border-[rgba(21,101,192,0.15)] bg-[rgba(21,101,192,0.08)] text-[#90A4AE]"}`}>
          {current > s.id ? <CheckIcon /> : s.id}
        </div>
        {i < STEPS.length - 1 && (
          <div className={`mx-1 h-0.5 flex-1 rounded-sm transition-colors duration-300 ${current > s.id ? "bg-[#1565C0]" : "bg-[rgba(21,101,192,0.12)]"}`} />
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

const STEP_FIELDS = {
  1: ["firstName", "middleName", "lastName", "suffix", "gender", "dateOfBirth"],
  2: ["street", "barangay", "city", "province", "postalCode"],
  3: ["contactNumber", "email", "password", "confirm"],
};

/* ── Step components ────────────────────────────────────────── */
const Step1 = ({ errors, registerField }) => (
  <div className="grid grid-cols-2 gap-4">
    <Field label="First Name" required error={errors.firstName} half>
      <Input placeholder="Jane" {...registerField("firstName")} error={errors.firstName} />
    </Field>
    <Field label="Middle Name" error={errors.middleName} half>
      <Input placeholder="Maria (optional)" {...registerField("middleName")} error={errors.middleName} />
    </Field>
    <Field label="Last Name" required error={errors.lastName} half>
      <Input placeholder="Doe" {...registerField("lastName")} error={errors.lastName} />
    </Field>
    <Field label="Suffix" error={errors.suffix} half>
      <Input placeholder="Jr., Sr. (optional)" {...registerField("suffix")} error={errors.suffix} />
    </Field>
    <Field label="Gender" required error={errors.gender} half>
      <Select {...registerField("gender")} error={errors.gender}>
        <option value="">Select gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
      </Select>
    </Field>
    <Field label="Date of Birth" required error={errors.dateOfBirth} half>
      <Input type="date" {...registerField("dateOfBirth")} error={errors.dateOfBirth} />
    </Field>
  </div>
);

const Step2 = ({ errors, registerField }) => (
  <div className="grid grid-cols-2 gap-4">
    <Field label="Street" required error={errors.street} full>
      <Input placeholder="123 Rizal St." {...registerField("street")} error={errors.street} />
    </Field>
    <Field label="Barangay" required error={errors.barangay} half>
      <Input placeholder="Brgy. San Isidro" {...registerField("barangay")} error={errors.barangay} />
    </Field>
    <Field label="City / Municipality" required error={errors.city} half>
      <Input placeholder="Quezon City" {...registerField("city")} error={errors.city} />
    </Field>
    <Field label="Province" required error={errors.province} half>
      <Input placeholder="Metro Manila" {...registerField("province")} error={errors.province} />
    </Field>
    <Field label="Postal Code" required error={errors.postalCode} half>
      <Input placeholder="1100" {...registerField("postalCode")} error={errors.postalCode} />
    </Field>
  </div>
);

const Step3 = ({ data, errors, registerField }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = !data.password ? 0 :
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(data.password) ? 3 :
    data.password.length >= 8 ? 2 : 1;
  const strengthColorClass = ["text-transparent", "text-[#E53935]", "text-[#F9A825]", "text-[#43A047]"][strength];
  const strengthBackgrounds = ["bg-transparent", "bg-[#E53935]", "bg-[#F9A825]", "bg-[#43A047]"];
  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];

  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Contact Number" required error={errors.contactNumber} full>
        <div className="flex">
          <span className="flex items-center whitespace-nowrap rounded-l-lg border-[1.5px] border-r-0 border-[rgba(21,101,192,0.18)] bg-[rgba(21,101,192,0.07)] px-[0.7rem] py-[0.65rem] text-[0.88rem] font-semibold text-[#607D8B]">+63</span>
          <input
            type="tel"
            placeholder="9XXXXXXXXX"
            {...registerField("contactNumber")}
            aria-invalid={Boolean(errors.contactNumber)}
            className={`box-border min-w-0 flex-1 rounded-r-lg border-[1.5px] border-[rgba(21,101,192,0.18)] bg-[rgba(227,242,253,0.3)] px-[0.9rem] py-[0.65rem] text-[0.9rem] text-[#0B2447] outline-none transition-[border-color,box-shadow,background-color] duration-200 [font-family:inherit] focus:border-[#1565C0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.1)] ${errors.contactNumber ? "border-[#E53935] bg-[rgba(229,57,53,0.04)]" : ""}`}
          />
        </div>
        {errors.contactNumber && <span className="text-[0.73rem] font-medium text-[#E53935]">{errors.contactNumber}</span>}
      </Field>

      <Field label="Email Address" required error={errors.email} full>
        <Input type="email" placeholder="you@email.com" {...registerField("email")} error={errors.email} />
      </Field>

      <Field label="Password" required error={errors.password} half>
        <Input placeholder="Create a password" {...registerField("password")} error={errors.password} hasToggle showPass={showPass} onToggle={() => setShowPass(v => !v)} />
        {data.password && (
          <div className="mt-1">
          <div className="mb-[3px] flex gap-[3px]">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-[3px] flex-1 rounded transition-colors duration-300 ${i <= strength ? strengthBackgrounds[strength] : "bg-[rgba(11,36,71,0.1)]"}`} />
              ))}
            </div>
            <span className={`text-[0.72rem] font-semibold ${strengthColorClass}`}>{strengthLabel}</span>
          </div>
        )}
      </Field>

      <Field label="Confirm Password" required error={errors.confirm} half>
        <Input placeholder="Repeat your password" {...registerField("confirm")} error={errors.confirm} hasToggle showPass={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
        {data.confirm && data.confirm === data.password && (
          <span className="mt-0.5 flex items-center gap-1 text-[0.73rem] font-medium text-[#43A047]"><CheckIcon /> Passwords match</span>
        )}
      </Field>
    </div>
  );
};

const ReviewSection = ({ title, children }) => (
  <div className="mb-5">
    <div className="mb-[0.6rem] border-b border-[rgba(21,101,192,0.12)] pb-[0.4rem] text-[0.75rem] font-bold tracking-[0.07em] text-[#1565C0] uppercase">{title}</div>
    <div className="grid grid-cols-2 gap-x-3 gap-y-[0.4rem]">{children}</div>
  </div>
);

const ReviewRow = ({ label, value, full }) => (
  <div className={full ? "col-span-2" : "col-span-1"}>
    <div className="mb-px text-[0.72rem] font-medium text-[#90A4AE]">{label}</div>
    <div className={`text-[0.88rem] font-medium ${value ? "text-[#0B2447]" : "text-[#CFD8DC]"}`}>
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
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [toast, setToast]     = useState(null); // { name }

  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "", middleName: "", lastName: "", suffix: "",
      gender: "", dateOfBirth: "",
      street: "", barangay: "", city: "", province: "", postalCode: "",
      contactNumber: "", email: "", password: "", confirm: "", agreed: false,
    },
  });
  const data = useWatch({ control });
  const agreed = useWatch({ control, name: "agreed" });
  const errors = Object.fromEntries(
    Object.entries(fieldErrors).map(([name, error]) => [name, error.message]),
  );

  const registerField = (name, stepNumber) => register(name, {
    ...(name === "password" ? { deps: "confirm" } : {}),
    validate: (value, values) => validators[stepNumber]({ ...values, [name]: value })[name] || true,
  });

  const next = async () => {
    if (step < 4) {
      const isValid = await trigger(STEP_FIELDS[step]);
      if (!isValid) return;
      setStep(s => s + 1);
    }
  };

  const back = () => { setApiError(""); setStep(s => s - 1); };

  const submit = async (values) => {
    if (!agreed) return;

    setApiError("");
    setLoading(true);

    // Build payload matching RegisterRequest
    const payload = {
      firstName:     values.firstName,
      middleName:    values.middleName || undefined,
      lastName:      values.lastName,
      suffix:        values.suffix || undefined,
      gender:        values.gender,
      dateOfBirth:   values.dateOfBirth,
      contactNumber: values.contactNumber,
      street:        values.street,
      barangay:      values.barangay,
      city:          values.city,
      province:      values.province,
      postalCode:    values.postalCode,
      email:         values.email,
      password:      values.password,
    };

    try {
      await authApi.register(payload);

      // Show success toast then redirect to login after 2.5s
      setToast({ name: values.firstName });
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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(155deg,#0B2447_0%,#1565C0_55%,#1E88E5_100%)] px-4 py-8 [font-family:DM_Sans,sans-serif] max-[600px]:justify-start max-[600px]:pt-16 max-[600px]:pb-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,rgba(30,136,229,0.18)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[340px] w-[340px] rounded-full bg-[rgba(255,255,255,0.04)]" />

      {/* Success Toast */}
      {toast && <SuccessToast name={toast.name} onClose={() => navigate("/login")} />}

      {/* Back to home */}
      <div className="absolute top-6 left-7 z-10 max-[600px]:top-4 max-[600px]:left-4">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.08)] px-[0.9rem] py-[0.45rem] text-[0.85rem] font-medium text-[rgba(255,255,255,0.8)] no-underline backdrop-blur-[8px] transition-[background,color] duration-200 hover:bg-[rgba(255,255,255,0.15)] hover:text-white">
          <ArrowLeft /> Back to home
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-[1] w-full max-w-[580px] rounded-[22px] bg-white px-9 pt-9 pb-8 shadow-[0_24px_80px_rgba(11,36,71,0.25)] max-[600px]:box-border max-[600px]:max-w-[420px] max-[600px]:px-5 max-[600px]:py-8">
        <div className="mb-8 flex items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#0B2447_0%,#1565C0_100%)] px-6 py-[0.85rem] shadow-[0_4px_18px_rgba(21,101,192,0.38)] max-[600px]:mb-6">
          <img src="/logo.png" alt="DentalCare Logo" className="block h-[42px] w-auto object-contain" />
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate>
        <StepBar current={step} />

        <div className="mb-6">
          <span className="mb-[0.3rem] block text-[0.75rem] font-bold tracking-[0.06em] text-[#1565C0] uppercase">Step {step} of {STEPS.length}</span>
          <h2 className="m-0 mb-1 text-[1.55rem] font-bold tracking-[-0.02em] text-[#0B2447] [font-family:Fraunces,serif]">{stepTitles[step - 1]}</h2>
          <p className="m-0 text-[0.85rem] font-light text-[#90A4AE]">{stepDescs[step - 1]}</p>
        </div>

        {/* API error banner (step 4) */}
        {apiError && <ErrorBanner message={apiError} />}

        <div className="min-h-[220px]">
          {step === 1 && <Step1 errors={errors} registerField={name => registerField(name, 1)} />}
          {step === 2 && <Step2 errors={errors} registerField={name => registerField(name, 2)} />}
          {step === 3 && <Step3 data={data} errors={errors} registerField={name => registerField(name, 3)} />}
          {step === 4 && <Step4 data={data} />}
        </div>

        {/* Terms (step 4 only) */}
        {step === 4 && (
          <label className="mt-5 flex cursor-pointer items-start gap-[0.6rem]">
            <span className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] transition-[background,border] duration-200 ${agreed ? "bg-[#1565C0]" : "border-[1.5px] border-[rgba(21,101,192,0.3)] bg-transparent"}`}>
              <input type="checkbox" {...register("agreed", { required: true })} className="sr-only" aria-invalid={Boolean(fieldErrors.agreed)} />
              {agreed && <CheckIcon />}
            </span>
            <span className="text-[0.82rem] leading-[1.6] text-[#607D8B]">
              I agree to the{" "}
              <a href="#" className="font-semibold text-[#1565C0] no-underline hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="font-semibold text-[#1565C0] no-underline hover:underline">Privacy Policy</a>
            </span>
          </label>
        )}

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button type="button" onClick={back} className="flex flex-[0_0_auto] cursor-pointer items-center gap-2 rounded-[9px] border-[1.5px] border-[rgba(11,36,71,0.15)] bg-transparent px-5 py-[0.78rem] text-[0.92rem] font-semibold text-[#0B2447] transition-[border-color,background-color] duration-200 [font-family:inherit] hover:border-[#1565C0] hover:bg-[rgba(21,101,192,0.04)]">
              <ArrowLeft /> Back
            </button>
          )}

          {step < 4 ? (
            <button type="button" onClick={next}             className="flex-1 cursor-pointer rounded-[9px] border-0 bg-[linear-gradient(135deg,#0B2447_0%,#1565C0_100%)] p-[0.82rem] text-[0.95rem] font-semibold tracking-[0.01em] text-white shadow-[0_4px_16px_rgba(21,101,192,0.35)] transition-[transform,box-shadow] duration-200 [font-family:inherit] hover:-translate-y-px hover:shadow-[0_7px_24px_rgba(21,101,192,0.42)]">
              Continue →
            </button>
          ) : (
            <button
              type="submit"
              disabled={!agreed || loading}
              className={`flex-1 rounded-[9px] border-0 p-[0.82rem] text-[0.95rem] font-semibold tracking-[0.01em] transition-all duration-200 [font-family:inherit] ${agreed && !loading ? "cursor-pointer bg-[linear-gradient(135deg,#0B2447_0%,#1565C0_100%)] text-white shadow-[0_4px_16px_rgba(21,101,192,0.35)] hover:-translate-y-px hover:shadow-[0_7px_24px_rgba(21,101,192,0.42)]" : "cursor-not-allowed bg-[rgba(11,36,71,0.1)] text-[rgba(11,36,71,0.3)]"} disabled:cursor-not-allowed disabled:opacity-[0.6]`}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          )}
        </div>
        </form>

        <p className="mt-4 text-center text-[0.84rem] text-[#90A4AE]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#1565C0] no-underline hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}