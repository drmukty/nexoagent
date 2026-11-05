'use client';
import { Modal } from './Modal';

export function ConfirmModal({ title, body, confirmLabel, danger, busy, onConfirm, onCancel }: { title: string; body: string; confirmLabel: string; danger?: boolean; busy?: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-gray-400">{body}</p>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button className="btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button className={danger ? 'btn bg-nexo-red text-white hover:bg-red-500' : 'btn-primary'} onClick={onConfirm} disabled={busy}>{busy ? 'Working' : confirmLabel}</button>
      </div>
    </Modal>
  );
}
