# feedback 単体テスト計画

> **入力**: `./001_feedback_SPEC.md`, `./002_feedback_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | pii-scrub-context | 画面/route/version/UA 収集、PII マスク |
| N2 | send hub 設定済 | hub へ POST + service ID |
| N3 | FeedbackWidget | 👍/👎/バグ報告 送信 |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | PII 混入 | scrub される（SEC-003） |
| E2 | hub 未設定 | 即時通知のみ（フォールバック） |
| E3 | hub ダウン | 再送/キュー |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | 空テキスト | 空 | リアクションのみ送信可 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| hub fetch | mock |
| 通知 | spy |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
_shared/ui

## 5. テスト実行環境
Vitest + jsdom

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
