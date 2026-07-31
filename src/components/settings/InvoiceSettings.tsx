"use client";

import { useState } from "react";
import { Hash, FileText } from "lucide-react";

export default function InvoiceSettings() {
  const [prefix, setPrefix] = useState("INV/");
  const [nextNum, setNextNum] = useState("0047");
  const [notes, setNotes] = useState("Terima kasih atas kunjungan Anda ke Niskala Retreat. Kami harap Anda menikmati pengalaman glamping kami.");

  return (
    <>
      <div className="settings-section">
        <span className="card-kicker">NOMOR INVOICE</span>
        <h2>Format & penomoran</h2>
        <div className="form-grid">
          <label>
            Prefix invoice
            <div className="suffix-input">
              <Hash size={14} />
              <input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
            </div>
          </label>
          <label>
            Nomor berikutnya
            <div className="suffix-input">
              <FileText size={14} />
              <input value={nextNum} onChange={(e) => setNextNum(e.target.value)} />
            </div>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <span className="card-kicker">METODE PEMBAYARAN</span>
        <h2>Opsi pembayaran</h2>
        <div className="setting-line">
          <div>
            <strong>Transfer bank</strong>
            <span>BCA, Mandiri, BRI — atas nama Niskala Retreat</span>
          </div>
          <button className="toggle on" type="button">
            <i />
          </button>
        </div>
        <div className="setting-line" style={{ marginTop: 12 }}>
          <div>
            <strong>Virtual account</strong>
            <span>BCA VA — otomatis terverifikasi</span>
          </div>
          <button className="toggle on" type="button">
            <i />
          </button>
        </div>
        <div className="setting-line" style={{ marginTop: 12 }}>
          <div>
            <strong>Midtrans (Card / E-Wallet)</strong>
            <span>Bayar pakai kartu kredit, GoPay, OVO, Dana</span>
          </div>
          <button className="toggle" type="button">
            <i />
          </button>
        </div>
        <div className="setting-line" style={{ marginTop: 12 }}>
          <div>
            <strong>Tunai di tempat</strong>
            <span>Pembayaran langsung saat check-in</span>
          </div>
          <button className="toggle on" type="button">
            <i />
          </button>
        </div>
      </div>

      <div className="settings-section">
        <span className="card-kicker">TEMPLATE INVOICE</span>
        <h2>Catatan & branding</h2>
        <div className="form-grid">
          <label className="full">
            Catatan invoice
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <label>
            Mata uang tampil
            <select defaultValue="idr">
              <option value="idr">IDR — Rupiah Indonesia</option>
            </select>
          </label>
          <label>
            Logo di invoice
            <select defaultValue="auto">
              <option value="auto">Gunakan logo properti</option>
              <option value="custom">Upload custom</option>
            </select>
          </label>
        </div>
      </div>
    </>
  );
}
