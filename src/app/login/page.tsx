"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  TriangleAlert,
} from "lucide-react";
import toast from "react-hot-toast";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REMEMBER_KEY = "glampos-remembered-email";

type FieldKey = "email" | "password";

function validate(email: string, password: string): Partial<Record<FieldKey, string>> {
  const errors: Partial<Record<FieldKey, string>> = {};
  if (!email.trim()) errors.email = "Email wajib diisi.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Format email belum valid.";
  if (!password) errors.password = "Password wajib diisi.";
  else if (password.length < 6) errors.password = "Password minimal 6 karakter.";
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(REMEMBER_KEY);
    if (!saved) {
      emailRef.current?.focus();
      return;
    }
    setEmail(saved);
    setRemember(true);
  }, []);

  const errors = validate(email, password);
  const fieldError = (key: FieldKey) =>
    touched[key] || submitAttempted ? errors[key] : undefined;

  const markTouched = (key: FieldKey) =>
    setTouched((current) => ({ ...current, [key]: true }));

  const updateEmail = (value: string) => {
    setEmail(value);
    if (submitAttempted) setSubmitAttempted(false);
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    if (submitAttempted) setSubmitAttempted(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(errors).length > 0) {
      const firstError = (Object.keys(errors) as FieldKey[])[0];
      document.getElementById(`login-${firstError}`)?.focus();
      toast.error("Periksa kembali data yang ditandai merah.");
      return;
    }

    setSubmitting(true);
    try {
      if (remember) window.localStorage.setItem(REMEMBER_KEY, email.trim());
      else window.localStorage.removeItem(REMEMBER_KEY);
    } catch {
      /* penyimpanan browser tidak tersedia, abaikan */
    }

    try {
      router.push("/");
      toast.success("Selamat datang kembali di GlampOS.");
    } catch {
      setSubmitting(false);
      toast.error("Gagal masuk. Silakan coba lagi.");
    }
  };

  const emailError = fieldError("email");
  const passwordError = fieldError("password");

  return (
    <div className="auth-page">
      <section className="auth-brand">
        <div className="auth-brand-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="auth-logo" src="/logo-glampos.png" alt="GlampOS" />
          <small>Property Management System</small>
        </div>
        <h1>Kelola properti glamping tanpa ribet.</h1>
        <p>
          Kalender, booking, keuangan, dan laporan operasional GlampOS dalam satu
          tempat.
        </p>
        <ul>
          <li>Okupansi &amp; pendapatan harian</li>
          <li>Konfirmasi booking dan pembayaran DP</li>
          <li>Laporan keuangan siap unduh</li>
        </ul>
      </section>

      <section className="auth-form-wrap">
        <form
          className="auth-form card"
          onSubmit={handleSubmit}
          noValidate
          aria-busy={submitting}
        >
          <span className="card-kicker">MASUK KE AKUN</span>
          <h2>Selamat datang kembali</h2>
          <p className="auth-subtitle">
            Gunakan email dan password yang terdaftar pada GlampOS.
          </p>

          <div className={`auth-field${emailError ? " has-error" : ""}`}>
            <label htmlFor="login-email">Email</label>
            <div className="auth-input">
              <Mail size={16} aria-hidden="true" />
              <input
                id="login-email"
                ref={emailRef}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="lucy@niskalaretreat.co.id"
                value={email}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "login-email-error" : undefined}
                onChange={(event) => updateEmail(event.target.value)}
                onBlur={() => markTouched("email")}
              />
            </div>
            {emailError && (
              <p className="auth-error" id="login-email-error">
                <CircleAlert size={12} />
                {emailError}
              </p>
            )}
          </div>

          <div className={`auth-field${passwordError ? " has-error" : ""}`}>
            <label htmlFor="login-password">
              Password
              <a href="/lupa-password" className="auth-forgot">
                Lupa password?
              </a>
            </label>
            <div className="auth-input">
              <Lock size={16} aria-hidden="true" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Masukkan password"
                value={password}
                aria-invalid={!!passwordError}
                aria-describedby={
                  passwordError
                    ? "login-password-error"
                    : capsLock
                      ? "login-password-caps"
                      : undefined
                }
                onChange={(event) => updatePassword(event.target.value)}
                onKeyUp={(event) => setCapsLock(event.getModifierState("CapsLock"))}
                onKeyDown={(event) => setCapsLock(event.getModifierState("CapsLock"))}
                onBlur={() => {
                  markTouched("password");
                  setCapsLock(false);
                }}
              />
              <button
                type="button"
                className="auth-toggle"
                aria-pressed={showPassword}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {capsLock && !passwordError && (
              <p className="auth-caps" id="login-password-caps">
                <TriangleAlert size={12} />
                Caps Lock aktif
              </p>
            )}
            {passwordError && (
              <p className="auth-error" id="login-password-error">
                <CircleAlert size={12} />
                {passwordError}
              </p>
            )}
          </div>

          <div className="auth-row">
            <label className="auth-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <span>Ingat email saya</span>
            </label>
          </div>

          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="auth-spinner" aria-hidden="true" />
                Memproses...
              </>
            ) : (
              <>
                Masuk
                <ArrowRight size={16} aria-hidden="true" />
              </>
            )}
          </button>

          <p className="auth-hint">
            Belum punya akun?{" "}
            <a href="mailto:admin@niskalaretreat.co.id" className="auth-link">
              Hubungi administrator properti
            </a>
          </p>
        </form>

        <p className="auth-footnote">
          &copy; 2026 GlampOS — Sistem manajemen properti untuk bisnis glamping.
        </p>
      </section>
    </div>
  );
}