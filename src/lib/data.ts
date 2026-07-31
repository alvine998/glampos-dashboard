export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked-in"
  | "checked-out"
  | "cancelled"
  | "no-show";

export type Unit = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  baseRate: number;
  status: string;
  accent: string;
};

export type Booking = {
  id: string;
  code: string;
  guest: string;
  email: string;
  phone: string;
  unitId: string;
  unitName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: BookingStatus;
  total: number;
  paid: number;
  createdAt: string;
};

export type MaintenanceBlock = {
  unitId: string;
  start: string;
  end: string;
  reason: string;
};

export const TODAY = "2026-07-15";

export const units: Unit[] = [
  { id: "u1", name: "Merapi 01", type: "Safari Tent", capacity: 2, baseRate: 1_250_000, status: "active", accent: "#0DAE3F" },
  { id: "u2", name: "Merapi 02", type: "Safari Tent", capacity: 2, baseRate: 1_250_000, status: "active", accent: "#0DAE3F" },
  { id: "u3", name: "Rinjani 01", type: "Dome Suite", capacity: 4, baseRate: 1_850_000, status: "active", accent: "#087565" },
  { id: "u4", name: "Rinjani 02", type: "Dome Suite", capacity: 4, baseRate: 1_850_000, status: "active", accent: "#087565" },
  { id: "u5", name: "Bromo Family", type: "Family Lodge", capacity: 6, baseRate: 2_450_000, status: "active", accent: "#68B980" },
  { id: "u6", name: "Sumbing 01", type: "Cabin", capacity: 3, baseRate: 1_550_000, status: "active", accent: "#9BCFAA" },
];

export const bookings: Booking[] = [
  {
    id: "b1",
    code: "GLP/NR/2607/0042",
    guest: "Nadya Putri",
    email: "nadya@example.com",
    phone: "0812 4412 8821",
    unitId: "u1",
    unitName: "Merapi 01",
    checkIn: "2026-07-15",
    checkOut: "2026-07-17",
    guests: 2,
    status: "checked-in",
    total: 2_500_000,
    paid: 2_500_000,
    createdAt: "2026-07-10T08:15:00Z",
  },
  {
    id: "b2",
    code: "GLP/NR/2607/0043",
    guest: "Rizky Hadi",
    email: "rizky@example.com",
    phone: "0813 9931 4410",
    unitId: "u3",
    unitName: "Rinjani 01",
    checkIn: "2026-07-15",
    checkOut: "2026-07-16",
    guests: 3,
    status: "confirmed",
    total: 1_850_000,
    paid: 925_000,
    createdAt: "2026-07-11T09:30:00Z",
  },
  {
    id: "b3",
    code: "GLP/NR/2607/0044",
    guest: "Alya Maheswari",
    email: "alya@example.com",
    phone: "0857 2234 1190",
    unitId: "u5",
    unitName: "Bromo Family",
    checkIn: "2026-07-16",
    checkOut: "2026-07-19",
    guests: 5,
    status: "confirmed",
    total: 7_350_000,
    paid: 3_675_000,
    createdAt: "2026-07-12T03:10:00Z",
  },
  {
    id: "b4",
    code: "GLP/NR/2607/0045",
    guest: "Bima & Keluarga",
    email: "bima@example.com",
    phone: "0819 3341 8872",
    unitId: "u2",
    unitName: "Merapi 02",
    checkIn: "2026-07-18",
    checkOut: "2026-07-20",
    guests: 2,
    status: "pending",
    total: 2_500_000,
    paid: 0,
    createdAt: "2026-07-14T11:00:00Z",
  },
  {
    id: "b5",
    code: "GLP/NR/2607/0046",
    guest: "Dimas Prabowo",
    email: "dimas@example.com",
    phone: "0812 7721 6612",
    unitId: "u6",
    unitName: "Sumbing 01",
    checkIn: "2026-07-17",
    checkOut: "2026-07-19",
    guests: 2,
    status: "confirmed",
    total: 3_100_000,
    paid: 3_100_000,
    createdAt: "2026-07-13T06:22:00Z",
  },
];

export const maintenance: MaintenanceBlock[] = [
  { unitId: "u4", start: "2026-07-17", end: "2026-07-19", reason: "Perawatan deck" },
];

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Menunggu DP",
  confirmed: "Terkonfirmasi",
  "checked-in": "Check-in",
  "checked-out": "Check-out",
  cancelled: "Dibatalkan",
  "no-show": "No-show",
};

export function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${iso.slice(0, 10)}T00:00:00`));
}

export function nightsBetween(checkIn: string, checkOut: string) {
  return Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000,
    ),
  );
}

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
