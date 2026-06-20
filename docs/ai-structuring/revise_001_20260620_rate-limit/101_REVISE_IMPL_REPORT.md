# 実装レポート — AI エンドポイント レート制限 (SEC-004 / O27)

> **状態**: 完了 / **日付**: 2026-06-20

## 実装サマリ
注入可能な `RateLimiter` (O35) を新設し、`/api/structure` `/api/expand` に owner + IP のスライディングウィンドウ制限を適用。over-limit は 429 `{error:'rate_limited', retryAfter}` + `Retry-After` ヘッダ。既存トークン quota (§4.6.2) と二重防御。

## 変更ファイル
| ファイル | 変更 |
|---|---|
| src/app/rate-limit.ts (新) | RateLimiter interface / createMemoryRateLimiter (sliding window) / clientIp / makeRateLimited (owner+IP) / tooManyRequests (429) / DEFAULT_RATE_LIMIT |
| src/app/rate-limit.test.ts (新) | R1-R8 + clientIp = 9 tests |
| src/app/api-structure.ts | StructureDeps.rateLimited 追加、auth 後に 429 分岐 |
| src/app/api-expand.ts | ExpandDeps.rateLimited 追加、auth 後に 429 分岐 |
| src/app/server-deps.ts | module-level sharedRateLimiter (warm instance 永続) + rateLimited 提供 |
| api/structure.ts, api/expand.ts | rateLimited 配線 |
| src/app/api-structure.test.ts, api-routes.test.ts | deps factory に rateLimited 追加 |

## テスト結果
- 全 121 tests green (rate-limit +9)、typecheck clean、vite build 成功
- R6/R7: 両ハンドラ 429 + Retry-After 検証 / R8: auth(401) 優先 / R3/R4: owner+IP 二重 / R2: 窓外リセット

## 残（release 時）
- 本番は複数インスタンスで in-memory が共有されないため、release Phase で Upstash 等の分散ストアを `RateLimiter` 実装として env 差し替え（interface は drop-in 済み）。閾値 (30/min owner, 60/min IP) は実測で `.env` 調整
