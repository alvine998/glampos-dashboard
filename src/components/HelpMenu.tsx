"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CircleHelp, MessageCircle, TicketCheck } from "lucide-react";

export const SUPPORT_WHATSAPP = "6281234567890";
export const SUPPORT_WHATSAPP_TEXT = "Halo tim GlampOS, saya butuh bantuan.";

export function supportWhatsAppLink(message: string = SUPPORT_WHATSAPP_TEXT) {
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function formatSupportWhatsApp(number: string = SUPPORT_WHATSAPP) {
  const local = number.startsWith("62") ? number.slice(2) : number;
  return `+62 ${local.replace(/(\d{3,4})(\d{3,4})(\d+)/, "$1-$2-$3")}`;
}

export default function HelpMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="help-menu" ref={ref}>
      {open && (
        <div className="help-menu-popover" role="menu">
          <strong>Pilih cara menghubungi tim GlampOS</strong>
          <Link className="help-menu-item" href="/bantuan" role="menuitem" onClick={() => setOpen(false)}>
            <span className="help-menu-icon">
              <TicketCheck size={16} />
            </span>
            <span>
              <strong>Buat tiket</strong>
              <small>Catat kendala lengkap dan pantau riwayat tiket Anda.</small>
            </span>
          </Link>
          <a
            className="help-menu-item"
            href={supportWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <span className="help-menu-icon whatsapp">
              <MessageCircle size={16} />
            </span>
            <span>
              <strong>Hubungi WhatsApp</strong>
              <small>Chat langsung dengan tim dukungan GlampOS.</small>
            </span>
          </a>
        </div>
      )}

      <button
        className="floating-help"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Buka pilihan bantuan"
        onClick={() => setOpen((current) => !current)}
      >
        <CircleHelp size={18} aria-hidden="true" />
        <span>Bantuan</span>
      </button>
    </div>
  );
}
