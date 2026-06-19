# ai-expand 実装計画書

> **入力**: `./001_ai-expand_SPEC.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/features/ai-expand/context-builder.ts` | 対象ノード+周辺文脈の要約 | types | 60 |
| `api/expand.ts` | /api/expand（requireOwner + quota + callExpand + 永続化）、mode=gaps 対応 | ai-client, cost-tracking, auth | 90 |
| `src/features/ai-expand/ExpandButton.tsx` | 「広げて」「足りない観点は?」UI | _shared/ui | 60 |

## 2. 実装 Phase 分割
### Phase 1: context-builder（純ロジック）
- テスト: 文脈要約生成
### Phase 2: /api/expand（mock ai-client）
- テスト: 4 種 kind 追加、gaps モード、quota、injection
### Phase 3: ExpandButton 配線
- テスト: ボタン → 提案表示

## 3. 依存関係順序
```
context-builder → api/expand → ExpandButton
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
ai-client/cost-tracking/map-management 消費。

## 6. リスク
- 提案品質はプロンプト依存（tdd で反復）

## 7. DoD
- [ ] Phase 1-3 完了、4種kind/gaps/quota テスト green
- [ ] E2E（004）green
- [ ] 視覚レビューは mindmap-canvas 側

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
