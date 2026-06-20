import * as Sentry from "@sentry/react";
import { scrubPii } from "../ai/pii-scrub";

/**
 * SEC-003 / O26 (legal_required): wire error monitoring (O01) WITH PII masking.
 * Thinking content is sensitive — anything Sentry would transmit (messages,
 * exception values, breadcrumbs, request data, extras) is scrubbed in
 * `beforeSend` so node/transcript text never leaves the device in error logs.
 * Dormant when no DSN is configured (dev / pre-release), so it is no-key safe.
 */

export function scrubEvent(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
  if (event.message) event.message = scrubPii(event.message);
  for (const ex of event.exception?.values ?? []) {
    if (ex.value) ex.value = scrubPii(ex.value);
  }
  for (const bc of event.breadcrumbs ?? []) {
    if (bc.message) bc.message = scrubPii(bc.message);
  }
  // Request bodies / cookies / query may carry node text — never transmit them.
  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.query_string;
  }
  // Free-form extras may hold transcript/thought content — drop entirely.
  if (event.extra) event.extra = {};
  return event;
}

/** Initializes Sentry only when a DSN is present; returns whether it was enabled. */
export function initSentry(
  dsn: string | undefined,
  environment = "production",
): boolean {
  if (!dsn) return false;
  Sentry.init({
    dsn,
    environment,
    sendDefaultPii: false,
    beforeSend: (event) => scrubEvent(event),
    beforeBreadcrumb: (bc) => {
      if (bc.message) bc.message = scrubPii(bc.message);
      return bc;
    },
  });
  return true;
}
