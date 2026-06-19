import type { ReactNode } from 'react';

/**
 * Mobile single-row header (CF-20260609-007): brand (left) + compact actions
 * (right) stay on one line. Brand truncates with ellipsis; actions never wrap.
 */
export function AppHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-3">
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium">
        {title}
      </span>
      <nav className="flex flex-shrink-0 items-center gap-2 whitespace-nowrap">{actions}</nav>
    </header>
  );
}
