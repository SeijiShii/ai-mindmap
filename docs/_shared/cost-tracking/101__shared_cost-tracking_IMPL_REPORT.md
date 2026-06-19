# 実装レポート: _shared/cost-tracking

## 実装日時
2026-06-19 (JST)

## モード
feature (cross-cutting)

## 関連ドキュメント
- 001/002/003 + [AI_LOG](../AI_LOG/D20260619_023_tdd__shared_cost-tracking.md)

## 変更一覧
### Phase 1: pricing
- `src/cost/pricing.ts` — `ratesFromEnv`（.env 単価、欠落時デフォルト）+ `estimateCost`（tokens × 単価、6 桁丸め）
### Phase 2: quota（SEC-004、injectable store O35）
- `src/cost/quota.ts` — `QuotaStore` interface（DB 抽象）/ `checkQuota` / `consumeQuota`（free→topup 順、原子 set）/ `addTopup`（billing webhook）/ 月次 lazy リセット / `alertLevel`（80/100/120%）

## 実装計画からの差分
| 項目 | 内容 |
|---|---|
| 設計通り | injectable store でロジックを DB 非依存に（O35）。実 DB 配線は app-shell / billing 統合時 |
| 省略 | record-usage の実 DB insert は app-shell wiring（store 実装注入）で |

## PR Description
### タイトル
_shared/cost-tracking: 枠管理 + 単価（SEC-004）
### 変更内容
- pricing（.env 単価）+ quota（free→topup/lazy リセット/アラート）、injectable store
### テスト
- 9/9 パス、typecheck clean（累計 33/33）
