"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, Users, CheckCircle, Pencil, Trash2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import ConfirmModal from "@/components/ConfirmModal";
import { units, formatRp } from "@/lib/data";

const PHOTOS = ["photo-1", "photo-2", "photo-3", "photo-4", "photo-5"];

export default function UnitPropertiPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filtered = units.filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.type.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <PageHeader
        title="Unit & Properti"
        description="Atur inventaris, fasilitas, dan status unit Niskala Retreat."
        action={
          <div className="header-actions">
            <button className="secondary-button" type="button">
              <Building2 size={17} />
              Edit properti
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={() => router.push("/unit-properti/create")}
            >
              Tambah unit
            </button>
          </div>
        }
      />

      <section className="property-hero card">
        <div className="property-photo">
          <Building2 size={45} />
        </div>
        <div className="property-info">
          <span className="eyebrow">PROPERTI AKTIF</span>
          <h2>Niskala Retreat</h2>
          <p>Jl. Kaliurang KM 22, Pakem, Sleman, DI Yogyakarta</p>
          <div>
            <span>
              <Building2 size={16} />
              {units.length} unit
            </span>
            <span>
              <Users size={16} />
              Maks. {units.reduce((s, u) => s + u.capacity, 0)} tamu
            </span>
            <span>
              <CheckCircle size={16} />
              Aktif
            </span>
          </div>
        </div>
        <div className="property-score">
          <span>Kelengkapan profil</span>
          <strong>92%</strong>
          <div><i /></div>
        </div>
      </section>

      <div className="unit-header">
        <div>
          <h2>Daftar unit</h2>
          <span>{filtered.length} dari {units.length} unit ditampilkan</span>
        </div>
        <div className="table-search compact">
          <Search size={17} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari unit"
          />
        </div>
      </div>

      <div className="units-grid">
        {filtered.map((unit, i) => (
          <section className="unit-card card" key={unit.id}>
            <div className={`unit-photo ${PHOTOS[i % PHOTOS.length]}`}>
              <Building2 size={35} />
              <span className={`unit-availability ${unit.status === "maintenance" ? "maintenance" : ""}`}>
                {unit.status === "maintenance" ? "Maintenance" : "Aktif"}
              </span>
            </div>
            <div className="unit-card-body">
              <div>
                <span>{unit.type}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => router.push(`/unit-properti/${unit.id}/edit`)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: unit.id, name: unit.name })}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3>{unit.name}</h3>
              <p>
                <Users size={15} />
                Maks. {unit.capacity} tamu · 1 king bed
              </p>
              <div className="unit-price">
                <span>Harga dasar</span>
                <strong>
                  {formatRp(unit.baseRate)}
                  <small>/malam</small>
                </strong>
              </div>
            </div>
          </section>
        ))}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus unit?"
        message={`Unit "${deleteTarget?.name}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus unit"
        onConfirm={() => {
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppShell>
  );
}
