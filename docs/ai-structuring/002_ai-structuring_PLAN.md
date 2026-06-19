# ai-structuring 実装計画書

> **入力**: `./001_ai-structuring_SPEC.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/features/ai-structuring/tree-summary.ts` | 既存ツリーを LLM 用に要約（トークン節約） | types | 80 |
| `src/features/ai-structuring/merge.ts` | StructureResult → 追加のみマージ（重複抑制、上限） | types, map-management | 120 |
| `api/structure.ts` | /api/structure ハンドラ（requireOwner + quota + ai-client + merge） | ai-client, cost-tracking, auth | 90 |
| `src/features/ai-structuring/throttle.ts` | 連続 delta スロットリング/キュー | — | 50 |

## 2. 実装 Phase 分割
### Phase 1: tree-summary + merge（純ロジック）
- テスト: 要約生成、追加のみマージ、重複抑制、上限
### Phase 2: throttle
- テスト: 連続 delta のスロットリング
### Phase 3: /api/structure（requireOwner + quota + ai-client mock）
- テスト: 枠枯渇 402、injection 無視、parse 失敗フォールバック

## 3. 依存関係順序
```
tree-summary → merge → throttle → api/structure
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
ai-client/cost-tracking/map-management を消費。

## 6. リスク
- **コア複雑度**（concept §8 論点-002）: マージ品質が体験を左右。追加のみで人編集保護を最優先、品質は検証で反復
- コスト: 高頻度 → 要約送信 + レート制限 + quota ゲート必須

## 7. DoD
- [ ] Phase 1-3 完了、マージ/injection/quota テスト green
- [ ] E2E（004）green（mock LLM で逐次追加）
- [ ] 視覚レビューは mindmap-canvas 側

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
