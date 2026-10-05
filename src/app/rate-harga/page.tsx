"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import ConfirmModal from "@/components/ConfirmModal";
import { units, formatRp, type Unit } from "@/lib/data";

type Seasonal = {
  id: string;
  label: string;
  period: string;
  bump: string;
  color: string;
  unitName: string;
};

const SEASONAL: Seasonal[] = [
  { id: "s1", label: "Libur sekolah", period: "20 Jun — 19 Jul 2026", bump: "+25%", color: "terracotta", unitName: "Semua unit" },
  { id: "s2", label: "Long weekend", period: "15 — 17 Agu 2026", bump: "+30%", color: "gold", unitName: "Merapi 01, Rinjani 01" },
  { id: "s3", label: "Tahun baru", period: "29 Des — 2 Jan 2027", bump: "+40%", color: "green", unitName: "Semua unit" },
];

export default function RateHargaPage() {
  const router = useRouter();
  const [weekendOn, setWeekendOn] = useState(true);
  const [weekendPct, setWeekendPct] = useState("20");
  const [rates, setRates] = useState<Unit[]>(units);
  const [seasonal, setSeasonal] = useState<Seasonal[]>(SEASONAL);
  const [editRate, setEditRate] = useState<{ unitId: string; baseRate: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);

  const bump = Math.min(200, Math.max(0, Number(weekendPct) || 0));

  const weekendRate = useMemo(
    () => (base: number) =>
      weekendOn ? formatRp(Math.round(base * (1 + bump / 100))) : "—",
    [weekendOn, bump],
  );

  const saveRate = () => {
    if (!editRate) return;
    if (editRate.baseRate <= 0) {
      toast.error("Harga dasar harus lebih dari 0");
      return;
    }
    setRates((prev) =>
      prev.map((u) =>
        u.id === editRate.unitId ? { ...u, baseRate: editRate.baseRate } : u,
      ),
    );
    setEditRate(null);
    toast.success("Harga dasar diperbarui");
  };

  const removeSeasonal = () => {
    if (!deleteTarget) return;
    setSeasonal((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success(`Override "${deleteTarget.label}" dihapus`);
  };

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
              <div className={weekendOn ? undefined : "is-off"}>WEEKEND</div>
              <div>KAPASITAS</div>
              <div className="col-actions">AKSI</div>
            </div>
            {rates.map((u) => (
              <div className="rate-row" key={u.id}>
                <div className="rate-unit">
                  <i style={{ background: u.accent }} />
                  <div>
                    <strong>{u.name}</strong>
                    <small>{u.type}</small>
                  </div>
                </div>
                <div>{formatRp(u.baseRate)}</div>
                <div>{weekendRate(u.baseRate)}</div>
                <div className="rate-cap">{u.capacity} tamu</div>
                <div className="col-actions">
                  <button
                    type="button"
                    title={`Edit harga ${u.name}`}
                    onClick={() =>
                      setEditRate({ unitId: u.id, baseRate: u.baseRate })
                    }
                  >
                    <Pencil size={16} />
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
                aria-pressed={weekendOn}
                aria-label="Aktifkan harga weekend"
                onClick={() => setWeekendOn(!weekendOn)}
              >
                <i />
              </button>
            </div>
            <div className="setting-line" style={{ marginTop: 17 }}>
              <div>
                <strong>Kenaikan</strong>
                <span>Dihitung dari harga dasar</span>
              </div>
              <div className="pct-input">
                <input
                  type="number"
                  min={0}
                  max={200}
                  disabled={!weekendOn}
                  value={weekendPct}
                  aria-label="Persentase kenaikan weekend"
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
              <em>{seasonal.length}</em>
            </div>
            {seasonal.length === 0 ? (
              <p className="season-empty">
                Belum ada override aktif. Harga saat ini mengikuti rate dasar.
              </p>
            ) : (
              seasonal.map((s) => (
                <div className="season-item" key={s.id}>
                  <i className={s.color} />
                  <div className="season-info">
                    <strong>{s.label}</strong>
                    <span>
                      {s.period} · {s.unitName}
                    </span>
                  </div>
                  <b>{s.bump}</b>
                  <div className="row-actions">
                    <button
                      type="button"
                      title={`Edit override ${s.label}`}
                      onClick={() =>
                        toast("Fitur edit override belum tersedia")
                      }
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      title={`Hapus override ${s.label}`}
                      onClick={() =>
                        setDeleteTarget({ id: s.id, label: s.label })
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </div>

      {editRate && (
        <div className="modal-layer">
          <div className="backdrop" onClick={() => setEditRate(null)} />
          <div className="booking-modal rate-modal">
            <div className="modal-head">
              <div>
                <span className="card-kicker">EDIT RATE</span>
                <h2>
                  {rates.find((u) => u.id === editRate.unitId)?.name}
                </h2>
                <p>Harga dasar per malam untuk unit ini.</p>
              </div>
              <button type="button" onClick={() => setEditRate(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-form">
              <div className="form-grid">
                <label>
                  Harga dasar
                  <div className="suffix-input">
                    <input
                      type="number"
                      min={0}
                      step={50_000}
                      value={editRate.baseRate}
                      autoFocus
                      onChange={(e) =>
                        setEditRate({
                          ...editRate,
                          baseRate: Number(e.target.value),
                        })
                      }
                    />
                    <span>Rp</span>
                  </div>
                </label>
                <label>
                  Harga weekend
                  <div className="rate-readonly">
                    {weekendOn
                      ? formatRp(
                          Math.round(editRate.baseRate * (1 + bump / 100)),
                        )
                      : "Nonaktif"}
                    <small>
                      {weekendOn ? `+${bump}% dari harga dasar` : "Weekend dimatikan"}
                    </small>
                  </div>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setEditRate(null)}
              >
                Batal
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={saveRate}
              >
                Simpan harga
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus rate override?"
        message={`Override "${deleteTarget?.label}" akan dihapus permanen. Harga akan kembali ke rate dasar.`}
        confirmLabel="Hapus override"
        onConfirm={removeSeasonal}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppShell>
  );
}