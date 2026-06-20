# _shared/ai-client 変更仕様書（観測性: Sentry PII マスキング + Analytics）

> **改修種別**: 拡張（観測性配線）
> **issue / slug**: 001 / observability
> **最終更新**: 2026-06-20
> **起点**: AUDIT_20260620_1232.md [AUDIT-perspective-003] SEC-003/O26 (High, legal) + O01/O02 (Medium)

## 1. 変更概要
エラー監視 (O01) とアナリティクス (O02) が未配線。SEC-003 (legal_required) は「Sentry beforeSend で思考内容/PII マスク + エラーに本文含めない」を要求。Sentry を **PII マスキング付き** で配線（DSN 未設定なら dormant = no-key safe）、cookieless Analytics を追加。

## 2. 変更前 vs 変更後
| 対象 | 変更前 | 変更後 |
|---|---|---|
| エラー監視 | なし | initSentry(dsn?) — beforeSend で message/exception/breadcrumb を scrubPii、request body/cookie/query + extra を破棄 |
| 計測 | なし | `<Analytics/>` (Vercel, cookieless, デプロイ後のみ稼働) |

## 3. 影響範囲
| 対象 | 影響度 | 説明 |
|---|---|---|
| observability (新) | 高 | sentry.ts |
| main.tsx | 中 | init + Analytics マウント |

## 4. 後方互換性
- ✅ DSN なしでは Sentry dormant、Analytics は本番のみ稼働。dev/test 挙動不変

## 5. ロールバック方針
- コード revert。DSN を空にすれば監視 OFF

## 6. リリース戦略
- 一括。VITE_SENTRY_DSN は release で FILL（公開 DSN）

## 7. 詳細仕様
- `scrubEvent(event)`: message / exception.values[].value / breadcrumbs[].message を scrubPii、request.{data,cookies,query_string} delete、extra={}（思考/transcript の漏洩防止）
- `initSentry(dsn?, env)`: dsn なし→false (no-op)、あり→Sentry.init({ sendDefaultPii:false, beforeSend: scrubEvent, beforeBreadcrumb scrub })
- pii-scrub.ts (既存 SEC-003 frontline) を再利用

## 9. 未決事項
- サーバ側 (api/ edge) の @sentry/node 配線は release で追加可（フロントが思考内容の主発生源のため MVP はフロント優先）。論点として残置 (Low)

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:revise |
