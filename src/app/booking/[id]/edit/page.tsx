"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import BookingForm from "@/components/BookingForm";
import { bookings } from "@/lib/data";

export default function BookingEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <AppShell>
        <div style={{ padding: 40, textAlign: "center", color: "#92958f" }}>
          Booking tidak ditemukan.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <BookingForm
        initial={booking}
        onClose={() => router.push(`/booking/${id}`)}
      />
    </AppShell>
  );
}
