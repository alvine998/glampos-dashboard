"use client";

import { useState } from "react";
import { Shield, Lock, Smartphone, Eye, EyeOff } from "lucide-react";

export default function KeamananSettings() {
  const [showPass, setShowPass] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  return (
    <>
      <div className="settings-section">
        <span className="card-kicker">AUTENTIKASI</span>
        <h2>Keamanan akun</h2>

        <div className="setting-line">
          <div>
            <strong>
              <Lock size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Autentikasi dua faktor (2FA)
            </strong>
            <span>Tambahkan lapisan keamanan ekstra untuk akun Anda</span>
          </div>
          <button className="toggle" type="button">
            <i />
          </button>
        </div>

        <div className="setting-line" style={{ marginTop: 12 }}>
          <div>
            <strong>
              <Smartphone size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Verifikasi email saat login
            </strong>
            <span>Kirim kode verifikasi ke email setiap kali login dari perangkat baru</span>
          </div>
          <button className="toggle on" type="button">
            <i />
          </button>
        </div>
      </div>

      <div className="settings-section">
        <span className="card-kicker">UBAH PASSWORD</span>
        <h2>Password</h2>
        <div className="form-grid">
          <label className="full">
            Password saat ini
            <div className="suffix-input">
              <input
                type={showPass ? "text" : "password"}
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Masukkan password saat ini"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ background: "none", border: 0, padding: 0 }}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </label>
          <label className="full">
            Password baru
            <div className="suffix-input">
              <input
                type={showPass ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Masukkan password baru"
              />
            </div>
          </label>
          <label className="full">
            Konfirmasi password baru
            <div className="suffix-input">
              <input
                type={showPass ? "text" : "password"}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Ulangi password baru"
              />
            </div>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <span className="card-kicker">KESELAMATAN</span>
        <h2>Sesi & aktifitas</h2>
        <div className="setting-line">
          <div>
            <strong>Auto-logout setelah tidak aktif</strong>
            <span>Otomatis logout setelah 30 menit tidak ada aktivitas</span>
          </div>
          <button className="toggle on" type="button">
            <i />
          </button>
        </div>
        <div className="setting-line" style={{ marginTop: 12 }}>
          <div>
            <strong>
              <Shield size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
              Aktifitas login terakhir
            </strong>
            <span>Terakhir login: 15 Jul 2026, 08:12 WIB — Chrome on macOS</span>
          </div>
        </div>
      </div>
    </>
  );
}
