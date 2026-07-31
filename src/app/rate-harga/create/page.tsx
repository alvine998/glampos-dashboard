"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import { units, formatRp } from "@/lib/data";

const SEASON_OPTIONS = ["Libur sekolah", "Long weekend", "Tahun baru", "Lebaran", "Nataru"];

export default function RateCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    label: "",
    season: SEASON_OPTIONS[0],
    startDate: "2026-07-20",
    endDate: "2026-07-25",
    bumpPct: 25,
    unitId: units[0].id,
  });

  const update = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const unit = units.find((u) => u.id === form.unitId) ?? units[0];
  const weekendRate = Math.round(1.2 * unit.baseRate);
  const seasonalRate = Math.round(unit.baseRate * (1 + form.bumpPct / 100));

  return (
    <AppShell>
      <button
        className="text-button"
        type="button"
        onClick={() => router.push("/rate-harga")}
        style={{ marginBottom: 12, display: "inline-flex", alignItems: "center", gap: 5 }}
      >
        <ArrowLeft size={14} />
        Kembali
      </button>
      <PageHeader
        title="Tambah rate override"
        description="Buat harga musiman untuk unit tertentu."
      />
      <section className="card settings-form">
        <div className="settings-section">
          <span className="card-kicker">DETAIL OVERRIDE</span>
          <h2>Override harga</h2>
          <div className="form-grid">
            <label>
              Nama override
              <input
                value={form.label}
                onChange={(e) => update("label", e.target.value)}
                placeholder="Contoh: Libur sekolah"
              />
            </label>
            <label>
              Tipe musim
              <select value={form.season} onChange={(e) => update("season", e.target.value)}>
                {SEASON_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              Unit
              <select value={form.unitId} onChange={(e) => update("unitId", e.target.value)}>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.type}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Kenaikan (%)
              <div className="suffix-input">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.bumpPct}
                  onChange={(e) => update("bumpPct", +e.target.value)}
                />
                <span>%</span>
              </div>
            </label>
            <label>
              Tanggal mulai
              <input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
            </label>
            <label>
              Tanggal akhir
              <input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} />
            </label>
          </div>
        </div>
        <div className="settings-section">
          <span className="card-kicker">PREVIEW HARGA</span>
          <h2>Perbandingan rate</h2>
          <div className="rate-preview-grid">
            <div className="rate-preview-card">
              <span>Hari biasa</span>
              <strong>{formatRp(unit.baseRate)}</strong>
              <small>/malam</small>
            </div>
            <div className="rate-preview-card">
              <span>Weekend</span>
              <strong>{formatRp(weekendRate)}</strong>
              <small>/malam</small>
            </div>
            <div className="rate-preview-card active">
              <span>Seasonal (+{form.bumpPct}%)</span>
              <strong>{formatRp(seasonalRate)}</strong>
              <small>/malam</small>
            </div>
          </div>
        </div>
        <div className="settings-footer">
          <span>Unit: {unit.name} · {form.startDate} — {form.endDate}</span>
          <button className="primary-button" type="button" onClick={() => router.push("/rate-harga")}>
            Simpan override
          </button>
        </div>
      </section>
    </AppShell>
  );
}
