import { Button } from '../../components/ui/Button';
import { TOKENS_PER_PACK } from './webhook';

/**
 * Shown when the free AI allowance runs out. O43 price transparency: the amount
 * and what you get are stated BEFORE the purchase CTA, in the first view (no
 * dark pattern). PWYW one-time 100 yen (charter §1).
 */
export function UpgradePanel({ onCheckout }: { onCheckout: () => void }) {
  const approxOps = Math.round(TOKENS_PER_PACK / 700); // ~tokens per AI op
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-panel">
      <p className="font-medium">今月の AI のお手伝いを使い切りました</p>
      <p className="mt-1 text-sm text-text-muted">
        <strong>100 円</strong>で AI のお手伝いを約 {approxOps} 回ぶん追加できます（買い切り・継続課金なし）。
      </p>
      <div className="mt-3">
        <Button onClick={onCheckout}>100 円で追加する</Button>
      </div>
    </div>
  );
}
