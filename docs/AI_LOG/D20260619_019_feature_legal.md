# AI_LOG セッション D20260619_019 — /flow:feature (legal)

**実行日時**: 2026-06-19 (+09:00)
**コマンド**: /flow:feature legal
**対象**: 機能 legal
**実行者**: Claude (Opus 4.8)（/flow:auto dispatch, auto-pick）
**状態**: 完了
**含まれる decision**: D20260619-049 〜 D20260619-050

---

## 主要決定サマリ
| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260619-049 | 対象選定 | legal（優先度4の最後） | auto-recommended |
| D20260619-050 | 法務設計 | 3ページ + consent + データ削除セルフサービス(O54) | auto-recommended |

## 生成・更新したアーティファクト
- 新規: 001_SPEC / 002_PLAN / 003_UNIT_TEST / 004_E2E_TEST

## 未決事項
- [論点-001] 特商法の住所開示（請求時開示で省略推奨）

## 学習・改善
- コマンド変更なし

---

## Decisions

```yaml
- id: D20260619-049
  timestamp: 2026-06-19T20:20:00+09:00
  command: /flow:feature
  phase: Step 0.3 / 対象選定
  question: 次の設計対象
  chosen: legal
  chosen_type: auto-recommended
  depends_on: [D20260619-025]
  context: 優先度4の最後。ui 依存。公開前必須(§9)。

- id: D20260619-050
  timestamp: 2026-06-19T20:22:00+09:00
  command: /flow:feature
  phase: Step 3 / 法務設計
  question: 法務ページ + データ主体権利
  chosen: privacy/terms/sct 3ページ(フッタ常設 O55) + 初回 consent + データ削除セルフサービス(O54 非交渉の必須、ゲスト特例で窓口削除を約束しない)
  chosen_type: auto-recommended
  depends_on: [D20260619-028]
  context: O22 ゲスト×O12/O54 ペア。運営は本人特定不能→アプリ内セルフ削除で完結。§9.3 と整合。
```
