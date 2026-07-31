import { STATUS_LABEL, type BookingStatus } from "@/lib/data";

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`status status-${status}`}>
      <i />
      {STATUS_LABEL[status]}
    </span>
  );
}
