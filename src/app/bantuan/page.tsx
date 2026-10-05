"use client";

import { useEffect, useState } from "react";
import { LifeBuoy, Send, TicketCheck } from "lucide-react";
import toast from "react-hot-toast";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";

type TicketStatus = "Siap dikirim";

type SupportTicket = {
  id: string;
  subject: string;
  category: string;
  message: string;
  createdAt: string;
  status: TicketStatus;
};

const TICKET_HISTORY_KEY = "glampos-support-tickets";

function readTicketHistory(): SupportTicket[] {
  try {
    const saved = window.localStorage.getItem(TICKET_HISTORY_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as SupportTicket[]) : [];
  } catch {
    return [];
  }
}

export default function BantuanPage() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Pertanyaan umum");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setTickets(readTicketHistory()), []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const ticket: SupportTicket = {
      id: `GLP-${Date.now().toString(36).toUpperCase()}`,
      subject: subject.trim(),
      category,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: "Siap dikirim",
    };

    try {
      const history = [...readTicketHistory(), ticket];
      window.localStorage.setItem(TICKET_HISTORY_KEY, JSON.stringify(history));

      const mailBody = [
        `ID tiket: ${ticket.id}`,
        `Kategori: ${ticket.category}`,
        `Subjek: ${ticket.subject}`,
        "",
        ticket.message,
      ].join("\n");
      const mailto = `mailto:ticket@glampos.com?subject=${encodeURIComponent(`[${ticket.id}] ${ticket.subject}`)}&body=${encodeURIComponent(mailBody)}`;
      window.location.href = mailto;

      setTickets(history);
      setSubject("");
      setMessage("");
      toast.success("Tiket disiapkan. Kirim email yang terbuka untuk menyelesaikan pengiriman.");
    } catch {
      toast.error("Tiket gagal disimpan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="DUKUNGAN GLAMPOS"
        title="Pusat Bantuan"
        description="Kirim tiket ke tim admin GlampOS dan pantau riwayat permintaan bantuan Anda."
      />

      <div className="support-layout">
        <section className="card support-form-card">
          <div className="support-heading">
            <div className="support-icon"><LifeBuoy size={20} /></div>
            <div>
              <h2>Kirim tiket bantuan</h2>
              <p>Tim admin GlampOS akan menerima detail kendala atau pertanyaan Anda.</p>
            </div>
          </div>

          <form className="support-form" onSubmit={handleSubmit}>
            <label>
              Kategori
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>Pertanyaan umum</option>
                <option>Kendala teknis</option>
                <option>Akun & akses</option>
                <option>Booking & properti</option>
                <option>Lainnya</option>
              </select>
            </label>
            <label>
              Subjek
              <input
                required
                maxLength={120}
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Contoh: Tidak bisa mengubah data unit"
              />
            </label>
            <label>
              Detail
              <textarea
                required
                minLength={10}
                maxLength={4000}
                rows={7}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Jelaskan kendala atau pertanyaan Anda sedetail mungkin..."
              />
            </label>
            <div className="support-form-footer">
              <span>Email tujuan: ticket@glampos.com</span>
              <button className="primary-button" type="submit" disabled={submitting}>
                <Send size={15} />
                {submitting ? "Menyiapkan tiket..." : "Kirim tiket"}
              </button>
            </div>
          </form>
        </section>

        <section className="card support-history-card">
          <div className="support-history-heading">
            <div>
              <span className="card-kicker">DUKUNGAN</span>
              <h2>Riwayat tiket</h2>
            </div>
            <TicketCheck size={19} />
          </div>
          {tickets.length > 0 ? (
            <div className="support-ticket-list">
              {[...tickets].reverse().map((ticket) => (
                <article className="support-ticket" key={ticket.id}>
                  <div>
                    <strong>{ticket.subject}</strong>
                    <span>{ticket.id} · {ticket.category}</span>
                    <small>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ticket.createdAt))}</small>
                  </div>
                  <em>{ticket.status}</em>
                </article>
              ))}
            </div>
          ) : (
            <div className="support-empty">
              <TicketCheck size={23} />
              <p>Belum ada tiket bantuan.</p>
              <span>Tiket yang Anda buat akan muncul di sini.</span>
            </div>
          )}
          <p className="support-history-note">Riwayat tiket ini tersimpan di browser yang sedang digunakan.</p>
        </section>
      </div>
    </AppShell>
  );
}
