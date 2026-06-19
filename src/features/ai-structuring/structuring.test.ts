import { describe, it, expect } from 'vitest';
import { mergeSuggestions } from './merge';
import { summarizeTree } from './tree-summary';
import type { AiNodeSuggestion } from '../../types/ai-contract';

const sug = (o: Partial<AiNodeSuggestion>): AiNodeSuggestion => ({
  tempId: 't',
  parentRef: null,
  text: 'x',
  kind: 'tree',
  ...o,
});

describe('mergeSuggestions (論点-002 add-only)', () => {
  it('N2: adds new suggestions as new nodes', () => {
    const plan = mergeSuggestions([], [sug({ tempId: 'a', text: '要点1' }), sug({ tempId: 'b', text: '要点2' })]);
    expect(plan.newNodes).toHaveLength(2);
  });

  it('E4: never modifies existing nodes (returns only additions)', () => {
    const existing = [{ id: 'n1', text: '既存' }];
    const plan = mergeSuggestions(existing, [sug({ tempId: 'a', text: '新規' })]);
    expect(plan.newNodes.map((n) => n.text)).toEqual(['新規']);
  });

  it('N3: dedups against existing nodes (normalized)', () => {
    const existing = [{ id: 'n1', text: ' 既存テーマ ' }];
    const plan = mergeSuggestions(existing, [sug({ text: '既存テーマ' }), sug({ tempId: 'b', text: '別物' })]);
    expect(plan.newNodes.map((n) => n.text)).toEqual(['別物']);
  });

  it('dedups within a batch too', () => {
    const plan = mergeSuggestions([], [sug({ tempId: 'a', text: '同じ' }), sug({ tempId: 'b', text: '同じ' })]);
    expect(plan.newNodes).toHaveLength(1);
  });

  it('caps additions per merge', () => {
    const many = Array.from({ length: 10 }, (_, i) => sug({ tempId: `t${i}`, text: `n${i}` }));
    expect(mergeSuggestions([], many, 5).newNodes).toHaveLength(5);
  });

  it('resolves parentRef to existing id or earlier tempId, else root', () => {
    const existing = [{ id: 'n1', text: '親' }];
    const plan = mergeSuggestions(existing, [
      sug({ tempId: 'a', parentRef: 'n1', text: '子' }),
      sug({ tempId: 'b', parentRef: 'a', text: '孫' }),
      sug({ tempId: 'c', parentRef: 'ghost', text: '迷子' }),
    ]);
    expect(plan.newNodes.find((n) => n.tempId === 'a')?.parentId).toBe('n1');
    expect(plan.newNodes.find((n) => n.tempId === 'b')?.parentId).toBe('a');
    expect(plan.newNodes.find((n) => n.tempId === 'c')?.parentId).toBeNull(); // dangling → root
  });

  it('B1: empty text suggestions are skipped', () => {
    expect(mergeSuggestions([], [sug({ text: '   ' })]).newNodes).toHaveLength(0);
  });
});

describe('summarizeTree (token saving)', () => {
  it('produces an indented outline', () => {
    const out = summarizeTree([
      { id: 'n1', parentId: null, text: '幹' },
      { id: 'n2', parentId: 'n1', text: '枝' },
    ]);
    expect(out).toContain('- 幹');
    expect(out).toContain('  - 枝');
  });
  it('bounds large trees', () => {
    const nodes = Array.from({ length: 80 }, (_, i) => ({ id: `n${i}`, parentId: null, text: `t${i}` }));
    const out = summarizeTree(nodes, 60);
    expect(out).toContain('他 20 件');
  });
});
