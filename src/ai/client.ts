import { structureResultSchema, expandResultSchema } from '../types/ai-contract';
import type { StructureResult, ExpandResult } from '../types/ai-contract';
import { buildStructureMessages, buildExpandMessages, type ChatMessage } from './prompts';
import { scrubPii } from './pii-scrub';

export interface ChatUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface ChatResponse {
  content: string;
  usage: ChatUsage;
}

/**
 * Injectable chat function (O35): the real implementation calls OpenAI
 * gpt-4o-mini with store=false and response_format json; tests pass a fake.
 */
export type ChatFn = (messages: ChatMessage[]) => Promise<ChatResponse>;

const MAX_RETRIES = 2;

async function callAndParse<T>(
  chat: ChatFn,
  messages: ChatMessage[],
  schema: { safeParse: (v: unknown) => { success: boolean; data?: T } },
  fallback: T,
): Promise<{ result: T; usage: ChatUsage }> {
  let usage: ChatUsage = { inputTokens: 0, outputTokens: 0 };
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let res: ChatResponse;
    try {
      res = await chat(messages);
    } catch {
      // API down / rate limited → graceful fallback (E3)
      return { result: fallback, usage };
    }
    usage = res.usage;
    let json: unknown;
    try {
      json = JSON.parse(res.content);
    } catch {
      continue; // retry on non-JSON
    }
    const parsed = schema.safeParse(json);
    if (parsed.success) return { result: parsed.data as T, usage };
    // injection-ignored / malformed output → retry then fallback
  }
  return { result: fallback, usage };
}

export async function callStructure(
  chat: ChatFn,
  treeSummary: string,
  transcriptDelta: string,
): Promise<{ result: StructureResult; usage: ChatUsage }> {
  const scrubbed = scrubPii(transcriptDelta);
  if (scrubbed.trim() === '') {
    // empty delta → no API call (cost saving, B1)
    return { result: { suggestions: [] }, usage: { inputTokens: 0, outputTokens: 0 } };
  }
  const messages = buildStructureMessages(scrubPii(treeSummary), scrubbed);
  return callAndParse<StructureResult>(chat, messages, structureResultSchema, { suggestions: [] });
}

export async function callExpand(
  chat: ChatFn,
  nodeContext: string,
  mode: 'branch' | 'gaps',
): Promise<{ result: ExpandResult; usage: ChatUsage }> {
  const messages = buildExpandMessages(scrubPii(nodeContext), mode);
  return callAndParse<ExpandResult>(chat, messages, expandResultSchema, { suggestions: [] });
}
