import { useState, type ReactNode } from 'react';

/**
 * "これは何？" entry affordance (O41): a circled "?" that opens a lightweight
 * modal explaining the service for cold link visitors.
 */
export function InfoButton({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label="これは何？"
        onClick={() => setOpen(true)}
        className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-text-muted hover:bg-surface-muted"
      >
        ?
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-w-sm rounded-lg bg-surface p-6 shadow-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}
