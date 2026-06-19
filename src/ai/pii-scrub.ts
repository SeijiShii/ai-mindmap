/**
 * SEC-003: scrub PII from text before it is sent to the LLM. Thinking content
 * is sensitive; emails / phone numbers / long digit runs are masked. This is a
 * best-effort frontline filter (store=false on the API is the second layer).
 */

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
// JP + intl phone-ish runs (with separators)
const PHONE = /(?:\+?\d{1,3}[-\s]?)?(?:\(?\d{2,4}\)?[-\s]?)\d{2,4}[-\s]?\d{3,4}/g;
// long bare digit runs (card-ish / ids) >= 9 digits
const LONG_DIGITS = /\b\d{9,}\b/g;

export function scrubPii(text: string): string {
  return text
    .replace(EMAIL, '[メール]')
    .replace(LONG_DIGITS, '[番号]')
    .replace(PHONE, '[電話番号]');
}
