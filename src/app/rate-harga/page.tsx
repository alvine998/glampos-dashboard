"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import ConfirmModal from "@/components/ConfirmModal";
import { units, formatRp } from "@/lib/data";

const SEASONAL = [
  { id: "s1", label: "Libur sekolah", period: "20 Jun — 19 Jul 2026", bump: "+25%", color: "terracotta", unitName: "Semua unit" },
  { id: "s2", label: "Long weekend", period: "15 — 17 Agu 2026", bump: "+30%", color: "gold", unitName: "Merapi 01, Rinjani 01" },
  { id: "s3", label: "Tahun baru", period: "29 Des — 2 Jan 2027", bump: "+40%", color: "green", unitName: "Semua unit" },
];

export default function RateHargaPage() {
  const router = useRouter();
  const [weekendOn, setWeekendOn] = useState(true);
  const [weekendPct, setWeekendPct] = useState("20");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);

  return (
    <AppShell>
      <PageHeader
        title="Rate & Harga"
        description="Kelola harga dasar, weekend, dan override musiman."
        action={
          <button
            className="primary-button"
            type="button"
            onClick={() => router.push("/rate-harga/create")}
          >
            <Plus size={18} />
            Tambah rate override
          </button>
        }
      />

      <div className="rates-grid">
        <section className="card rate-main">
          <div className="card-head">
            <div>
              <span className="card-kicker">RATE PLAN UTAMA</span>
              <h2>Best Available Rate</h2>
            </div>
            <span className="active-pill">Aktif</span>
          </div>

          <div className="rate-table">
            <div className="rate-row head">
              <div>UNIT</div>
              <div>HARI BIASA</div>
              <div>WEEKEND</div>
              <div>KAPASITAS</div>
              <div />
            </div>
            {units.map((u) => (
              <div className="rate-row" key={u.id}>
                <div>
                  <i style={{ background: u.accent }} />
                  <div>
                    {u.name}
                    <small>{u.type}</small>
                  </div>
                </div>
                <div>{formatRp(u.baseRate)}</div>
                <div>{formatRp(Math.round(1.2 * u.baseRate))}</div>
                <div>{u.capacity} tamu</div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button">
                    <Pencil size={16} />
                  </button>
                  <button type="button">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="rate-side">
          <section className="card weekend-card">
            <div className="setting-line">
              <div>
                <strong>Harga weekend</strong>
                <span>Jumat dan Sabtu</span>
              </div>
              <button
                className={`toggle ${weekendOn ? "on" : ""}`}
                type="button"
                onClick={() => setWeekendOn(!weekendOn)}
              >
                <i />
              </button>
            </div>
            <div className="setting-line" style={{ marginTop: 17 }}>
              <div><strong>Kenaikan</strong></div>
              <div className="suffix-input">
                <input
                  value={weekendPct}
                  onChange={(e) => setWeekendPct(e.target.value)}
                />
                <span>%</span>
              </div>
            </div>
          </section>

          <section className="card seasonal-card">
            <div className="card-head">
              <div>
                <span className="card-kicker">OVERRIDE AKTIF</span>
                <h2>Harga musiman</h2>
              </div>
              <em>{SEASONAL.length}</em>
            </div>
            {SEASONAL.map((s) => (
              <div className="season-item" key={s.id}>
                <i className={s.color} />
                <div>
                  <strong>{s.label}</strong>
                  <span>{s.period} · {s.unitName}</span>
                </div>
                <b>{s.bump}</b>
                <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
                  <button type="button">
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: s.id, label: s.label })}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus rate override?"
        message={`Override "${deleteTarget?.label}" akan dihapus permanen. Harga akan kembali ke rate dasar.`}
        confirmLabel="Hapus override"
        onConfirm={() => {
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppShell>
  );
}
