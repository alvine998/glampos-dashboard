"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Globe, Camera } from "lucide-react";

export default function ProfilProperti() {
  const [name, setName] = useState("Niskala Retreat");
  const [address, setAddress] = useState("Jl. Kaliurang KM 22, Pakem, Sleman, DI Yogyakarta");
  const [phone, setPhone] = useState("+62 274-897-1234");
  const [email, setEmail] = useState("info@niskalaretreat.co.id");
  const [website, setWebsite] = useState("https://niskalaretreat.co.id");
  const [desc, setDesc] = useState("Properti glamping premium di kaki Gunung Merapi dengan pemandangan alam yang menakjubkan.");

  return (
    <>
      <div className="settings-section">
        <span className="card-kicker">IDENTITAS PROPERTI</span>
        <h2>Informasi dasar</h2>
        <div className="form-grid">
          <label>
            Nama properti
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Telepon
            <div className="suffix-input">
              <Phone size={14} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </label>
          <label>
            Email
            <div className="suffix-input">
              <Mail size={14} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </label>
          <label>
            Website
            <div className="suffix-input">
              <Globe size={14} />
              <input value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
          </label>
          <label className="full">
            Alamat lengkap
            <div className="suffix-input">
              <MapPin size={14} />
              <input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </label>
          <label className="full">
            Deskripsi
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <span className="card-kicker">FOTO PROPERTI</span>
        <h2>Galeri</h2>
        <p>Upload foto utama properti untuk ditampilkan di halaman booking.</p>
        <div className="photo-upload-grid">
          <div className="photo-upload-card">
            <Camera size={24} />
            <span>Foto utama</span>
            <small>150 × 98px</small>
          </div>
          <div className="photo-upload-card">
            <Camera size={24} />
            <span>Galeri 1</span>
            <small>Opsi</small>
          </div>
          <div className="photo-upload-card">
            <Camera size={24} />
            <span>Galeri 2</span>
            <small>Opsi</small>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <span className="card-kicker">FASILITAS</span>
        <h2>Fasilitas properti</h2>
        <div className="form-grid">
          <label>
            Jumlah total unit
            <input defaultValue="18" readOnly />
          </label>
          <label>
            Kapasitas maks tamu
            <input defaultValue="62" readOnly />
          </label>
        </div>
        <div className="facility-tags">
          {["Wi-Fi", "Area parkir", "Kolam renang", "Restoran", "Spa", "Area BBQ"].map((f) => (
            <span key={f} className="facility-tag">{f}</span>
          ))}
        </div>
      </div>
    </>
  );
}
