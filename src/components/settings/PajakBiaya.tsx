"use client";

import { useState } from "react";

export default function PajakBiaya() {
  const [tax, setTax] = useState("10");
  const [service, setService] = useState("5");
  const [dp, setDp] = useState("50");
  const [hold, setHold] = useState("24");

  return (
    <>
      <div className="settings-section">
        <span className="card-kicker">PAJAK & SERVICE</span>
        <h2>Biaya properti</h2>
        <p>
          Default 0%. Nilai dapat diubah Owner kapan saja dan hanya berlaku
          untuk booking baru.
        </p>
        <div className="form-grid">
          <label>
            Pajak daerah (%)
            <div className="suffix-input">
              <input value={tax} onChange={(e) => setTax(e.target.value)} />
              <span>%</span>
            </div>
          </label>
          <label>
            Service charge (%)
            <div className="suffix-input">
              <input value={service} onChange={(e) => setService(e.target.value)} />
              <span>%</span>
            </div>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <span className="card-kicker">KEBIJAKAN BOOKING</span>
        <h2>DP dan masa tahan</h2>
        <div className="form-grid">
          <label>
            DP minimum
            <div className="suffix-input">
              <input value={dp} onChange={(e) => setDp(e.target.value)} />
              <span>%</span>
            </div>
          </label>
          <label>
            Masa tahan pending
            <div className="suffix-input">
              <input value={hold} onChange={(e) => setHold(e.target.value)} />
              <span>jam</span>
            </div>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <span className="card-kicker">BIAYA TAMBAHAN</span>
        <h2>Extra bed & charged services</h2>
        <div className="form-grid">
          <label>
            Extra bed
            <div className="suffix-input">
              <input defaultValue="150000" />
              <span>Rp</span>
            </div>
          </label>
          <label>
            Late checkout (per jam)
            <div className="suffix-input">
              <input defaultValue="50000" />
              <span>Rp</span>
            </div>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <span className="card-kicker">REVIEW OTOMATIS</span>
        <h2>Pengingat & notifikasi</h2>
        <div className="setting-line">
          <div>
            <strong>Kirim email review setelah check-out</strong>
            <span>Otomatis kirim link review 1 hari setelah check-out</span>
          </div>
          <button className="toggle on" type="button">
            <i />
          </button>
        </div>
        <div className="setting-line" style={{ marginTop: 12 }}>
          <div>
            <strong>Pengingat DP ke tamu</strong>
            <span>Kirim notifikasi 12 jam sebelum masa tahan habis</span>
          </div>
          <button className="toggle on" type="button">
            <i />
          </button>
        </div>
      </div>
    </>
  );
}
