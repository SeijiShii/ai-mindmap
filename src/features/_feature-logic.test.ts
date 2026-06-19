import { describe, it, expect } from 'vitest';
import { wouldCreateCycle } from './mindmap-canvas/tree-guard';
import { escapeFormula, toMarkdown, toOutline } from './export/exporters';
import { DeltaBuffer } from './live-capture/delta-buffer';

describe('mindmap-canvas tree-guard (E1 cycle)', () => {
  const parentOf = new Map<string, string | null>([
    ['root', null],
    ['a', 'root'],
    ['b', 'a'],
  ]);
  it('detects a cycle when reparenting an ancestor under its descendant', () => {
    expect(wouldCreateCycle(parentOf, 'a', 'b')).toBe(true); // a under b (b is child of a)
  });
  it('self-parent is a cycle', () => {
    expect(wouldCreateCycle(parentOf, 'a', 'a')).toBe(true);
  });
  it('allows a valid reparent / root', () => {
    expect(wouldCreateCycle(parentOf, 'b', 'root')).toBe(false);
    expect(wouldCreateCycle(parentOf, 'b', null)).toBe(false);
  });
});

describe('export exporters (SEC-002 + structure)', () => {
  const nodes = [
    { id: 'n1', parentId: null, text: '幹' },
    { id: 'n2', parentId: 'n1', text: '枝' },
  ];
  it('N1: toMarkdown nests by depth', () => {
    expect(toMarkdown(nodes)).toBe('- 幹\n  - 枝');
  });
  it('N2: toOutline indents with tabs', () => {
    expect(toOutline(nodes)).toBe('幹\n\t枝');
  });
  it('E1: escapeFormula guards =+-@ (CSV/formula injection)', () => {
    expect(escapeFormula('=SUM(A1)')).toBe("'=SUM(A1)");
    expect(escapeFormula('+1')).toBe("'+1");
    expect(escapeFormula('普通のテキスト')).toBe('普通のテキスト');
  });
});

describe('live-capture DeltaBuffer (論点-001 debounce + offline)', () => {
  it('flushes on sentence boundary', () => {
    const b = new DeltaBuffer(100);
    expect(b.push('途中まで')).toBeNull();
    expect(b.push('文の終わり。')).toBe('途中まで文の終わり。');
  });
  it('flushes on char threshold', () => {
    const b = new DeltaBuffer(5);
    expect(b.push('あいうえおか')).toBe('あいうえおか');
  });
  it('B1: empty buffer is a no-op', () => {
    expect(new DeltaBuffer().flush()).toBeNull();
  });
  it('E4: queues while offline, drains on resume', () => {
    let online = false;
    const b = new DeltaBuffer(1, () => online);
    expect(b.push('オフライン中。')).toBeNull();
    expect(b.queued).toBe(1);
    online = true;
    expect(b.drain()).toEqual(['オフライン中。']);
    expect(b.queued).toBe(0);
  });
});
