"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { bookings, formatRp, formatShortDate, nightsBetween } from "@/lib/data";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const b = bookings.find((bk) => bk.id === id);

  if (!b) {
    return (
      <AppShell>
        <div style={{ padding: 40, textAlign: "center", color: "#92958f" }}>
          Booking tidak ditemukan.
        </div>
      </AppShell>
    );
  }

  const nights = nightsBetween(b.checkIn, b.checkOut);
  const paidPct = Math.round((b.paid / b.total) * 100);

  return (
    <AppShell>
      <div style={{ marginBottom: 12 }}>
        <button
          className="text-button"
          type="button"
          onClick={() => router.push("/booking")}
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <ArrowLeft size={14} />
          Kembali ke daftar
        </button>
      </div>

      <PageHeader
        eyebrow={b.code}
        title={b.guest}
        description={`${b.unitName} · ${formatShortDate(b.checkIn)} — ${formatShortDate(b.checkOut)} · ${nights} malam`}
        action={
          <button
            className="primary-button"
            type="button"
            onClick={() => router.push(`/booking/${id}/edit`)}
          >
            <Pencil size={16} />
            Edit booking
          </button>
        }
      />

      <div className="booking-detail-grid">
        <div className="booking-detail-main">
          <section className="card" style={{ padding: 20 }}>
            <div className="guest-profile">
              <div className="large-avatar">
                {b.guest
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <span>Tamu utama</span>
                <h3>{b.guest}</h3>
                <p>{b.email}</p>
                <p>{b.phone}</p>
              </div>
            </div>
          </section>

          <section className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>
              Detail menginap
            </h3>
            <div className="stay-card">
              <div>
                <span>CHECK-IN</span>
                <strong>{formatShortDate(b.checkIn)}</strong>
                <small>Mulai 14:00</small>
              </div>
              <i />
              <div>
                <span>CHECK-OUT</span>
                <strong>{formatShortDate(b.checkOut)}</strong>
                <small>Sebelum 11:00</small>
              </div>
            </div>
            <div className="detail-row" style={{ marginTop: 16 }}>
              <div className="summary-photo">{b.unitName[0]}</div>
              <div>
                <strong>{b.unitName}</strong>
                <span>
                  {nights} malam · {b.guests} tamu
                </span>
              </div>
            </div>
          </section>

          <section className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>
              Aktivitas terakhir
            </h3>
            <div className="audit-preview">
              <div>
                <strong>Booking dibuat</strong>
                <span>
                  {formatShortDate(b.createdAt.slice(0, 10))} · Sistem otomatis
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="booking-detail-side">
          <section className="card" style={{ padding: 20 }}>
            <div style={{ marginBottom: 14 }}>
              <span className="card-kicker">STATUS</span>
              <div style={{ marginTop: 6 }}>
                <StatusBadge status={b.status} />
              </div>
            </div>

            <div className="payment-progress">
              <div style={{ justifyContent: "space-between", fontSize: 10, display: "flex" }}>
                <span>Pembayaran</span>
                <span>{paidPct}%</span>
              </div>
              <div className="progress">
                <i style={{ width: `${paidPct}%` }} />
              </div>
              <div style={{ justifyContent: "space-between", fontSize: 9, display: "flex" }}>
                <span>Terbayar {formatRp(b.paid)}</span>
                <span>Total {formatRp(b.total)}</span>
              </div>
              <small style={{ color: "#8e928b", fontSize: 8, display: "block", marginTop: 6 }}>
                {paidPct >= 100
                  ? "Pembayaran lunas"
                  : `Sisa ${formatRp(b.total - b.paid)}`}
              </small>
            </div>

            <div className="price-lines" style={{ marginTop: 16 }}>
              <div>
                <span>Harga kamar</span>
                <strong>{formatRp(Math.round(b.total * 0.7))}</strong>
              </div>
              <div>
                <span>Pajak</span>
                <strong>{formatRp(Math.round(b.total * 0.1))}</strong>
              </div>
              <div>
                <span>Service charge</span>
                <strong>{formatRp(Math.round(b.total * 0.2))}</strong>
              </div>
            </div>
            <div className="price-total">
              <span>Total</span>
              <strong>{formatRp(b.total)}</strong>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
