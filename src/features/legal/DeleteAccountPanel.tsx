import { useState } from 'react';
import { Button } from '../../components/ui/Button';

/**
 * O54 self-service deletion (non-negotiable): the user deletes all their data
 * themselves (the operator cannot identify a guest). Two-step confirm with an
 * explicit "cannot be undone" notice.
 */
export function DeleteAccountPanel({ onDelete }: { onDelete: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  if (done) return <p className="text-sm text-text-muted">すべてのデータを削除しました。</p>;
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm">
        あなたのマップ・ノードなどすべてのデータを削除します。運営側ではご本人を特定できないため、削除はこの画面からご自身で行えます。
      </p>
      {!confirming ? (
        <div className="mt-3">
          <Button variant="danger" onClick={() => setConfirming(true)}>
            全データを削除
          </Button>
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-sm text-danger">この操作は取り消せません。本当に削除しますか?</p>
          <div className="mt-2 flex gap-2">
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              やめる
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await onDelete();
                setDone(true);
              }}
            >
              削除する（取り消せません）
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
