# _shared/cost-tracking 単体テスト計画

> **入力**: `./001__shared_cost-tracking_SPEC.md`, `./002__shared_cost-tracking_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | estimateCost | tokens × .env 単価 = 概算（小数精度） |
| N2 | recordUsage | usage_log insert + cost 保存 |
| N3 | consumeQuota | free 優先消費 → 枯渇後 topup |
| N4 | 月次 lazy リセット | reset_at 経過 → free 補充 |
| N5 | getMonthlyUsage | 当月集計が正しい |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | checkQuota 枯渇 | blocked=true（呼び出し側が 402 案内） |
| E2 | 同時 consume | 原子更新で二重消費しない |
| E3 | .env 単価欠落 | 既定 0 or 警告（コスト 0 表示で気付ける） |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | 残量ちょうど 0 | 0 | blocked |
| B2 | 80% 到達 | pct=80 | アラート発火 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| _shared/db | pg-mem |
| 時刻（reset 判定） | 固定値注入 |
| alert 送信 | mock/spy |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
_shared/db

## 5. テスト実行環境
Vitest、並列 ✅

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
