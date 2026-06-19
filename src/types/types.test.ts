import { describe, it, expect } from 'vitest';
import {
  structureResultSchema,
  expandResultSchema,
} from './ai-contract';
import {
  createMapInputSchema,
  updateNodeInputSchema,
  structureInputSchema,
  expandInputSchema,
} from './api';

const UUID = '00000000-0000-4000-8000-000000000000';

describe('ai-contract schemas (SEC-002 output validation)', () => {
  it('N1: parses a valid StructureResult', () => {
    const r = structureResultSchema.parse({
      suggestions: [{ tempId: 't1', parentRef: null, text: '要点', kind: 'tree' }],
    });
    expect(r.suggestions).toHaveLength(1);
  });
  it('N4: accepts all branch kinds in ExpandResult', () => {
    const kinds = ['relation', 'opposition', 'question', 'example'] as const;
    const r = expandResultSchema.parse({
      suggestions: kinds.map((k, i) => ({ tempId: `t${i}`, parentRef: 'n1', text: 'x', kind: k })),
    });
    expect(r.suggestions).toHaveLength(4);
  });
  it('E1: rejects missing suggestions / wrong shape (injection-ignored output)', () => {
    expect(structureResultSchema.safeParse({}).success).toBe(false);
    expect(
      structureResultSchema.safeParse({ suggestions: [{ tempId: '', parentRef: null, text: '', kind: 'tree' }] })
        .success,
    ).toBe(false);
    expect(
      structureResultSchema.safeParse({ suggestions: [{ tempId: 't', parentRef: null, text: 'x', kind: 'bogus' }] })
        .success,
    ).toBe(false);
  });
  it('B2: accepts an empty suggestions array (no additions)', () => {
    expect(structureResultSchema.parse({ suggestions: [] }).suggestions).toEqual([]);
  });
});

describe('api input schemas (SEC-002 input validation)', () => {
  it('N2: CreateMapInput allows title or empty', () => {
    expect(createMapInputSchema.parse({ title: 'x' }).title).toBe('x');
    expect(createMapInputSchema.parse({}).title).toBeUndefined();
  });
  it('N3: UpdateNodeInput accepts partial position update', () => {
    const r = updateNodeInputSchema.parse({ id: UUID, posX: 10, posY: 20 });
    expect(r.posX).toBe(10);
  });
  it('E2: UpdateNodeInput rejects invalid status', () => {
    expect(updateNodeInputSchema.safeParse({ id: UUID, status: 'invalid' }).success).toBe(false);
  });
  it('E3/B1: StructureInput requires string delta, empty allowed', () => {
    expect(structureInputSchema.parse({ mapId: UUID, transcriptDelta: '' }).transcriptDelta).toBe('');
    expect(structureInputSchema.safeParse({ mapId: UUID, transcriptDelta: 123 }).success).toBe(false);
  });
  it('ExpandInput defaults mode to branch', () => {
    expect(expandInputSchema.parse({ mapId: UUID, nodeId: UUID }).mode).toBe('branch');
  });
});
