import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  itemDescription?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  itemDescription,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 animate-admin-modal-backdrop">
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-red-500/30 bg-card p-4 sm:p-6 shadow-2xl shadow-red-500/10 animate-admin-modal-panel">
        {/* Close X */}
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors admin-btn-press"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Warning Crest */}
        <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-3 sm:mb-4 border border-red-500/20 shadow-inner">
          <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-bold text-foreground">{title}</h3>
          <p className="mt-1.5 sm:mt-2 text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to permanently remove this record? This action is <span className="font-semibold text-red-500">irreversible</span> and cannot be undone.
          </p>
          {itemDescription && (
            <div className="mt-3 rounded-xl border border-border/80 bg-muted/40 p-2 sm:p-2.5 text-xs font-mono text-foreground break-all">
              {itemDescription}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 sm:mt-6 flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50 admin-btn-press text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/20 hover:bg-red-500 transition-all disabled:opacity-50 admin-btn-press"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Permanently Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
