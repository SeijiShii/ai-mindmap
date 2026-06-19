/**
 * Progress experience for inherent latency (O45): a gentle indicator paired
 * with a stage-specific brand phrase instead of a bare spinner. No fake
 * progress / artificial delay.
 */
export function StageSpinner({ stageLabel }: { stageLabel: string }) {
  return (
    <div className="flex items-center gap-2 text-text-muted" role="status" aria-live="polite">
      <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-accent" aria-hidden />
      <span className="text-sm">{stageLabel}</span>
    </div>
  );
}
