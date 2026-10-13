"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Camera,
  CircleAlert,
  Clock,
  Globe,
  Lock,
  Mail,
  MessageCircle,
  Monitor,
  Phone,
  Shield,
  Smartphone,
} from "lucide-react";
import toast from "react-hot-toast";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";

const STORAGE_KEY = "glampos-profile";

const POSITIONS = ["Owner", "Manajer Properti", "Supervisor Operasional", "Admin Properti"];
const LANGUAGES = ["Bahasa Indonesia", "English"];
const TIMEZONES = ["WIB (UTC+7)", "WITA (UTC+8)", "WIT (UTC+9)"];

const ACTIVE_SESSIONS = [
  { icon: Monitor, device: "Chrome on macOS", location: "Yogyakarta, Indonesia", lastSeen: "15 Jul 2026, 08:12 WIB", current: true },
  { icon: Smartphone, device: "Safari on iPhone 15", location: "Yogyakarta, Indonesia", lastSeen: "14 Jul 2026, 19:40 WIB", current: false },
];

type Profile = {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  position: string;
  language: string;
  timezone: string;
  notifyBookingEmail: boolean;
  notifyWhatsappCheckin: boolean;
  notifyDailySummary: boolean;
  notifyPayment: boolean;
};

type FieldKey = "name" | "email" | "phone" | "whatsapp";

const DEFAULT_PROFILE: Profile = {
  name: "Lucy Andriani",
  email: "lucy@niskalaretreat.co.id",
  phone: "+62 812 3344 7788",
  whatsapp: "+62 812 3344 7788",
  position: "Owner",
  language: "Bahasa Indonesia",
  timezone: "WIB (UTC+7)",
  notifyBookingEmail: true,
  notifyWhatsappCheckin: true,
  notifyDailySummary: false,
  notifyPayment: true,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const digitCount = (value: string) => value.replace(/\D/g, "").length;

function validate(profile: Profile): Partial<Record<FieldKey, string>> {
  const errors: Partial<Record<FieldKey, string>> = {};
  if (!profile.name.trim()) errors.name = "Nama lengkap wajib diisi.";
  if (!EMAIL_PATTERN.test(profile.email.trim())) errors.email = "Format email belum valid.";
  if (digitCount(profile.phone) < 8) errors.phone = "Nomor telepon belum valid.";
  if (digitCount(profile.whatsapp) < 8) errors.whatsapp = "Nomor WhatsApp belum valid.";
  return errors;
}

function readProfile(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...(JSON.parse(saved) as Partial<Profile>) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export default function ProfilSayaPage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [savedProfile, setSavedProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = readProfile();
    setProfile(stored);
    setSavedProfile(stored);
  }, []);

  const errors = validate(profile);
  const isDirty = (Object.keys(DEFAULT_PROFILE) as (keyof Profile)[]).some(
    (key) => profile[key] !== savedProfile[key],
  );

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const markTouched = (key: FieldKey) => {
    setTouched((current) => ({ ...current, [key]: true }));
  };

  const fieldError = (key: FieldKey) => (touched[key] || submitAttempted ? errors[key] : undefined);

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const save = (next: Profile) => {
    setSaving(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setProfile(next);
      setSavedProfile(next);
      setTouched({});
      setSubmitAttempted(false);
      window.dispatchEvent(new Event("glampos-profile-updated"));
      toast.success("Profil berhasil disimpan.");
    } catch {
      toast.error("Profil belum dapat disimpan di perangkat ini.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(errors).length > 0) {
      toast.error("Periksa kembali data yang ditandai merah.");
      return;
    }

    save({
      ...profile,
      name: profile.name.trim(),
      email: profile.email.trim().toLowerCase(),
      phone: profile.phone.trim(),
      whatsapp: profile.whatsapp.trim(),
    });
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setTouched({});
    setSubmitAttempted(false);
    toast("Perubahan dibatalkan.", { icon: "↺" });
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="AKUN SAYA"
        title="Profil Saya"
        description="Kelola data pribadi, preferensi notifikasi, dan keamanan akun Anda."
        action={
          <div className="header-actions">
            <button
              className="primary-button"
              type="submit"
              form="profile-form"
              disabled={!isDirty || saving}
            >
              Simpan perubahan
            </button>
          </div>
        }
      />

      <div className="profile-layout">
        <aside className="card profile-card">
          <div className="profile-avatar">{initials || "LA"}</div>
          <h2>{profile.name || "Nama belum diisi"}</h2>
          <p>{profile.email}</p>
          <span className="profile-role">{profile.position}</span>

          <div className="profile-meta">
            <div>
              <span>Properti</span>
              <strong>
                <Building2 size={13} />
                Niskala Retreat
              </strong>
            </div>
            <div>
              <span>Bergabung sejak</span>
              <strong>
                <Clock size={13} />
                12 Jan 2024
              </strong>
            </div>
            <div>
              <span>Status akun</span>
              <strong>
                <Shield size={13} />
                Aktif & terverifikasi
              </strong>
            </div>
          </div>

          <div className="photo-upload-card profile-photo-upload">
            <Camera size={20} />
            <span>Ganti foto profil</span>
            <small>PNG atau JPG, maks 2MB</small>
          </div>
        </aside>

        <section className="card settings-form">
          <form id="profile-form" className="settings-section" onSubmit={handleSubmit} noValidate>
            <span className="card-kicker">INFORMASI PRIBADI</span>
            <h2>Data akun</h2>
            <p className="settings-lead">
              Data ini dipakai pada invoice, laporan harian, dan komunikasi dengan tamu.
            </p>

            <div className="form-grid">
              <label className={fieldError("name") ? "has-error" : ""}>
                Nama lengkap
                <input
                  value={profile.name}
                  onChange={(event) => update("name", event.target.value)}
                  onBlur={() => markTouched("name")}
                  autoComplete="name"
                  placeholder="Nama lengkap Anda"
                  aria-invalid={Boolean(fieldError("name"))}
                />
                {fieldError("name") ? (
                  <em className="field-error"><CircleAlert size={11} />{fieldError("name")}</em>
                ) : (
                  <em className="field-hint">Sesuai identitas pada NPWP perusahaan.</em>
                )}
              </label>

              <label>
                Jabatan
                <div className="suffix-input">
                  <Shield size={14} />
                  <select value={profile.position} onChange={(event) => update("position", event.target.value)}>
                    {POSITIONS.map((position) => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
                <em className="field-hint">Hak akses modul diatur terpisah di Pengguna &amp; akses.</em>
              </label>

              <label className={fieldError("email") ? "has-error" : ""}>
                Email
                <div className="suffix-input">
                  <Mail size={14} />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={profile.email}
                    onChange={(event) => update("email", event.target.value)}
                    onBlur={() => markTouched("email")}
                    placeholder="nama@properti.co.id"
                    aria-invalid={Boolean(fieldError("email"))}
                  />
                </div>
                {fieldError("email") ? (
                  <em className="field-error"><CircleAlert size={11} />{fieldError("email")}</em>
                ) : (
                  <em className="field-hint">Dipakai untuk masuk dan menerima notifikasi sistem.</em>
                )}
              </label>

              <label className={fieldError("phone") ? "has-error" : ""}>
                Nomor telepon
                <div className="suffix-input">
                  <Phone size={14} />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={profile.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    onBlur={() => markTouched("phone")}
                    placeholder="+62 812 3344 7788"
                    aria-invalid={Boolean(fieldError("phone"))}
                  />
                </div>
                {fieldError("phone") && (
                  <em className="field-error"><CircleAlert size={11} />{fieldError("phone")}</em>
                )}
              </label>

              <label className={fieldError("whatsapp") ? "has-error" : ""}>
                WhatsApp
                <div className="suffix-input">
                  <MessageCircle size={14} />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={profile.whatsapp}
                    onChange={(event) => update("whatsapp", event.target.value)}
                    onBlur={() => markTouched("whatsapp")}
                    placeholder="+62 812 3344 7788"
                    aria-invalid={Boolean(fieldError("whatsapp"))}
                  />
                </div>
                {fieldError("whatsapp") ? (
                  <em className="field-error"><CircleAlert size={11} />{fieldError("whatsapp")}</em>
                ) : (
                  <em className="field-hint">Nomor tujuan pengingat check-in tamu.</em>
                )}
              </label>

              <label>
                Bahasa
                <div className="suffix-input">
                  <Globe size={14} />
                  <select value={profile.language} onChange={(event) => update("language", event.target.value)}>
                    {LANGUAGES.map((language) => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>
              </label>

              <label>
                Zona waktu
                <div className="suffix-input">
                  <Clock size={14} />
                  <select value={profile.timezone} onChange={(event) => update("timezone", event.target.value)}>
                    {TIMEZONES.map((timezone) => (
                      <option key={timezone} value={timezone}>{timezone}</option>
                    ))}
                  </select>
                </div>
                <em className="field-hint">Menentukan jam operasional dan invoice.</em>
              </label>
            </div>
          </form>

          <div className="settings-section">
            <span className="card-kicker">PREFERENSI NOTIFIKASI</span>
            <h2>Notifikasi</h2>
            <div className="setting-line">
              <div>
                <strong>Booking baru via email</strong>
                <span>Kirim ringkasan setiap booking baru masuk</span>
              </div>
              <button
                className={`toggle ${profile.notifyBookingEmail ? "on" : ""}`}
                type="button"
                role="switch"
                aria-checked={profile.notifyBookingEmail}
                aria-label="Notifikasi booking baru via email"
                onClick={() => update("notifyBookingEmail", !profile.notifyBookingEmail)}
              >
                <i />
              </button>
            </div>
            <div className="setting-line" style={{ marginTop: 12 }}>
              <div>
                <strong>Pengingat check-in via WhatsApp</strong>
                <span>Kirim pesan otomatis H-1 sebelum tamu check-in</span>
              </div>
              <button
                className={`toggle ${profile.notifyWhatsappCheckin ? "on" : ""}`}
                type="button"
                role="switch"
                aria-checked={profile.notifyWhatsappCheckin}
                aria-label="Pengingat check-in via WhatsApp"
                onClick={() => update("notifyWhatsappCheckin", !profile.notifyWhatsappCheckin)}
              >
                <i />
              </button>
            </div>
            <div className="setting-line" style={{ marginTop: 12 }}>
              <div>
                <strong>Ringkasan harian</strong>
                <span>Laporan singkat okupansi dan pendapatan setiap pukul 18.00</span>
              </div>
              <button
                className={`toggle ${profile.notifyDailySummary ? "on" : ""}`}
                type="button"
                role="switch"
                aria-checked={profile.notifyDailySummary}
                aria-label="Ringkasan harian"
                onClick={() => update("notifyDailySummary", !profile.notifyDailySummary)}
              >
                <i />
              </button>
            </div>
            <div className="setting-line" style={{ marginTop: 12 }}>
              <div>
                <strong>Pembayaran & invoice</strong>
                <span>Kabari transaksi yang belum lunas atau jatuh tempo</span>
              </div>
              <button
                className={`toggle ${profile.notifyPayment ? "on" : ""}`}
                type="button"
                role="switch"
                aria-checked={profile.notifyPayment}
                aria-label="Notifikasi pembayaran dan invoice"
                onClick={() => update("notifyPayment", !profile.notifyPayment)}
              >
                <i />
              </button>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-title">
              <div>
                <span className="card-kicker">KESELAMATAN</span>
                <h2>Perangkat aktif</h2>
                <p>Kelola perangkat yang sedang masuk ke akun Anda.</p>
              </div>
              <Link className="secondary-button" href="/pengaturan">
                <Lock size={14} />
                Ubah password
              </Link>
            </div>
            <div className="session-list">
              {ACTIVE_SESSIONS.map((session) => (
                <div className="session-row" key={session.device}>
                  <div className="guest-avatar"><session.icon size={14} /></div>
                  <div className="session-identity">
                    <strong>{session.device}</strong>
                    <span>{session.location}</span>
                  </div>
                  <span className={session.current ? "staff-status active" : "staff-status inactive"}>
                    {session.current ? "Perangkat ini" : `Terakhir aktif ${session.lastSeen}`}
                  </span>
                </div>
              ))}
            </div>
            <p className="permission-note">
              Role dan hak akses dikelola melalui <strong>Pengaturan → Pengguna &amp; akses</strong>.
            </p>
          </div>

          <div className="settings-footer">
            <span className={isDirty ? "footer-dirty" : undefined}>
              {isDirty ? "Ada perubahan yang belum disimpan." : "Semua perubahan tersimpan."}
            </span>
            <button className="secondary-button" type="button" onClick={handleCancel} disabled={!isDirty}>
              Batal
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}