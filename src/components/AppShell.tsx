"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Building2,
  SlidersHorizontal,
  WalletCards,
  FileText,
  Settings,
  Sparkles,
  X,
  Menu,
  Search,
} from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import PropertySwitcher from "./PropertySwitcher";
import UserMenu from "./UserMenu";

const NAV = [
  {
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/kalender", label: "Kalender", icon: CalendarDays },
      { href: "/booking", label: "Booking", icon: BedDouble, badge: 8 },
    ],
  },
  {
    label: "MANAJEMEN",
    items: [
      { href: "/unit-properti", label: "Unit & Properti", icon: Building2 },
      { href: "/rate-harga", label: "Rate & Harga", icon: SlidersHorizontal },
      { href: "/keuangan", label: "Keuangan", icon: WalletCards },
      { href: "/laporan", label: "Laporan", icon: FileText },
    ],
  },
  {
    label: "SISTEM",
    items: [{ href: "/pengaturan", label: "Pengaturan", icon: Settings }],
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      {open && (
        <div
          className="mobile-backdrop"
          style={{ inset: 0, background: "#21282275" }}
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo" src="/logo-glampos.png" alt="GlampOS" />
            <small>Property Management System</small>
          </div>
          <button className="mobile-close" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <PropertySwitcher />

        <nav>
          {NAV.map((group, gi) => (
            <div className="nav-group" key={gi}>
              {group.label && <div className="nav-label">{group.label}</div>}
              {group.items.map((item) => {
                const active = item.href !== "#" && pathname === item.href;
                const Icon = item.icon;
                const className = `nav-item ${active ? "active" : ""}`;
                const body = (
                  <>
                    <Icon size={19} />
                    <span>{item.label}</span>
                    {"badge" in item && item.badge != null && <em>{item.badge}</em>}
                  </>
                );
                return item.href === "#" ? (
                  <button key={item.label} className={className} type="button">
                    {body}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={className}
                    onClick={() => setOpen(false)}
                  >
                    {body}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <Sparkles size={17} />
            </div>
            <strong>Butuh bantuan?</strong>
            <p>Pusat panduan GlampOS tersedia untuk tim Anda.</p>
            <button type="button">Buka pusat bantuan</button>
          </div>
          <UserMenu />
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="global-search">
            <Search size={18} />
            <input placeholder="Cari booking, tamu, atau invoice..." />
            <kbd>⌘ K</kbd>
          </div>
          <div className="top-actions">
            <div className="demo-role">
              <span>Preview sebagai</span>
              <select defaultValue="OWNER">
                <option value="OWNER">Owner</option>
                <option value="FRONT_OFFICE">Front Office</option>
                <option value="FINANCE">Finance</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            <NotificationDropdown />
            <div className="today-chip">
              <CalendarDays size={17} />
              <span>15 Jul 2026</span>
            </div>
          </div>
        </header>
        <div className="page-wrap">{children}</div>
      </main>
    </div>
  );
}
