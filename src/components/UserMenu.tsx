"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronUp, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";

const STORAGE_KEY = "glampos-profile";

type StoredProfile = {
  name: string;
  email: string;
  position: string;
};

const DEFAULT_PROFILE: StoredProfile = {
  name: "Lucy Andriani",
  email: "lucy@niskalaretreat.co.id",
  position: "Owner",
};

function getInitials(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "LA";
}

function readProfile(): StoredProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PROFILE;
    const parsed = JSON.parse(saved) as Partial<StoredProfile>;
    return {
      name: parsed.name?.trim() || DEFAULT_PROFILE.name,
      email: parsed.email?.trim() || DEFAULT_PROFILE.email,
      position: parsed.position?.trim() || DEFAULT_PROFILE.position,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<StoredProfile>(DEFAULT_PROFILE);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setProfile(readProfile());
    const sync = () => setProfile(readProfile());
    window.addEventListener("glampos-profile-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("glampos-profile-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open ]);

  const close = () => setOpen(false);

  const handleLogout = () => {
    close();
    toast.success("Anda berhasil keluar. Sampai jumpa kembali!");
    router.push("/login");
  };

  const initials = getInitials(profile.name);

  return (
    <div className="user-menu-wrap" ref={wrapRef}>
      <button
        ref={triggerRef}
        className="user-mini"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Menu akun ${profile.name}, ${profile.position}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="user-avatar-wrap" aria-hidden="true">
          <span className="user-avatar">{initials}</span>
          <span className="user-status-dot" title="Online" />
        </span>
        <span className="user-identity">
          <strong title={profile.name}>{profile.name}</strong>
          <span className="user-role" title={profile.position}>
            {profile.position}
          </span>
        </span>
        <ChevronUp
          size={16}
          aria-hidden="true"
          className={`user-chevron ${open ? "open" : ""}`}
        />
      </button>

      {open && (
        <div className="user-dropdown" role="menu" aria-label="Menu akun">
          <div className="user-dropdown-header">
            <span className="user-avatar user-avatar-lg" aria-hidden="true">
              {initials}
            </span>
            <div className="user-dropdown-identity">
              <strong title={profile.name}>{profile.name}</strong>
              <span title={profile.email}>{profile.email}</span>
              <span className="user-role-chip">{profile.position}</span>
            </div>
          </div>
          <div className="user-dropdown-divider" />
          <Link href="/profil-saya" role="menuitem" onClick={close}>
            <User size={15} aria-hidden="true" />
            Profil saya
          </Link>
          <div className="user-dropdown-divider" />
          <button
            type="button"
            role="menuitem"
            className="logout"
            onClick={handleLogout}
          >
            <LogOut size={15} aria-hidden="true" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
