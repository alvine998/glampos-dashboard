"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Ban,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import {
  TODAY,
  units,
  bookings,
  maintenance,
  addDays,
} from "@/lib/data";

export default function KalenderPage() {
  const [offset, setOffset] = useState(0);

  const dates = useMemo(
    () => Array.from({ length: 12 }, (_, i) => addDays(TODAY, offset + i)),
    [offset],
  );

  const monthLabel = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${dates[0]}T00:00:00`));

  return (
    <AppShell>
      <PageHeader
        title="Kalender ketersediaan"
        description="Kelola booking, check-in, dan blokir unit dalam satu tampilan."
        action={
          <button className="primary-button" type="button">
            <Plus size={18} />
            Booking baru
          </button>
        }
      />

      <section className="card calendar-card">
        <div className="calendar-toolbar">
          <div className="date-navigation">
            <button type="button" onClick={() => setOffset((o) => o - 7)}>
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="today-button"
              onClick={() => setOffset(0)}
            >
              Hari ini
            </button>
            <button type="button" onClick={() => setOffset((o) => o + 7)}>
              <ChevronRight size={18} />
            </button>
            <strong>{monthLabel}</strong>
          </div>
          <div className="calendar-controls">
            <button type="button">
              <Filter size={16} />
              Semua tipe unit
            </button>
            <button type="button">
              <Ban size={16} />
              Blokir tanggal
            </button>
          </div>
        </div>

        <div className="calendar-legend">
          <span>
            <i className="available" />
            Tersedia
          </span>
          <span>
            <i className="booked" />
            Booking
          </span>
          <span>
            <i className="inhouse" />
            Check-in
          </span>
          <span>
            <i className="maintenance" />
            Maintenance
          </span>
        </div>

        <div className="calendar-scroll">
          <div
            className="calendar-grid"
            style={{
              gridTemplateColumns: `190px repeat(${dates.length}, minmax(74px, 1fr))`,
            }}
          >
            <div className="calendar-corner">UNIT / TANGGAL</div>
            {dates.map((d) => (
              <div
                key={d}
                className={`date-head ${d === TODAY ? "today" : ""}`}
              >
                <span>
                  {new Intl.DateTimeFormat("id-ID", {
                    weekday: "short",
                  }).format(new Date(`${d}T00:00:00`))}
                </span>
                <strong>{new Date(`${d}T00:00:00`).getDate()}</strong>
              </div>
            ))}

            {units.map((unit) => (
              <UnitRow key={unit.id} unit={unit} dates={dates} />
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function UnitRow({
  unit,
  dates,
}: {
  unit: (typeof units)[number];
  dates: string[];
}) {
  return (
    <>
      <div className="unit-cell">
        <div className="unit-dot" style={{ background: unit.accent }} />
        <div>
          <strong>{unit.name}</strong>
          <span>
            {unit.type} · {unit.capacity} pax
          </span>
        </div>
      </div>
      {dates.map((date) => {
        const booking = bookings.find(
          (b) =>
            b.unitId === unit.id &&
            b.status !== "cancelled" &&
            date >= b.checkIn &&
            date < b.checkOut,
        );
        const block = maintenance.find(
          (m) =>
            m.unitId === unit.id && date >= m.start && date < m.end,
        );
        const isFirst = booking?.checkIn === date;
        const isMaintFirst = block?.start === date;

        return (
          <div
            key={date}
            className={`calendar-cell ${date === TODAY ? "today-col" : ""}`}
          >
            {booking && (
              <button
                type="button"
                className={`booking-bar ${
                  booking.status === "checked-in"
                    ? "checked"
                    : booking.status === "pending"
                      ? "pending"
                      : ""
                } ${isFirst ? "bar-first" : ""}`}
                title={booking.guest}
              >
                {isFirst ? booking.guest : ""}
              </button>
            )}
            {block && (
              <div
                className={`maintenance-bar ${isMaintFirst ? "bar-first" : ""}`}
              >
                {isMaintFirst ? "Maintenance" : ""}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
