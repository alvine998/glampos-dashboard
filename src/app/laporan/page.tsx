"use client";

import { useState } from "react";
import { Download, TrendingUp, BarChart3, Zap, FileText, Table } from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";

const BARS: [string, number, string][] = [
  ["Safari Tent", 78, "#637158"],
  ["Dome Suite", 72, "#b96f52"],
  ["Family Lodge", 61, "#c59d5f"],
  ["Cabin", 55, "#77898b"],
];

const INSIGHTS = [
  { icon: TrendingUp, title: "Dome Suite tumbuh paling cepat", text: "Revenue naik 22% dibanding bulan lalu." },
  { icon: BarChart3, title: "Weekend hampir penuh", text: "Okupansi Jumat–Sabtu mencapai 88%." },
  { icon: Zap, title: "Peluang optimasi rate", text: "Naikkan rate Safari Tent 8–12% pada 2 weekend berikutnya." },
];

export default function LaporanPage() {
  const [exportOpen, setExportOpen] = useState(false);

  const handleExport = (format: "pdf" | "excel") => {
    if (format === "excel") {
      const header = "Tipe Unit,Okupansi (%)\n";
      const csv = BARS.map(([label, pct]) => `${label},${pct}`).join("\n");
      const blob = new Blob([header + csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "laporan-okupansi.csv";
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
        title="Laporan"
        description="Pantau tren okupansi dan performa pendapatan properti."
        action={
          <div style={{ position: "relative" }}>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
            >
              <Download size={16} />
              Unduh laporan
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

      <div className="report-period card">
        <div>
          <span>Periode laporan</span>
          <strong>1 — 31 Juli 2026</strong>
        </div>
        <button className="secondary-button" type="button">Bulanan</button>
      </div>

      <div className="report-grid">
        <section className="card report-chart">
          <div className="card-head">
            <div>
              <span className="card-kicker">OKUPANSI</span>
              <h2>Performa per tipe unit</h2>
            </div>
            <strong>68,5%</strong>
          </div>
          {BARS.map(([label, pct, color]) => (
            <div className="bar-row" key={label}>
              <span>{label}</span>
              <div><i style={{ width: `${pct}%`, background: color }} /></div>
              <strong>{pct}%</strong>
            </div>
          ))}
        </section>

        <section className="card insights">
          <h2>INSIGHT OTOMATIS</h2>
          <span>Yang perlu Anda tahu</span>
          {INSIGHTS.map((ins) => (
            <div key={ins.title}>
              <ins.icon size={19} />
              <div>
                <strong>{ins.title}</strong>
                <span>{ins.text}</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
