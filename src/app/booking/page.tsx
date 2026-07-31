"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Download,
  Ellipsis,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import {
  bookings,
  formatRp,
  formatShortDate,
  nightsBetween,
  type BookingStatus,
} from "@/lib/data";

const TABS: { id: "all" | BookingStatus; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "pending", label: "Menunggu DP" },
  { id: "confirmed", label: "Terkonfirmasi" },
  { id: "checked-in", label: "In-house" },
];

export default function BookingPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | BookingStatus>("all");

  const filtered = useMemo(
    () =>
      bookings.filter(
        (b) =>
          (b.guest.toLowerCase().includes(q.toLowerCase()) ||
            b.code.toLowerCase().includes(q.toLowerCase())) &&
          (tab === "all" || b.status === tab),
      ),
    [q, tab],
  );

  return (
    <AppShell>
      <PageHeader
        title="Booking"
        description="Kelola seluruh reservasi dan perjalanan tamu."
        action={
          <button
            className="primary-button"
            type="button"
            onClick={() => router.push("/booking/create")}
          >
            <Plus size={18} />
            Booking baru
          </button>
        }
      />

      <section className="card table-card">
        <div className="table-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? "active" : ""}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.id === "all" && <em>{bookings.length}</em>}
            </button>
          ))}
        </div>

        <div className="table-tools">
          <div className="table-search">
            <Search size={17} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama tamu atau kode booking"
            />
          </div>
          <button className="secondary-button" type="button">
            <Filter size={16} />
            Filter
          </button>
          <button className="secondary-button" type="button">
            <Download size={16} />
            Ekspor
          </button>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>BOOKING</th>
                <th>TAMU</th>
                <th>UNIT</th>
                <th>TANGGAL MENGINAP</th>
                <th>STATUS</th>
                <th>PEMBAYARAN</th>
                <th className="col-actions">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => router.push(`/booking/${b.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <strong className="booking-code">{b.code}</strong>
                    <span>{formatShortDate(b.createdAt)}</span>
                  </td>
                  <td>
                    <strong>{b.guest}</strong>
                    <span>{b.phone}</span>
                  </td>
                  <td>
                    <strong>{b.unitName}</strong>
                    <span>{b.guests} tamu</span>
                  </td>
                  <td>
                    <strong>
                      {formatShortDate(b.checkIn)} — {formatShortDate(b.checkOut)}
                    </strong>
                    <span>{nightsBetween(b.checkIn, b.checkOut)} malam</span>
                  </td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td>
                    <strong>{formatRp(b.paid)}</strong>
                    <span>dari {formatRp(b.total)}</span>
                  </td>
                  <td className="col-actions">
                    <button className="row-more" type="button">
                      <Ellipsis size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Menampilkan {filtered.length} dari {bookings.length} booking
          </span>
          <div>
            <button type="button" disabled>
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="active">
              1
            </button>
            <button type="button">2</button>
            <button type="button">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
