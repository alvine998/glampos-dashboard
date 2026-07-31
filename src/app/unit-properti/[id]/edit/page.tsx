"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import { units, formatRp } from "@/lib/data";

const TYPES = ["Safari Tent", "Dome Suite", "Family Lodge", "Cabin"];

export default function UnitEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const unit = units.find((u) => u.id === id);

  const [form, setForm] = useState({
    name: unit?.name ?? "",
    type: unit?.type ?? TYPES[0],
    capacity: unit?.capacity ?? 2,
    baseRate: unit?.baseRate ?? 1250000,
    status: unit?.status ?? "active",
  });

  const update = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  if (!unit) {
    return (
      <AppShell>
        <div style={{ padding: 40, textAlign: "center", color: "#92958f" }}>
          Unit tidak ditemukan.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <button
        className="text-button"
        type="button"
        onClick={() => router.push("/unit-properti")}
        style={{ marginBottom: 12, display: "inline-flex", alignItems: "center", gap: 5 }}
      >
        <ArrowLeft size={14} />
        Kembali
      </button>
      <PageHeader
        title={`Edit ${unit.name}`}
        description="Perbarui informasi unit."
      />
      <section className="card settings-form">
        <div className="settings-section">
          <span className="card-kicker">DATA UNIT</span>
          <h2>Identitas unit</h2>
          <div className="form-grid">
            <label>
              Nama unit
              <input value={form.name} onChange={(e) => update("name", e.target.value)} />
            </label>
            <label>
              Tipe unit
              <select value={form.type} onChange={(e) => update("type", e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Kapasitas maks tamu
              <input
                type="number"
                min={1}
                max={20}
                value={form.capacity}
                onChange={(e) => update("capacity", +e.target.value)}
              />
            </label>
            <label>
              Harga dasar / malam
              <div className="suffix-input">
                <input
                  type="number"
                  value={form.baseRate}
                  onChange={(e) => update("baseRate", +e.target.value)}
                />
                <span>Rp</span>
              </div>
            </label>
            <label>
              Status
              <select value={form.status} onChange={(e) => update("status", e.target.value)}>
                <option value="active">Aktif</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </label>
          </div>
        </div>
        <div className="settings-footer">
          <span>Preview: {form.name} · {form.type} · {formatRp(form.baseRate)}/malam</span>
          <button className="primary-button" type="button" onClick={() => router.push("/unit-properti")}>
            Simpan perubahan
          </button>
        </div>
      </section>
    </AppShell>
  );
}
