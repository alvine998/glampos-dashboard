"use client";

import { useState } from "react";
import { Download, Search, FileText, Table } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import { bookings, formatRp, formatShortDate } from "@/lib/data";

function FinanceKpi({
  label, value, detail, trend, tone,
}: {
  label: string; value: string; detail: string; trend?: string; tone?: "positive" | "warning";
}) {
  return (
    <section className="card kpi-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <div className="kpi-bottom">
        <small>{detail}</small>
        {trend && <em className={tone ?? "positive"}>{trend}</em>}
      </div>
    </section>
  );
}

export default function KeuanganPage() {
  const [q, setQ] = useState("");
  const [exportOpen, setExportOpen] = useState(false);

  const unpaidTotal = bookings.reduce((s, b) => s + Math.max(0, b.total - b.paid), 0);

  const filtered = bookings.filter(
    (b) =>
      b.guest.toLowerCase().includes(q.toLowerCase()) ||
      b.code.toLowerCase().includes(q.toLowerCase()),
  );

  const handleExport = (format: "pdf" | "excel") => {
    const rows = filtered.map((b) => ({
      invoice: `INV/${b.code.replace("GLP/", "")}`,
      tamu: b.guest,
      unit: b.unitName,
      tanggal: b.createdAt.slice(0, 10),
      total: b.total,
      terbayar: b.paid,
      status: b.paid >= b.total ? "Lunas" : b.paid > 0 ? "DP masuk" : "Belum bayar",
    }));

    if (format === "excel") {
      const header = "Invoice,Tamu,Unit,Tanggal,Total,Terbayar,Status\n";
      const csv = rows.map((r) => `${r.invoice},${r.tamu},${r.unit},${r.tanggal},${r.total},${r.terbayar},${r.status}`).join("\n");
      const blob = new Blob([header + csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rekonsiliasi-keuangan.csv";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert("Export PDF akan tersedia setelah integrasi library PDF.");
    }
    setExportOpen(false);
  };

  return (
    <AppShell>
      <PageHeader
        title="Keuangan"
        description="Verifikasi pembayaran, invoice, dan rekonsiliasi transaksi."
        action={
          <div style={{ position: "relative" }}>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
            >
              <Download size={16} />
              Ekspor rekonsiliasi
            </button>
            {exportOpen && (
              <div className="export-dropdown">
                <button type="button" onClick={() => handleExport("pdf")}>
                  <FileText size={15} />
                  Export PDF
                </button>
                <button type="button" onClick={() => handleExport("excel")}>
                  <Table size={15} />
                  Export Excel (CSV)
                </button>
              </div>
            )}
          </div>
        }
      />

      <div className="finance-kpis">
        <FinanceKpi label="Dana masuk bulan ini" value="Rp128,4 jt" detail="37 transaksi" trend="+14,2%" />
        <FinanceKpi label="Menunggu verifikasi" value="Rp6,4 jt" detail="3 transaksi" trend="Perlu aksi" tone="warning" />
        <FinanceKpi label="Piutang booking" value={formatRp(unpaidTotal)} detail="Belum dilunasi" trend="Aktif" />
        <FinanceKpi label="Refund bulan ini" value="Rp1,2 jt" detail="2 transaksi" trend="0,9%" />
      </div>

      <section className="card table-card">
        <div className="finance-table-head">
          <div>
            <span className="card-kicker">REKONSILIASI</span>
            <h2>Transaksi terbaru</h2>
          </div>
          <div className="table-search compact">
            <Search size={17} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari transaksi" />
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>INVOICE</th>
                <th>TAMU</th>
                <th>TANGGAL</th>
                <th>TOTAL</th>
                <th>TERBAYAR</th>
                <th>STATUS</th>
                <th className="col-actions">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const paid = b.paid >= b.total;
                const partial = b.paid > 0 && !paid;
                const payLabel = paid ? "Lunas" : partial ? "DP masuk" : "Belum bayar";
                const payClass = paid ? "paid" : partial ? "partial" : "unpaid";

                return (
                  <tr key={b.id}>
                    <td>
                      <strong className="booking-code">INV/{b.code.replace("GLP/", "")}</strong>
                      <span>{formatShortDate(b.createdAt)}</span>
                    </td>
                    <td>
                      <strong>{b.guest}</strong>
                      <span>{b.unitName}</span>
                    </td>
                    <td>
                      <strong>{formatShortDate(b.createdAt)}</strong>
                      <span>09:42 WIB</span>
                    </td>
                    <td><strong>{formatRp(b.total)}</strong></td>
                    <td><strong>{formatRp(b.paid)}</strong></td>
                    <td><span className={`payment-status ${payClass}`}>{payLabel}</span></td>
                    <td className="col-actions">
                      <button className="table-action" type="button">Invoice</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
