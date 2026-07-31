"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import {
  units,
  bookings,
  formatRp,
  nightsBetween,
  type Booking,
} from "@/lib/data";

type Props = {
  initial?: Booking;
  backTo?: string;
};

export default function BookingForm(props: Props) {
  return (
    <Suspense fallback={null}>
      <BookingFormInner {...props} />
    </Suspense>
  );
}

function BookingFormInner({ initial, backTo }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = !!initial;

  const presetUnit =
    searchParams.get("unit") ?? initial?.unitId ?? units[0].id;
  const presetCheckIn =
    searchParams.get("checkIn") ?? initial?.checkIn ?? "2026-07-15";
  const presetCheckOut = initial?.checkOut ?? "2026-07-16";

  const [form, setForm] = useState({
    guest: initial?.guest ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    unitId: presetUnit,
    checkIn: presetCheckIn,
    checkOut: presetCheckOut,
    guests: initial?.guests ?? 2,
    notes: "",
    addExtraBed: false,
  });

  const update = (field: string, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const unit = units.find((u) => u.id === form.unitId) ?? units[0];

  const nights = nightsBetween(form.checkIn, form.checkOut);

  const hasConflict = useMemo(() => {
    return bookings.some(
      (b) =>
        b.id !== initial?.id &&
        b.unitId === form.unitId &&
        b.status !== "cancelled" &&
        form.checkIn < b.checkOut &&
        form.checkOut > b.checkIn,
    );
  }, [form.unitId, form.checkIn, form.checkOut, initial?.id]);

  const pricing = useMemo(() => {
    const base = unit.baseRate * nights;
    const extraBed = form.addExtraBed ? 250_000 * nights : 0;
    const subtotal = base + extraBed;
    const tax = Math.round(subtotal * 0.1);
    const service = Math.round(subtotal * 0.05);
    const total = subtotal + tax + service;
    return { base, extraBed, subtotal, tax, service, total };
  }, [unit, nights, form.addExtraBed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(backTo ?? "/booking");
  };

  const handleBack = () => router.push(backTo ?? "/booking");

  return (
    <AppShell>
      <button
        className="text-button"
        type="button"
        onClick={handleBack}
        style={{
          marginBottom: 12,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <ArrowLeft size={14} />
        Kembali
      </button>
      <PageHeader
        title={isEdit ? "Edit reservasi" : "Buat reservasi baru"}
        description="Isi data tamu dan detail menginap."
      />

      <form
        className="booking-form-layout"
        onSubmit={handleSubmit}
        style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}
      >
        <div className="card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 22 }}>
            <span className="card-kicker">DATA TAMU</span>
            <h2
              style={{ margin: "4px 0 0", font: "700 14px Manrope" }}
            >
              Identitas tamu
            </h2>
          </div>
          <div className="form-grid">
            <label>
              Nama lengkap
              <input
                required
                value={form.guest}
                onChange={(e) => update("guest", e.target.value)}
                placeholder="Nama lengkap tamu"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="email@contoh.com"
              />
            </label>
            <label className="full">
              Nomor WhatsApp
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="08xxxxxxxxxx"
              />
            </label>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--line)",
              marginTop: 22,
              paddingTop: 22,
            }}
          >
            <span className="card-kicker">DETAIL MENGINAP</span>
            <h2
              style={{ margin: "4px 0 0", font: "700 14px Manrope" }}
            >
              Unit &amp; tanggal
            </h2>
          </div>
          <div className="form-grid" style={{ marginTop: 15 }}>
            <label>
              Unit
              <select
                value={form.unitId}
                onChange={(e) => update("unitId", e.target.value)}
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.type}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Jumlah tamu
              <input
                type="number"
                min={1}
                max={unit.capacity}
                value={form.guests}
                onChange={(e) => update("guests", +e.target.value)}
              />
            </label>
            <label>
              Check-in
              <input
                type="date"
                value={form.checkIn}
                onChange={(e) => update("checkIn", e.target.value)}
              />
            </label>
            <label>
              Check-out
              <input
                type="date"
                value={form.checkOut}
                onChange={(e) => update("checkOut", e.target.value)}
              />
            </label>
            <label className="full">
              Catatan khusus
              <textarea placeholder="Permintaan tamu, catatan khusus..." />
            </label>
            <label className="checkbox-label full">
              <input
                type="checkbox"
                checked={form.addExtraBed}
                onChange={(e) => update("addExtraBed", e.target.checked)}
              />
              <div>
                <span>Extra bed</span>
                <small>+Rp250.000/malam</small>
              </div>
            </label>
          </div>
          {hasConflict && (
            <div className="conflict-message">
              <span>Tanggal bertabrakan</span>
              <span>
                Unit ini sudah terisi pada sebagian tanggal yang dipilih.
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <span className="card-kicker">RINGKASAN HARGA</span>
            <div className="summary-unit">
              <div className="summary-photo">{unit.name[0]}</div>
              <div>
                <strong>{unit.name}</strong>
                <span>
                  {unit.type} · {unit.capacity} pax
                </span>
              </div>
            </div>

            <div className="stay-summary">
              <div>
                <span>{form.checkIn}</span>
                <i />
                <span>{form.checkOut}</span>
              </div>
              <small>{nights} malam</small>
            </div>

            <div className="price-lines">
              <div>
                <span>
                  {formatRp(unit.baseRate)} × {nights} malam
                </span>
                <span>{formatRp(pricing.base)}</span>
              </div>
              {form.addExtraBed && (
                <div>
                  <span>Extra bed × {nights}</span>
                  <span>{formatRp(pricing.extraBed)}</span>
                </div>
              )}
              <div>
                <span>Pajak (10%)</span>
                <span>{formatRp(pricing.tax)}</span>
              </div>
              <div>
                <span>Service charge (5%)</span>
                <span>{formatRp(pricing.service)}</span>
              </div>
            </div>

            <div className="price-total">
              <span>Total</span>
              <strong>{formatRp(pricing.total)}</strong>
            </div>

            <div className="deposit-note">
              <div>
                <span>DP minimum 50%</span>
                <strong>{formatRp(Math.round(pricing.total * 0.5))}</strong>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <button
              className="primary-button"
              type="submit"
              disabled={hasConflict}
              style={{ width: "100%", height: 42 }}
            >
              {isEdit ? "Simpan perubahan" : "Buat booking"}
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={handleBack}
              style={{ width: "100%", height: 42 }}
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </AppShell>
  );
}
