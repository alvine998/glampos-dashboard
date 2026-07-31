import {
  Ellipsis,
  ChevronRight,
  Plus,
  Clock3,
  Gauge,
  CircleDollarSign,
  BedDouble,
  WalletCards,
  ArrowUpRight,
  TrendingUp,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import { bookings, TODAY } from "@/lib/data";

const kpis = [
  {
    icon: Gauge,
    label: "Okupansi hari ini",
    value: "72%",
    sub: "13 dari 18 unit",
    delta: "+8%",
    tone: "positive" as const,
  },
  {
    icon: CircleDollarSign,
    label: "Pendapatan hari ini",
    value: "Rp12,8 jt",
    sub: "Target Rp15 juta",
    delta: "85%",
    tone: "positive" as const,
  },
  {
    icon: BedDouble,
    label: "Booking aktif",
    value: "18",
    sub: "5 booking baru",
    delta: "+12%",
    tone: "positive" as const,
  },
  {
    icon: WalletCards,
    label: "Belum dibayar",
    value: "Rp6,4 jt",
    sub: "4 transaksi",
    delta: "Perlu aksi",
    tone: "warning" as const,
  },
];

const chartLine =
  "M0,155 C45,138 62,145 103,124 C142,103 168,120 205,94 C244,68 275,89 310,73 C350,55 379,80 412,60 C451,38 478,60 514,43 C555,24 583,54 617,34 C654,15 684,32 720,18";

const chartPoints: Array<[number, number]> = [
  [0, 155],
  [103, 124],
  [205, 94],
  [310, 73],
  [412, 60],
  [514, 43],
  [617, 34],
  [720, 18],
];

const checkIns = bookings.filter(
  (b) => b.checkIn === TODAY && b.status !== "cancelled",
);
const checkOuts = bookings.filter(
  (b) => b.checkOut === TODAY && b.status !== "cancelled",
);

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="RABU, 15 JULI 2026"
        title="Selamat pagi, Lucy"
        description="Berikut ringkasan operasional Niskala Retreat hari ini."
        action={
          <button className="primary-button" type="button">
            <Plus size={18} />
            Booking baru
          </button>
        }
      />

      <div className="alert-strip">
        <div className="alert-icon">
          <Clock3 size={19} />
        </div>
        <div>
          <strong>3 booking menunggu verifikasi DP</strong>
          <span>Periksa sebelum masa tahan 24 jam berakhir.</span>
        </div>
        <button type="button">
          Periksa pembayaran <ChevronRight size={16} />
        </button>
      </div>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <section className="card kpi-card" key={kpi.label}>
            <div className="kpi-top">
              <div className="kpi-icon">
                <kpi.icon size={20} />
              </div>
              <Ellipsis size={18} />
            </div>
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
            <div className="kpi-bottom">
              <small>{kpi.sub}</small>
              <em className={kpi.tone}>
                {kpi.tone === "positive" && <ArrowUpRight size={13} />}
                {kpi.delta}
              </em>
            </div>
          </section>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="card chart-card">
          <div className="card-head">
            <div>
              <span className="card-kicker">PERFORMA 14 HARI</span>
              <h2>Okupansi &amp; pendapatan</h2>
            </div>
            <div className="period-select">
              14 hari terakhir <ChevronDown size={15} />
            </div>
          </div>
          <div className="chart-summary">
            <div>
              <span>Pendapatan</span>
              <strong>Rp128,4 jt</strong>
              <em>
                <ArrowUpRight size={14} /> 14,2%
              </em>
            </div>
            <div>
              <span>Rata-rata okupansi</span>
              <strong>68,5%</strong>
            </div>
          </div>
          <div className="revenue-chart">
            <div className="axis-labels">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            <svg
              viewBox="0 0 720 205"
              preserveAspectRatio="none"
              aria-label="Grafik okupansi"
            >
              <defs>
                <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#0DAE3F" stopOpacity=".24" />
                  <stop offset="1" stopColor="#0DAE3F" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[20, 62, 104, 146, 188].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="720"
                  y1={y}
                  y2={y}
                  stroke="#e8e2d8"
                  strokeDasharray="4 5"
                />
              ))}
              <path d={`${chartLine} L720,205 L0,205 Z`} fill="url(#area)" />
              <path
                d={chartLine}
                fill="none"
                stroke="#0DAE3F"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {chartPoints.map(([cx, cy]) => (
                <circle
                  key={cx}
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="#fff"
                  stroke="#0DAE3F"
                  strokeWidth="2.5"
                />
              ))}
            </svg>
            <div className="x-labels">
              <span>2 Jul</span>
              <span>4 Jul</span>
              <span>6 Jul</span>
              <span>8 Jul</span>
              <span>10 Jul</span>
              <span>12 Jul</span>
              <span>14 Jul</span>
            </div>
          </div>
        </section>

        <section className="card unit-status-card">
          <div className="card-head">
            <div>
              <span className="card-kicker">STATUS UNIT</span>
              <h2>Hari ini</h2>
            </div>
            <a className="text-button" href="/kalender">
              Lihat kalender
            </a>
          </div>
          <div className="donut-row">
            <div className="donut">
              <span>
                <strong>18</strong>unit
              </span>
            </div>
            <div className="donut-legend">
              <div>
                <i style={{ background: "#0DAE3F" }} />
                <span>Terisi</span>
                <strong>13</strong>
              </div>
              <div>
                <i style={{ background: "#B9D9C4" }} />
                <span>Tersedia</span>
                <strong>4</strong>
              </div>
              <div>
                <i style={{ background: "#B86C4F" }} />
                <span>Maintenance</span>
                <strong>1</strong>
              </div>
            </div>
          </div>
          <div className="occupancy-note">
            <TrendingUp size={17} />
            <div>
              <strong>Okupansi naik 8%</strong>
              <span>dibanding Rabu lalu</span>
            </div>
          </div>
        </section>
      </div>

      <div className="ops-grid">
        <section className="card operation-card">
          <div className="card-head">
            <div className="operation-title">
              <div className="op-icon arrival">
                <LogOut size={18} />
              </div>
              <h2>Check-in hari ini</h2>
              <em>{checkIns.length}</em>
            </div>
            <Link className="text-button" href="/booking">
              Lihat semua
            </Link>
          </div>
          <div className="operation-list">
            {checkIns.map((g) => (
              <button key={g.id} type="button">
                <div className="guest-avatar">
                  {g.guest
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <strong>{g.guest}</strong>
                  <span>
                    {g.unitName} · {g.guests} tamu
                  </span>
                </div>
                <time>14:00</time>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        </section>

        <section className="card operation-card">
          <div className="card-head">
            <div className="operation-title">
              <div className="op-icon departure">
                <LogOut size={18} />
              </div>
              <h2>Check-out hari ini</h2>
              <em>{checkOuts.length}</em>
            </div>
            <Link className="text-button" href="/booking">
              Lihat semua
            </Link>
          </div>
          <div className="operation-list">
            {checkOuts.length === 0 ? (
              <p style={{ color: "#92958f", fontSize: 10, padding: "12px 2px" }}>
                Tidak ada check-out hari ini
              </p>
            ) : (
              checkOuts.map((g) => (
                <button key={g.id} type="button">
                  <div className="guest-avatar">
                    {g.guest
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <strong>{g.guest}</strong>
                    <span>
                      {g.unitName} · {g.guests} tamu
                    </span>
                  </div>
                  <time>11:00</time>
                  <ChevronRight size={17} />
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
