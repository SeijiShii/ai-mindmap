import type { EdgeKind } from '../../types/domain';

/** Branch-kind chip with low-saturation color coding (design-system §5). */
const KIND_STYLE: Record<EdgeKind, string> = {
  tree: 'bg-surface-muted text-text-muted',
  relation: 'bg-accent-soft text-accent',
  opposition: 'bg-surface-muted text-danger',
  question: 'bg-surface-muted text-primary',
  example: 'bg-surface-muted text-success',
};

const KIND_LABEL: Record<EdgeKind, string> = {
  tree: '枝',
  relation: '関連',
  opposition: '対立',
  question: '問い',
  example: '具体例',
};

export function Chip({ kind }: { kind: EdgeKind }) {
  return (
    <span
      data-kind={kind}
      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs ${KIND_STYLE[kind]}`}
    >
      {KIND_LABEL[kind]}
    </span>
  );
}
