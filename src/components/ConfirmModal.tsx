"use client";

import { AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Hapus",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="modal-layer">
      <div className="backdrop" onClick={onCancel} />
      <div className="confirm-modal">
        <div className="confirm-icon">
          <AlertTriangle size={22} />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            Batal
          </button>
          <button className="danger-button" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
