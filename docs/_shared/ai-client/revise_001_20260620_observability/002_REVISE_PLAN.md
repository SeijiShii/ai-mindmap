# _shared/ai-client 変更計画書（観測性）

> **入力**: 001_REVISE_SPEC / **最終更新**: 2026-06-20

## 1. 既存ファイル変更
| ファイル | 変更 |
|---|---|
| src/main.tsx | initSentry(VITE_SENTRY_DSN) + `<Analytics/>` マウント |
| .env.example | VITE_SENTRY_DSN 追加 |
| package.json | @sentry/react, @vercel/analytics 追加 |

## 2. 新規ファイル
| ファイル | 責務 | LOC |
|---|---|---|
| src/observability/sentry.ts | scrubEvent + initSentry | ~45 |
| src/observability/sentry.test.ts | マスキング + dormant + init = 4 tests | ~55 |

## 3. 削除 (なし)
## 4. マイグレーション: 不要

## 5. 実装 Phase
- Phase 1: scrubEvent + initSentry + tests / Phase 2: main.tsx 配線 + Analytics + env

## 7. ロールアウト
| ステップ | 検証 |
|---|---|
| no-key 出荷 (dormant) | 134 tests green + build |
| release: VITE_SENTRY_DSN FILL → 本番でエラー捕捉 + PII マスク目視 | 実機 |

## 9. DoD
- [x] scrubEvent/initSentry + 4 tests green / [x] main 配線 / [x] build / [ ] 本番 DSN (release)

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:revise |
