import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { StageSpinner } from "../../components/ui/StageSpinner";

/**
 * Capture UI (live-capture): manual text input + send. Live Web Speech wiring
 * is attached by the page via onSend; this component owns the input + busy state
 * and shows a stage-labelled progress experience (O45) while the tree grows.
 */
export function CapturePanel({
  onSend,
  busy = false,
}: {
  onSend: (text: string) => void;
  busy?: boolean;
}) {
  const [text, setText] = useState("");
  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };
  return (
    <div className="flex flex-col gap-2 border-t border-border bg-surface p-3">
      {busy && <StageSpinner stageLabel="要点を聞き取っています…" />}
      <textarea
        aria-label="メモ・文字起こし"
        className="min-h-16 w-full rounded-md border border-border p-2 text-sm"
        placeholder="聞いたこと・考えていることを書く / 話す"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <Button onClick={submit} disabled={busy || text.trim() === ""}>
          AIでマップに
        </Button>
      </div>
    </div>
  );
}
