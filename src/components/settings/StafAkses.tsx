"use client";

import { useState } from "react";
import { Ellipsis, Plus, User } from "lucide-react";

const STAFF = [
  { id: "s1", name: "Lucy Andriani", email: "lucy@niskalaretreat.co.id", role: "Owner", status: "active" },
  { id: "s2", name: "Rina Wulandari", email: "rina@niskalaretreat.co.id", role: "Front Office", status: "active" },
  { id: "s3", name: "Adi Nugroho", email: "adi@niskalaretreat.co.id", role: "Housekeeping", status: "active" },
  { id: "s4", name: "Putri Sari", email: "putri@niskalaretreat.co.id", role: "Finance", status: "active" },
  { id: "s5", name: "Budi Santoso", email: "budi@niskalaretreat.co.id", role: "Maintenance", status: "inactive" },
];

const ROLE_COLORS: Record<string, string> = {
  Owner: "#65765d",
  "Front Office": "#087565",
  Housekeeping: "#b96f52",
  Finance: "#c59d5f",
  Maintenance: "#77898b",
};

export default function StafAkses() {
  const [search, setSearch] = useState("");

  const filtered = STAFF.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="settings-section">
        <div className="section-title">
          <div>
            <span className="card-kicker">STAF & ROLE</span>
            <h2>Daftar staf</h2>
          </div>
          <button className="primary-button" type="button">
            <Plus size={16} />
            Tambah staf
          </button>
        </div>

        <div className="staff-search">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau role..."
          />
        </div>

        <div className="staff-list">
          {filtered.map((s) => (
            <div className="staff-row" key={s.id}>
              <div className="guest-avatar">
                <User size={14} />
              </div>
              <div>
                <strong>{s.name}</strong>
                <span>{s.email}</span>
              </div>
              <span
                className="staff-role"
                style={{ background: ROLE_COLORS[s.role] ?? "#65765d" }}
              >
                {s.role}
              </span>
              <span className={`staff-status ${s.status}`}>
                {s.status === "active" ? "Aktif" : "Non-aktif"}
              </span>
              <button className="row-more" type="button">
                <Ellipsis size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <span className="card-kicker">HAK AKSES PER ROLE</span>
        <h2>Permission matrix</h2>
        <p>Tentukan menu mana yang bisa diakses oleh setiap role.</p>

        <div className="permission-grid">
          <div className="permission-header">
            <span>Modul</span>
            <span>Owner</span>
            <span>Front Office</span>
            <span>Finance</span>
          </div>
          {[
            { modul: "Dashboard", fo: true, fi: true },
            { modul: "Kalender", fo: true, fi: false },
            { modul: "Booking", fo: true, fi: false },
            { modul: "Unit & Properti", fo: false, fi: false },
            { modul: "Rate & Harga", fo: false, fi: false },
            { modul: "Keuangan", fo: false, fi: true },
            { modul: "Laporan", fo: true, fi: true },
            { modul: "Pengaturan", fo: false, fi: false },
          ].map((r) => (
            <div className="permission-row" key={r.modul}>
              <span>{r.modul}</span>
              <span className="perm-check on">Ya</span>
              <span className={`perm-check ${r.fo ? "on" : ""}`}>
                {r.fo ? "Ya" : "—"}
              </span>
              <span className={`perm-check ${r.fi ? "on" : ""}`}>
                {r.fi ? "Ya" : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
