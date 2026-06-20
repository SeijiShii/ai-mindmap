# ai-structuring 単体テスト計画（レート制限）

> **入力**: 001_REVISE_SPEC, 002_REVISE_PLAN
> **最終更新**: 2026-06-20

## 1. 追加テストケース
### 1.1 正常系
| ID | 対象 | 入力 | 期待 |
|---|---|---|---|
| R1 | memory limiter | max=3 内で 3 回 | 全て not blocked |
| R2 | 窓外経過 | windowMs 経過後に再呼び出し | カウントリセット、not blocked |
| R3 | makeRateLimited owner | 同 owner が上限超過 | blocked=true |
| R4 | makeRateLimited IP | 異 owner だが同 IP が上限超過 | blocked=true |

### 1.2 異常系/境界
| ID | 対象 | 条件 | 期待 |
|---|---|---|---|
| R5 | 上限ちょうど | max=3 で 4 回目 | 4 回目のみ blocked |
| R6 | structure ハンドラ統合 | rateLimited→true | 429 `{error:'rate_limited'}` + Retry-After |
| R7 | expand ハンドラ統合 | rateLimited→true | 429 |
| R8 | 順序 | 未認証 + over-limit | 401 が先（auth 優先） |

## 4. リグレッション強化
既存 api-structure.test.ts / api-routes.test.ts の 401/402/200 系を維持（rateLimited を not-blocked スタブで注入）。

## 6. カバレッジ目標
| 種別 | 目標 |
|---|---|
| rate-limit.ts 行 | 100% |

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:revise |
