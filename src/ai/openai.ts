import OpenAI from 'openai';
import type { ChatFn } from './client';

/**
 * Real OpenAI-backed ChatFn for gpt-4o-mini. store=false (no training on user
 * data, SEC-003), JSON response format (SEC-002). API key is server-side only.
 */
export function createOpenAiChat(apiKey: string): ChatFn {
  const client = new OpenAI({ apiKey });
  return async (messages) => {
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      store: false,
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });
    return {
      content: res.choices[0]?.message?.content ?? '{}',
      usage: {
        inputTokens: res.usage?.prompt_tokens ?? 0,
        outputTokens: res.usage?.completion_tokens ?? 0,
      },
    };
  };
}
