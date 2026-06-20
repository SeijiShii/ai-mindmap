# billing マイグレーション計画（processed_events）

> **入力**: 001_REVISE_SPEC, 002_REVISE_PLAN
> **最終更新**: 2026-06-20

## 1. 移行対象
| 対象 | 種別 | 変更内容 |
|---|---|---|
| processed_events | DB テーブル新規 | `id text PK`, `created_at timestamptz default now()` |

> 生成済み: `drizzle/0000_strange_karen_page.sql`（drizzle.config.ts 新設に伴い全 6 テーブルの初期マイグレーション。既存 DB がある場合は processed_events のみ差分適用、新規 DB は initial として全適用）

## 2. 移行手順
### Step 1: マイグレーション適用（release / Class B）
- 内容: `DATABASE_URL` を本番/preview に向けて `npm run db:migrate`
- 検証: `SELECT to_regclass('public.processed_events');` が非 NULL
- 想定所要: 秒オーダー（テーブル作成のみ）

## 3. ロールバック手順
| 元 Step | 逆操作 | 検証 |
|---|---|---|
| Step 1 | `DROP TABLE processed_events;` | 冪等性が失われるため再 apply 推奨。topup 済みデータ (users) は無傷 |

## 4. ダウンタイム
- 不要（新規テーブル追加のみ、既存読み書きに影響なし）

## 5. 失敗時の対応
| 失敗箇所 | 対応 |
|---|---|
| migrate 失敗 | DATABASE_URL/権限確認 → 再実行。webhook は processed_events 不在時にエラー → migration 先行必須 |

## 6. 事前準備
- バックアップ: Neon ブランチ（自動）/ ステージング(dev branch) で先行検証

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 + drizzle 基盤新設 | /flow:revise |
