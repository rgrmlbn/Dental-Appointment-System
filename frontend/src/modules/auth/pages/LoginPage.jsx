import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../useAuth.js";

/* ── Icons ──────────────────────────────────────────────────── */
const EyeIcon = ({ open }) =>
  open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

/* ── Input ──────────────────────────────────────────────────── */
const InputField = ({ label, type = "text", placeholder, name, value, onChange, onBlur, ref, error, icon, hasToggle, showPass, onToggle }) => (
  <div className="flex flex-col gap-[5px]">
    <label className="text-[0.8rem] font-semibold text-[#0B2447] tracking-[0.01em]">{label}</label>
    <div className="relative flex items-center">
      {icon && <span className="absolute left-[13px] flex items-center text-[rgba(21,101,192,0.45)]">{icon}</span>}
      <input
        type={hasToggle ? (showPass ? "text" : "password") : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={[
          "box-border w-full rounded-[9px] border-[1.5px] border-[rgba(21,101,192,0.18)] bg-[rgba(227,242,253,0.3)] py-[0.7rem] pr-[2.6rem] pl-10 text-[0.93rem] text-[#0B2447] outline-none transition-[border-color,box-shadow,background-color] duration-200 [font-family:inherit] focus:border-[#1565C0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.11)]",
          !icon ? "pl-4" : "",
          error ? "border-[#E53935] bg-[rgba(229,57,53,0.04)]" : "",
        ].join(" ")}
      />
      {hasToggle && (
        <button type="button" onClick={onToggle} className="absolute right-[13px] flex cursor-pointer items-center border-0 bg-transparent p-0 text-[rgba(11,36,71,0.4)] transition-colors duration-200 hover:text-[#1565C0]">
          <EyeIcon open={showPass} />
        </button>
      )}
    </div>
    {error && <span className="text-[0.75rem] font-medium text-[#E53935]">{error}</span>}
  </div>
);

/* ── Page ──────────────────────────────────────────────────── */
export default function LoginPage() { 
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { email: "", pass: "" },
  });
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async ({ email, pass }) => {
    setApiError("");
    setLoading(true);

    try {
      await login(email, pass);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setApiError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(155deg,#0B2447_0%,#1565C0_55%,#1E88E5_100%)] p-8 [font-family:DM_Sans,sans-serif] max-[600px]:justify-start max-[600px]:px-4 max-[600px]:pt-16 max-[600px]:pb-8">
      {/* bg glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_60%,rgba(30,136,229,0.2)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-20 -right-20 h-[340px] w-[340px] rounded-full bg-[rgba(255,255,255,0.04)]" />

      {/* Back to home */}
      <div className="absolute top-6 left-7 z-10 max-[600px]:top-4 max-[600px]:left-4">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.08)] px-[0.9rem] py-[0.45rem] text-[0.85rem] font-medium text-[rgba(255,255,255,0.9)] no-underline backdrop-blur-[8px] transition-[background,border-color] duration-200 hover:border-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.08)]">
          <ArrowLeft /> Back to home
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-[1] w-full max-w-[420px] rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-white px-9 py-10 shadow-[0_24px_80px_rgba(11,36,71,0.25)] max-[600px]:box-border max-[600px]:px-5 max-[600px]:py-8">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#0B2447_0%,#1565C0_100%)] px-6 py-[0.85rem] shadow-[0_4px_18px_rgba(21,101,192,0.38)] max-[600px]:mb-6">
          <img src="/logo.png" alt="DentalCare Logo" className="block h-[42px] w-auto object-contain" />
        </div>

        {/* Header */}
        <div className="mb-7 max-[600px]:mb-6">
          <h1 className="m-0 mb-[0.4rem] text-[1.9rem] leading-[1.15] font-bold tracking-[-0.02em] text-[#0B2447] [font-family:Fraunces,serif]">Welcome back</h1>
          <p className="m-0 text-[0.88rem] font-light text-[#607D8B]">Sign in to manage your appointments</p>
        </div>

        {/* API error banner */}
        {apiError && (
          <div className="mb-1 rounded-lg border border-[#ffa39e] bg-[#fff1f0] px-[14px] py-[10px] text-[0.85rem] text-[#cf1322]">
            {apiError}
          </div>
        )}

        {/* Fields */}
        <form onSubmit={handleSubmit(handleLogin)} noValidate>
          <div className="flex flex-col gap-[1.1rem]">
            <InputField
              label="Email Address"
              type="email"
              placeholder="you@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
              error={errors.email?.message}
              icon={<MailIcon />}
            />
            <InputField
              label="Password"
              placeholder="Enter your password"
              {...register("pass", { required: "Password is required" })}
              error={errors.pass?.message}
              icon={<LockIcon />}
              hasToggle
              showPass={showPass}
              onToggle={() => setShowPass(v => !v)}
            />
          </div>

        <div className="mt-3 flex justify-end">
          <a href="#" className="text-[0.8rem] font-semibold text-[#1565C0] no-underline hover:underline">Forgot password?</a>
        </div>

        {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full cursor-pointer rounded-[10px] border-0 bg-[linear-gradient(135deg,#0B2447_0%,#1565C0_100%)] p-[0.85rem] text-[0.97rem] font-semibold tracking-[0.01em] text-white shadow-[0_4px_18px_rgba(21,101,192,0.38)] transition-[transform,box-shadow] duration-200 [font-family:inherit] hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(21,101,192,0.45)] disabled:cursor-not-allowed disabled:opacity-[0.65]"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        {/* <div className="login-card__divider">
          <div className="login-card__divider-line" />
          <span className="login-card__divider-text">or continue with</span>
          <div className="login-card__divider-line" />
        </div> */}

        {/* Google */}
        {/* <button type="button" className="login-card__google">
          <svg width="19" height="19" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button> */}

        <p className="mt-5 text-center text-[0.86rem] text-[#607D8B]">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-[#1565C0] no-underline hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}