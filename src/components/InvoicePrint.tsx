"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";
import toast from "react-hot-toast";
import { formatRp, nightsBetween, type Booking } from "@/lib/data";

const DATE_LONG = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const DATE_TIME_LONG = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
});

function toDate(iso: string) {
  return new Date(iso.length <= 10 ? `${iso}T00:00:00+07:00` : iso);
}

export function invoiceNumber(booking: Booking) {
  return `INV/${booking.code.replace("GLP/", "")}`;
}

function paymentLabel(booking: Booking) {
  if (booking.paid >= booking.total) return "Lunas";
  if (booking.paid > 0) return "DP masuk";
  return "Belum bayar";
}

function InvoiceSheet({ booking, printedAt }: { booking: Booking; printedAt: Date | null }) {
  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const rate = Math.round(booking.total / nights);
  const remaining = Math.max(0, booking.total - booking.paid);
  const status = paymentLabel(booking);

  return (
    <article className="invoice-sheet">
      <header className="invoice-head">
        <div className="invoice-brand">
          <span className="invoice-logo">NR</span>
          <div>
            <h1>Niskala Retreat</h1>
            <p>Jl. Kalasan KM 4,5 — Sleman, Yogyakarta</p>
            <p>hello@niskalaretreat.id · +62 812 3344 7788</p>
          </div>
        </div>
        <div className="invoice-title">
          <span>INVOICE</span>
          <strong>{invoiceNumber(booking)}</strong>
          <em className={`invoice-badge ${status === "Lunas" ? "paid" : status === "DP masuk" ? "partial" : "unpaid"}`}>
            {status}
          </em>
        </div>
      </header>

      <section className="invoice-meta">
        <div>
          <span>Tanggal invoice</span>
          <strong>{DATE_LONG.format(toDate(booking.createdAt))}</strong>
        </div>
        <div>
          <span>Jatuh tempo</span>
          <strong>{DATE_LONG.format(toDate(booking.checkIn))}</strong>
        </div>
        <div>
          <span>Kode booking</span>
          <strong>{booking.code}</strong>
        </div>
        <div>
          <span>Dicetak</span>
          <strong>{printedAt ? DATE_TIME_LONG.format(printedAt) : "-"}</strong>
        </div>
      </section>

      <section className="invoice-parties">
        <div>
          <span className="invoice-label">DITAGIHKAN KEPADA</span>
          <strong>{booking.guest}</strong>
          <p>{booking.email}</p>
          <p>{booking.phone}</p>
        </div>
        <div>
          <span className="invoice-label">RINCIAN PENGINAPAN</span>
          <strong>{booking.unitName}</strong>
          <p>Check-in {DATE_LONG.format(toDate(booking.checkIn))}</p>
          <p>Check-out {DATE_LONG.format(toDate(booking.checkOut))}</p>
          <p>{booking.guests} tamu · {nights} malam</p>
        </div>
      </section>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>DESKRIPSI</th>
            <th className="center">QTY</th>
            <th className="right">HARGA SATUAN</th>
            <th className="right">JUMLAH</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Sewa unit {booking.unitName}</strong>
              <span>
                {DATE_LONG.format(toDate(booking.checkIn))} — {DATE_LONG.format(toDate(booking.checkOut))}
              </span>
            </td>
            <td className="center">{nights} malam</td>
            <td className="right">{formatRp(rate)}</td>
            <td className="right"><strong>{formatRp(rate * nights)}</strong></td>
          </tr>
        </tbody>
      </table>

      <section className="invoice-summary">
        <div className="invoice-summary-rows">
          <div>
            <span>Subtotal</span>
            <strong>{formatRp(booking.total)}</strong>
          </div>
          <div>
            <span>Diskon</span>
            <strong>Rp0</strong>
          </div>
          <div className="invoice-total">
            <span>Total tagihan</span>
            <strong>{formatRp(booking.total)}</strong>
          </div>
          <div>
            <span>Sudah dibayar</span>
            <strong>{formatRp(booking.paid)}</strong>
          </div>
          <div className={remaining > 0 ? "invoice-due" : "invoice-clear"}>
            <span>Sisa pembayaran</span>
            <strong>{remaining > 0 ? formatRp(remaining) : "Lunas"}</strong>
          </div>
        </div>
      </section>

      <section className="invoice-notes">
        <div>
          <span className="invoice-label">CATATAN</span>
          <p>
            Terima kasih atas kunjungan Anda ke Niskala Retreat. Kami harap Anda menikmati
            pengalaman glamping kami. Pembayaran dapat dilakukan melalui transfer bank,
            virtual account, Midtrans, atau tunai di reception.
          </p>
        </div>
        <div>
          <span className="invoice-label">REKENING PEMBAYARAN</span>
          <p>Bank BCA — a.n. Niskala Retreat</p>
          <p>No. 872 0044 119 — BCA Virtual Account</p>
        </div>
      </section>

      <footer className="invoice-foot">
        <p>Invoice ini sah dan diproses komputer, tidak memerlukan tanda tangan basah.</p>
        <div>
          <span>Pemilik Niskala Retreat</span>
          <i />
          <strong>Dimas Argo</strong>
        </div>
      </footer>
    </article>
  );
}

export default function InvoicePrint({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  const [printedAt, setPrintedAt] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPrintedAt(new Date());
    setMounted(true);
  }, [booking]);

  if (!booking || !mounted) return null;

  const handlePrint = () => {
    toast.success("Dialog cetak invoice dibuka.");
    window.print();
  };

  return createPortal(
    <div className="modal-layer invoice-print-area">
      <div className="backdrop" onClick={onClose} />
      <div className="invoice-modal">
        <div className="modal-head invoice-modal-head">
          <div>
            <span className="eyebrow">INVOICE A4</span>
            <h2>{invoiceNumber(booking)}</h2>
            <p>{booking.guest} · {booking.unitName}</p>
          </div>
          <div className="invoice-modal-actions">
            <button className="primary-button" type="button" onClick={handlePrint}>
              <Printer size={15} />
              Cetak / Simpan PDF
            </button>
            <button className="invoice-close" type="button" onClick={onClose} aria-label="Tutup invoice">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="invoice-modal-body">
          <InvoiceSheet booking={booking} printedAt={printedAt} />
        </div>
      </div>
    </div>,
    document.body,
  );
}