"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Loader2,
  Mail,
  MailCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESEND_COOLDOWN = 30;

export default function LupaPasswordPage() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const error = !email.trim()
    ? "Email wajib diisi."
    : !EMAIL_PATTERN.test(email.trim())
      ? "Format email belum valid."
      : undefined;
  const showError = (touched || submitAttempted) && error;

  const updateEmail = (value: string) => {
    setEmail(value);
    if (submitAttempted) setSubmitAttempted(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (error) {
      document.getElementById("forgot-email")?.focus();
      toast.error("Periksa kembali data yang ditandai merah.");
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSentTo(email.trim());
      setCooldown(RESEND_COOLDOWN);
      toast.success("Tautan reset password telah dikirim.");
    }, 800);
  };

  const handleResend = () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    window.setTimeout(() => {
      setResending(false);
      setCooldown(RESEND_COOLDOWN);
      toast.success("Tautan reset password dikirim ulang.");
    }, 800);
  };

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
        {sentTo ? (
          <div className="auth-form card">
            <div className="auth-success-icon">
              <MailCheck size={22} aria-hidden="true" />
            </div>
            <span className="card-kicker">TAUTAN TERKIRIM</span>
            <h2>Periksa email Anda</h2>
            <p className="auth-subtitle">
              Tautan untuk mengatur ulang password telah dikirim ke{" "}
              <strong className="auth-sent-email">{sentTo}</strong>. Tautan
              berlaku selama 60 menit.
            </p>
            <p className="auth-note">
              Tidak menerima email? Periksa folder spam atau kirim ulang tautan.
            </p>
            <button
              className="secondary-button auth-secondary"
              type="button"
              disabled={cooldown > 0 || resending}
              onClick={handleResend}
            >
              {resending ? (
                <>
                  <Loader2 size={16} className="auth-spinner" aria-hidden="true" />
                  Mengirim...
                </>
              ) : cooldown > 0 ? (
                `Kirim ulang dalam ${cooldown} dtk`
              ) : (
                "Kirim ulang tautan"
              )}
            </button>
            <a href="/login" className="auth-back">
              <ArrowLeft size={15} aria-hidden="true" />
              Kembali ke Masuk
            </a>
          </div>
        ) : (
          <form
            className="auth-form card"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={submitting}
          >
            <span className="card-kicker">LUPA PASSWORD</span>
            <h2>Atur ulang password</h2>
            <p className="auth-subtitle">
              Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk
              mengatur ulang password Anda.
            </p>

            <div className={`auth-field${showError ? " has-error" : ""}`}>
              <label htmlFor="forgot-email">Email</label>
              <div className="auth-input">
                <Mail size={16} aria-hidden="true" />
                <input
                  id="forgot-email"
                  ref={emailRef}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="lucy@niskalaretreat.co.id"
                  value={email}
                  aria-invalid={!!showError}
                  aria-describedby={showError ? "forgot-email-error" : undefined}
                  onChange={(event) => updateEmail(event.target.value)}
                  onBlur={() => setTouched(true)}
                />
              </div>
              {showError && (
                <p className="auth-error" id="forgot-email-error">
                  <CircleAlert size={12} />
                  {error}
                </p>
              )}
            </div>

            <button
              className="primary-button auth-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="auth-spinner" aria-hidden="true" />
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim tautan reset
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>

            <a href="/login" className="auth-back">
              <ArrowLeft size={15} aria-hidden="true" />
              Kembali ke Masuk
            </a>
          </form>
        )}

        <p className="auth-footnote">
          &copy; 2026 GlampOS — Sistem manajemen properti untuk bisnis glamping.
        </p>
      </section>
    </div>
  );
}
