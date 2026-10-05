"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
  BookOpen,
  X,
  Menu,
  Search,
} from "lucide-react";
import { bookings, units } from "@/lib/data";
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
    items: [
      { href: "/pengaturan", label: "Pengaturan", icon: Settings },
      { href: "/dokumentasi", label: "Dokumentasi", icon: BookOpen },
    ],
  },
];

type AccessRole = "owner" | "front-office" | "finance" | "super-admin" | "housekeeping" | "maintenance";
type AccessModule = "Dashboard" | "Kalender" | "Booking" | "Unit & Properti" | "Rate & Harga" | "Keuangan" | "Laporan" | "Pengaturan" | "Dokumentasi";
type AccessPermission = { module: AccessModule; actions: Record<"lihat" | "buat" | "ubah" | "hapus", boolean> };
const ACCESS_STORAGE_KEY = "glampos-staff-access";
const PREVIEW_ROLES: { id: AccessRole; label: string }[] = [
  { id: "owner", label: "Owner" },
  { id: "front-office", label: "Front Office" },
  { id: "finance", label: "Finance" },
  { id: "super-admin", label: "Super Admin" },
  { id: "housekeeping", label: "Housekeeping" },
  { id: "maintenance", label: "Maintenance" },
];
const MODULE_BY_PATH: Record<string, AccessModule> = {
  "/": "Dashboard",
  "/kalender": "Kalender",
  "/booking": "Booking",
  "/unit-properti": "Unit & Properti",
  "/rate-harga": "Rate & Harga",
  "/keuangan": "Keuangan",
  "/laporan": "Laporan",
  "/pengaturan": "Pengaturan",
  "/dokumentasi": "Dokumentasi",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const [previewRole, setPreviewRole] = useState<AccessRole>("owner");
  const [rolePermissions, setRolePermissions] = useState<Partial<Record<AccessRole, AccessPermission[]>>>({});
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadAccessSettings = () => {
      try {
        const saved = window.localStorage.getItem(ACCESS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as { permissions?: Partial<Record<AccessRole, AccessPermission[]>> };
          setRolePermissions(parsed.permissions ?? {});
        }
      } catch {
        setRolePermissions({});
      }
    };
    loadAccessSettings();
    window.addEventListener("glampos-access-updated", loadAccessSettings);
    window.addEventListener("storage", loadAccessSettings);
    return () => {
      window.removeEventListener("glampos-access-updated", loadAccessSettings);
      window.removeEventListener("storage", loadAccessSettings);
    };
  }, []);

  const hasModuleAccess = (module: AccessModule) => {
    const configuredRole = rolePermissions[previewRole];
    if (!configuredRole) {
      return previewRole === "owner" || previewRole === "super-admin" ||
        (previewRole === "front-office" && ["Dashboard", "Kalender", "Booking", "Laporan"].includes(module)) ||
        (previewRole === "finance" && ["Dashboard", "Keuangan", "Laporan"].includes(module)) ||
        (["housekeeping", "maintenance"].includes(previewRole) && ["Dashboard", "Kalender", "Unit & Properti"].includes(module)) ||
        module === "Dokumentasi";
    }
    return configuredRole.some((permission) => permission.module === module && permission.actions.lihat);
  };
  const accessibleNavigation = NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => hasModuleAccess(MODULE_BY_PATH[item.href] ?? "Dashboard")),
  })).filter((group) => group.items.length > 0);
  const currentModule = Object.entries(MODULE_BY_PATH).find(([path]) =>
    path === "/" ? pathname === path : pathname === path || pathname.startsWith(`${path}/`),
  )?.[1];

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];

    const bookingResults = bookings
      .filter((booking) =>
        [booking.guest, booking.code, booking.email, booking.phone, booking.unitName]
          .some((value) => value.toLowerCase().includes(query)),
      )
      .map((booking) => ({
        id: `booking-${booking.id}`,
        label: booking.guest,
        detail: `${booking.code} · ${booking.unitName}`,
        href: `/booking/${booking.id}`,
        type: "Booking",
      }));

    const unitResults = units
      .filter((unit) =>
        [unit.name, unit.type].some((value) => value.toLowerCase().includes(query)),
      )
      .map((unit) => ({
        id: `unit-${unit.id}`,
        label: unit.name,
        detail: unit.type,
        href: "/unit-properti",
        type: "Unit",
      }));

    return [...bookingResults, ...unitResults].slice(0, 6);
  }, [search]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.current?.focus();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const openSearchResult = (href: string) => {
    setSearchOpen(false);
    setSearch("");
    router.push(href);
  };

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
          {accessibleNavigation.map((group, gi) => (
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
                    {"badge" in item && typeof item.badge === "number" ? <em>{item.badge}</em> : null}
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
            <input
              ref={searchInput}
              value={search}
              placeholder="Cari booking, tamu, atau invoice..."
              role="combobox"
              aria-label="Cari booking, tamu, invoice, atau unit"
              aria-expanded={searchOpen && search.trim().length > 0}
              aria-controls="global-search-results"
              aria-autocomplete="list"
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setSearch(event.target.value);
                setActiveResult(0);
                setSearchOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" && searchResults.length > 0) {
                  event.preventDefault();
                  setActiveResult((current) => (current + 1) % searchResults.length);
                } else if (event.key === "ArrowUp" && searchResults.length > 0) {
                  event.preventDefault();
                  setActiveResult((current) => (current - 1 + searchResults.length) % searchResults.length);
                } else if (event.key === "Enter" && searchResults[activeResult]) {
                  event.preventDefault();
                  openSearchResult(searchResults[activeResult].href);
                } else if (event.key === "Escape") {
                  setSearchOpen(false);
                }
              }}
              onBlur={() => setSearchOpen(false)}
            />
            <kbd>⌘ K</kbd>
            {searchOpen && search.trim() && (
              <div className="global-search-results" id="global-search-results" role="listbox">
                {searchResults.length > 0 ? searchResults.map((result, index) => (
                  <button
                    key={result.id}
                    type="button"
                    role="option"
                    aria-selected={index === activeResult}
                    className={index === activeResult ? "active" : ""}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => openSearchResult(result.href)}
                  >
                    <span>
                      <strong>{result.label}</strong>
                      <small>{result.detail}</small>
                    </span>
                    <em>{result.type}</em>
                  </button>
                )) : (
                  <p className="global-search-empty">Tidak ada hasil untuk “{search.trim()}”.</p>
                )}
              </div>
            )}
          </div>
          <div className="top-actions">
            <div className="demo-role">
              <span>Preview sebagai</span>
              <select value={previewRole} onChange={(event) => setPreviewRole(event.target.value as AccessRole)}>
                {PREVIEW_ROLES.map((role) => (
                  <option key={role.id} value={role.id}>{role.label}</option>
                ))}
              </select>
            </div>
            <NotificationDropdown />
            <div className="today-chip">
              <CalendarDays size={17} />
              <span>15 Jul 2026</span>
            </div>
          </div>
        </header>
        <div className="page-wrap">
          {currentModule && !hasModuleAccess(currentModule) ? (
            <section className="card access-denied">
              <h1>Akses modul tidak tersedia</h1>
              <p>Role {PREVIEW_ROLES.find((role) => role.id === previewRole)?.label} tidak memiliki izin untuk membuka modul ini.</p>
              <Link className="secondary-button" href="/">Kembali ke Dashboard</Link>
            </section>
          ) : children}
        </div>
      </main>
    </div>
  );
}
