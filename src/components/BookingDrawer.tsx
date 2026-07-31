"use client";

import { X } from "lucide-react";
import { formatRp, formatShortDate, nightsBetween, STATUS_LABEL, type Booking } from "@/lib/data";
import StatusBadge from "./StatusBadge";

export default function BookingDrawer({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const paidPct = Math.round((booking.paid / booking.total) * 100);

  return (
    <div className="drawer-layer">
      <div className="backdrop" onClick={onClose} />
      <aside className="booking-drawer">
        <div className="drawer-head">
          <div>
            <span className="eyebrow">DETAIL BOOKING</span>
            <h2>{booking.code}</h2>
          </div>
          <div className="drawer-status">
            <StatusBadge status={booking.status} />
          </div>
          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="guest-profile">
            <div className="large-avatar">
              {booking.guest
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <span>Tamu utama</span>
              <h3>{booking.guest}</h3>
              <p>{booking.email}</p>
              <p>{booking.phone}</p>
            </div>
          </div>

          <div className="stay-card">
            <div>
              <span>CHECK-IN</span>
              <strong>{formatShortDate(booking.checkIn)}</strong>
              <small>Mulai 14:00</small>
            </div>
            <i />
            <div>
              <span>CHECK-OUT</span>
              <strong>{formatShortDate(booking.checkOut)}</strong>
              <small>Sebelum 11:00</small>
            </div>
          </div>

          <div className="drawer-section">
            <h3>Detail unit</h3>
            <div className="detail-row">
              <div className="summary-photo">{booking.unitName[0]}</div>
              <div>
                <strong>{booking.unitName}</strong>
                <span>{nights} malam · {booking.guests} tamu</span>
              </div>
            </div>
          </div>

          <div className="drawer-section">
            <h3>Pembayaran</h3>
            <div className="section-title">
              <span>
                Terbayar <strong>{formatRp(booking.paid)}</strong> dari{" "}
                {formatRp(booking.total)}
              </span>
            </div>
            <div className="payment-progress">
              <div>
                <span>{STATUS_LABEL[booking.status]}</span>
                <span>{paidPct}%</span>
              </div>
              <div className="progress">
                <i style={{ width: `${paidPct}%` }} />
              </div>
              <small>
                {paidPct >= 100
                  ? "Pembayaran lunas"
                  : `Sisa ${formatRp(booking.total - booking.paid)}`}
              </small>
            </div>
          </div>

          <div className="drawer-section">
            <h3>Aktivitas terakhir</h3>
            <div className="audit-preview">
              <div>
                <strong>Booking dibuat</strong>
                <span>
                  {formatShortDate(booking.createdAt.slice(0, 10))} · Sistem
                  otomatis
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="secondary-button" type="button" onClick={onClose}>
            Kelola booking
          </button>
        </div>
      </aside>
    </div>
  );
}
