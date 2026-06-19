/**
 * Buffers finalized transcript text and flushes a delta when a sentence
 * boundary or a character threshold is reached (debounce → cost control,
 * live-capture 論点-001). When offline, deltas queue and flush on resume.
 */
export class DeltaBuffer {
  private buf = '';
  private queue: string[] = [];

  constructor(
    private readonly minChars = 20,
    private readonly online: () => boolean = () => true,
  ) {}

  /** Append finalized text; returns a delta to send now, or null. */
  push(text: string): string | null {
    this.buf += text;
    const endsSentence = /[。．.!?！？\n]\s*$/.test(this.buf);
    if (this.buf.trim().length >= this.minChars || endsSentence) {
      return this.flush();
    }
    return null;
  }

  /** Force-flush whatever is buffered (e.g. on stop). */
  flush(): string | null {
    const delta = this.buf.trim();
    this.buf = '';
    if (delta === '') return null;
    if (!this.online()) {
      this.queue.push(delta);
      return null;
    }
    return delta;
  }

  /** Drain queued deltas after coming back online. */
  drain(): string[] {
    if (!this.online()) return [];
    const out = this.queue;
    this.queue = [];
    return out;
  }

  get queued(): number {
    return this.queue.length;
  }
}
