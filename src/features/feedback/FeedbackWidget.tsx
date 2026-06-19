import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { prepareFeedback, type FeedbackContext } from './context';

/**
 * 👍/👎 + bug report widget (O40). Auto-context is PII-scrubbed before send
 * (SEC-003). Sending is injected; a quiet "ありがとう" confirms.
 */
export function FeedbackWidget({
  context,
  onSend,
}: {
  context: FeedbackContext;
  onSend: (payload: ReturnType<typeof prepareFeedback>) => Promise<void>;
}) {
  const [sent, setSent] = useState(false);
  const [text, setText] = useState('');
  const send = async (kind: 'like' | 'dislike' | 'bug') => {
    await onSend(prepareFeedback('ai-mindmap', { kind, text: text || undefined, context }));
    setSent(true);
  };
  if (sent) return <p className="text-xs text-text-muted">ありがとうございます。</p>;
  return (
    <div className="flex items-center gap-2">
      <button aria-label="よい" onClick={() => send('like')} className="text-text-muted hover:text-success">
        👍
      </button>
      <button aria-label="いまいち" onClick={() => send('dislike')} className="text-text-muted hover:text-warning">
        👎
      </button>
      <input
        aria-label="バグ報告"
        className="rounded-sm border border-border px-2 py-0.5 text-xs"
        placeholder="気づいたこと"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant="ghost" onClick={() => send('bug')}>
        送る
      </Button>
    </div>
  );
}
