import { scrubPii } from '../../ai/pii-scrub';

/** Auto-context attached to feedback, PII-scrubbed before send (SEC-003 / O40). */
export interface FeedbackContext {
  route: string;
  appVersion: string;
  userAgent: string;
  at: string;
}

export interface RawFeedback {
  kind: 'like' | 'dislike' | 'bug';
  text?: string;
  context: FeedbackContext;
}

export interface ScrubbedFeedback extends RawFeedback {
  service: string;
}

/** Scrub free text (and UA, which can carry identifiers) before sending to hub. */
export function prepareFeedback(service: string, fb: RawFeedback): ScrubbedFeedback {
  return {
    ...fb,
    service,
    text: fb.text ? scrubPii(fb.text) : undefined,
    context: { ...fb.context, userAgent: scrubPii(fb.context.userAgent) },
  };
}
