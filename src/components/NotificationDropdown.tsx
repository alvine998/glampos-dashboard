"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Clock, BedDouble, CreditCard } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: "n1",
    icon: Clock,
    title: "3 booking menunggu verifikasi DP",
    text: "Periksa sebelum masa tahan 24 jam berakhir.",
    time: "10 menit lalu",
    unread: true,
  },
  {
    id: "n2",
    icon: BedDouble,
    title: "Check-in hari ini: Nadya Putri",
    text: "Merapi 01, 2 tamu, check-in 14:00.",
    time: "1 jam lalu",
    unread: true,
  },
  {
    id: "n3",
    icon: CreditCard,
    title: "Pembayaran diterima: Dimas Prabowo",
    text: "Rp3.100.000 untuk Sumbing 01.",
    time: "3 jam lalu",
    unread: false,
  },
  {
    id: "n4",
    icon: BedDouble,
    title: "Booking baru: Bima & Keluarga",
    text: "Merapi 02, 18—20 Jul 2026.",
    time: "Kemarin",
    unread: false,
  },
];

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="notif-wrapper" ref={ref}>
      <button
        className="icon-button notification"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <Bell size={19} />
        {unreadCount > 0 && <i />}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <strong>Notifikasi</strong>
            {unreadCount > 0 && <span>{unreadCount} baru</span>}
          </div>
          <div className="notif-list">
            {NOTIFICATIONS.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className={`notif-item ${n.unread ? "unread" : ""}`}
                >
                  <div className="notif-icon">
                    <Icon size={15} />
                  </div>
                  <div>
                    <strong>{n.title}</strong>
                    <span>{n.text}</span>
                    <small>{n.time}</small>
                  </div>
                  {n.unread && <div className="notif-dot" />}
                </div>
              );
            })}
          </div>
          <div className="notif-footer">
            <button type="button" onClick={() => setOpen(false)}>
              Tandai semua sudah dibaca
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
