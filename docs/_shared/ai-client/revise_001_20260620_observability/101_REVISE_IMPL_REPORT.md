# 実装レポート — 観測性 (SEC-003 Sentry PII マスキング + O01/O02)

> **状態**: 完了（no-key スコープ） / **日付**: 2026-06-20

## 実装サマリ
Sentry を PII マスキング付きで配線（DSN 未設定なら dormant）。`beforeSend` で message/exception/breadcrumb を scrubPii、request body/cookie/query + extra を破棄し、思考内容/transcript がエラーログで流出しないことを保証 (SEC-003 legal_required)。cookieless Analytics (O02) を追加。

## 変更/新規ファイル
| ファイル | 内容 |
|---|---|
| src/observability/sentry.ts (新) | scrubEvent + initSentry (dormant without DSN) |
| src/observability/sentry.test.ts (新, 4) | マスキング / extra・request 破棄 / dormant / init |
| src/main.tsx | initSentry + `<Analytics/>` |
| .env.example | VITE_SENTRY_DSN |
| package.json | @sentry/react@^10, @vercel/analytics |

## テスト結果
- 全 134 tests green (+4)、typecheck clean、build 成功
- PII マスキング (メール/電話/番号) + request body/extra 破棄 + dormant 検証

## 残（release）
- VITE_SENTRY_DSN（公開 DSN）FILL → 本番でエラー捕捉確認 + マスキング目視
- サーバ側 @sentry/node 配線は任意の後追い（論点 Low、フロントが思考内容の主発生源）
