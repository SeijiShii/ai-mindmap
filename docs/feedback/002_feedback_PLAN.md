# feedback 実装計画書

> **入力**: `./001_feedback_SPEC.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/features/feedback/pii-scrub-context.ts` | 自動コンテキスト収集 + PII scrub | — | 70 |
| `src/features/feedback/FeedbackWidget.tsx` | 👍/👎 + バグ報告 UI（1 タップ） | _shared/ui | 100 |
| `api/feedback/send.ts` | hub ingestion 中継 + 即時通知（env で hub URL） | — | 60 |

## 2. 実装 Phase 分割
### Phase 1: pii-scrub-context（純ロジック）
- テスト: コンテキスト収集、PII マスク（SEC-003）
### Phase 2: api/feedback/send（hub 中継 + 即時通知、env 駆動）
- テスト: hub 未設定なら即時通知のみ、再送
### Phase 3: FeedbackWidget 配線

## 3. 依存関係順序
```
pii-scrub-context → api/feedback/send → FeedbackWidget
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
なし（_shared/ui 消費）。hub は外部 endpoint。

## 6. リスク
- hub 未構築（論点-001）→ env 未設定で即時通知のみにフォールバック
- PII 漏洩防止（scrub テスト必須）

## 7. DoD
- [ ] Phase 1-3 完了、PII scrub/フォールバック テスト green
- [ ] E2E（004）green
- [ ] 視覚レビュー Design gate

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
