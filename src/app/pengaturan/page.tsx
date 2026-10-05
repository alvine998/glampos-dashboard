"use client";

import { useState } from "react";
import {
  Building2,
  Percent,
  Users,
  FileText,
  Shield,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import ProfilProperti from "@/components/settings/ProfilProperti";
import PajakBiaya from "@/components/settings/PajakBiaya";
import StafAkses from "@/components/settings/StafAkses";
import InvoiceSettings from "@/components/settings/InvoiceSettings";
import KeamananSettings from "@/components/settings/KeamananSettings";

const TABS = [
  { id: "profil", label: "Profil properti", icon: Building2 },
  { id: "pajak", label: "Pajak & biaya", icon: Percent },
  { id: "staf", label: "Pengguna & akses", icon: Users },
  { id: "invoice", label: "Invoice", icon: FileText },
  { id: "keamanan", label: "Keamanan", icon: Shield },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const TAB_CONTENT: Record<string, React.FC<any>> = {
  profil: ProfilProperti,
  pajak: PajakBiaya,
  staf: StafAkses,
  invoice: InvoiceSettings,
  keamanan: KeamananSettings,
};

export default function PengaturanPage() {
  const [tab, setTab] = useState("profil");
  const Content = TAB_CONTENT[tab];

  return (
    <AppShell>
      <PageHeader
        title="Pengaturan"
        description="Kelola preferensi properti, biaya, staf, dan keamanan."
      />

      <div className="settings-layout">
        <nav className="settings-nav card">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? "active" : ""}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={17} />
              {t.label}
            </button>
          ))}
        </nav>

        <section className="card settings-form">
          <Content />

          <div className="settings-footer">
            <span>
              Anda masuk sebagai <strong>Owner</strong>
            </span>
            <button className="primary-button" type="button">
              Simpan perubahan
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
