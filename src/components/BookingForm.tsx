"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  units,
  bookings,
  formatRp,
  nightsBetween,
  type Booking,
} from "@/lib/data";

type Props = {
  initial?: Booking;
  onClose?: () => void;
};

export default function BookingForm({ initial, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    guest: initial?.guest ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    unitId: initial?.unitId ?? units[0].id,
    checkIn: initial?.checkIn ?? "2026-07-15",
    checkOut: initial?.checkOut ?? "2026-07-16",
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
    router.push("/booking");
  };

  return (
    <div className="modal-layer">
      <div className="backdrop" onClick={onClose} />
      <div className="booking-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">BOOKING BARU</span>
            <h2>{isEdit ? "Edit reservasi" : "Buat reservasi"}</h2>
            <p>Isi data tamu dan detail menginap.</p>
          </div>
          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="modal-form">
            <div className="form-section">
              <h3>Data tamu</h3>
              <div className="form-grid">
                <label>
                  Nama lengkap
                  <input
                    required
                    value={form.guest}
                    onChange={(e) => update("guest", e.target.value)}
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </label>
                <label className="full">
                  Nomor WhatsApp
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Detail menginap</h3>
              <div className="form-grid">
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
                  <textarea />
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
          </div>

          <div className="booking-summary">
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
                <span>{formatRp(unit.baseRate)} × {nights} malam</span>
                <span>{formatRp(pricing.base)}</span>
              </div>
              {form.addExtraBed && (
                <div>
                  <span>Extra bed × {nights}</span>
                  <span>{formatRp(pricing.extraBed)}</span>
                </div>
              )}
              <div>
                <span>Pajak</span>
                <span>{formatRp(pricing.tax)}</span>
              </div>
              <div>
                <span>Service charge</span>
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

          <div className="modal-footer">
            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
            >
              Batal
            </button>
            <button className="primary-button" type="submit" disabled={hasConflict}>
              {isEdit ? "Simpan perubahan" : "Buat booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
