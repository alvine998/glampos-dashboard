"use client";

import { useRef, useState, useEffect } from "react";
import { LogOut, Settings, User } from "lucide-react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="user-menu-wrap" ref={ref}>
      <button
        className="user-mini"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <div className="user-avatar">LA</div>
        <div>
          <strong>Lucy Andriani</strong>
          <span>Owner</span>
        </div>
      </button>

      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            <div className="user-avatar">LA</div>
            <div>
              <strong>Lucy Andriani</strong>
              <span>lucy@niskalaretreat.co.id</span>
            </div>
          </div>
          <div className="user-dropdown-divider" />
          <button type="button">
            <User size={15} />
            Profil saya
          </button>
          <button type="button">
            <Settings size={15} />
            Pengaturan akun
          </button>
          <div className="user-dropdown-divider" />
          <button type="button" className="logout">
            <LogOut size={15} />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
