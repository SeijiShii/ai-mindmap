# mindmap-canvas 実装計画書

> **入力**: `./001_mindmap-canvas_SPEC.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/features/mindmap-canvas/Canvas.tsx` | React Flow ラッパ + ノード/エッジ描画 | reactflow, _shared/ui | 150 |
| `src/features/mindmap-canvas/MindNode.tsx` | カスタムノード（人/AI 視覚区別、編集、sanitize） | _shared/ui | 110 |
| `src/features/mindmap-canvas/edit-actions.ts` | 追加/削除/移動/つなぎ直し + 楽観更新 | map-management | 130 |
| `src/features/mindmap-canvas/suggestion-merge.ts` | suggested ノードの受領/承認/却下 + 競合解決（追加のみ） | types | 100 |
| `src/features/mindmap-canvas/tree-guard.ts` | 循環防止 + ツリー整合 | — | 50 |

## 2. 実装 Phase 分割
### Phase 1: tree-guard + edit-actions（純ロジック）
- テスト: 循環防止、楽観更新/ロールバック
### Phase 2: suggestion-merge（追加のみ競合解決、論点-001）
- テスト: 人編集中の AI 追加が壊さない、承認/却下
### Phase 3: Canvas + MindNode（React Flow 配線、sanitize）
- テスト: 描画、人/AI 区別、XSS sanitize

## 3. 依存関係順序
```
tree-guard → edit-actions → suggestion-merge → MindNode → Canvas
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
なし（map-management/types/ui 消費）

## 6. リスク
- React Flow の大量ノード性能 → 仮想化設定 + メモ化
- ライブ競合（論点-001）→ 「追加のみ」で人編集保護を最優先

## 7. DoD
- [ ] Phase 1-3 完了、循環防止/競合/sanitize テスト green
- [ ] E2E（004）green
- [ ] 視覚レビュー Design gate（人/AI 区別が成立）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
