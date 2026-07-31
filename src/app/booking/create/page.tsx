"use client";

import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import BookingForm from "@/components/BookingForm";

export default function BookingCreatePage() {
  const router = useRouter();

  return (
    <AppShell>
      <BookingForm onClose={() => router.push("/booking")} />
    </AppShell>
  );
}
