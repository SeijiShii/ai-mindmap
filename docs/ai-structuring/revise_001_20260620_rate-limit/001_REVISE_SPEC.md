# ai-structuring 変更仕様書（AI エンドポイント レート制限）

> **改修種別**: 拡張（セキュリティ要件実装）
> **issue / slug**: 001 / rate-limit
> **基準 SPEC**: `../001_ai-structuring_SPEC.md`
> **最終更新**: 2026-06-20
> **タグ**: auth-required, server-side
> **起点**: AUDIT_20260620_1232.md [AUDIT-perspective-001] / 論点-008 [SEC-004] (accepted-as-requirement)

## 1. 変更概要
高頻度の AI エンドポイント `/api/structure` `/api/expand` に**レート制限が未実装** (O27/SEC-004)。ユーザー単位 + IP 単位のスライディングウィンドウ制限を注入可能な `RateLimiter` (O35) として実装し、無料枠トークン上限 (既存 quota) と二重防御する。over-limit は **429 Too Many Requests** を返す。

## 2. 変更前 vs 変更後

### 2.2 入出力変更
| 対象 | 変更前 | 変更後 | 互換性 |
|---|---|---|---|
| POST /api/structure | auth→quota→AI | auth→**rate-limit**→quota→AI。超過時 429 `{error:'rate_limited', retryAfter}` | 後方互換（正常系は不変、過剰呼び出しのみ 429） |
| POST /api/expand | 同上 | 同上 | 同上 |

### 2.3 データモデル変更
| エンティティ | 変更内容 | マイグレーション要否 |
|---|---|---|
| (なし) | レート制限はインメモリ/外部ストア、DB スキーマ変更なし | 不要 |

## 3. 影響範囲
| 対象 | 影響度 | 説明 |
|---|---|---|
| ai-structuring / ai-expand handler | 高 | 直接対象（429 分岐追加） |
| _shared/app-shell (server-deps) | 中 | limiter 注入 |
| billing/cost-tracking | 低 | quota との二重防御（既存 quota は不変） |

## 4. 後方互換性
- **互換維持**: ✅ 正常利用は挙動不変。閾値超過の異常呼び出しのみ 429。閾値は env/定数で可変（論点-001 と同様 tunable）

## 5. ロールバック方針
- コード revert で完全に戻る（DB 変更なし）。limiter を no-op 実装に差し替えるだけでも無効化可

## 6. リリース戦略
- 一括。閾値は保守的デフォルト（owner 30 req/min, IP 60 req/min）→ 実測で `.env` 調整。本番は Upstash 等の分散ストアに差し替え可能な interface（O35、no-key で in-memory 実装を出荷、実ストアは release 時 env）

## 7. 詳細仕様（新仕様）
### 7.1 RateLimiter interface
- `check(key, max, windowMs, now): boolean`（true=超過/ブロック）。スライディングウィンドウ（直近 windowMs の呼び出し数を key ごとに保持）
- `createMemoryRateLimiter()`: 単一インスタンス/テスト用。窓外エントリは GC
- `rateLimited(ownerId, req, now)`: owner key と client-IP key（`x-forwarded-for` 先頭）の両方を評価、いずれか超過で true

### 7.4 エラー
- 429 `{ error: 'rate_limited', retryAfter: <秒> }`、`Retry-After` ヘッダ付与

## 9. 未決事項
現時点で論点なし (2026-06-20)。閾値の実測調整は運用で `.env`/定数。

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成（SEC-004 レート制限） | /flow:revise |
