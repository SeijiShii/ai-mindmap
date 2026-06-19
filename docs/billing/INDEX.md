# billing ドキュメントインデックス

**最終更新**: 2026-06-19
**生成元**: /flow:concept (初期化)

<!-- auto-generated-start -->

## 機能概要
Stripe 単発課金（PWYW、AI 無料枠 + 100 円追加枠）、Webhook 署名検証。

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_billing_SPEC.md | SPEC | 設計済 | 2026-06-19 | Stripe PWYW 100円追加枠 |
| 002 | 002_billing_PLAN.md | PLAN | 設計済 | 2026-06-19 | checkout/webhook/UpgradePanel |
| 003 | 003_billing_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-06-19 | 署名/冪等/価格透明 |
| 004 | 004_billing_E2E_TEST.md | E2E_TEST | 設計済 | 2026-06-19 | paywall + O43 |


| 101 | 101_billing_IMPL_REPORT.md | IMPL_REPORT | 実装(コア) | 2026-06-19 | 2 ケース green |
| 102 | 102_billing_UNIT_TEST_REPORT.md | UNIT_TEST_REPORT | 実装(コア) | 2026-06-19 | 100% |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし) |

## 関連
- 親 concept: `../concept.md` §1.3.1 billing 行
- **依存**: _shared/db, _shared/auth, _shared/cost-tracking
- 実装コード: `src/features/billing/`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- 仕様詳細 → 001_*_SPEC.md (まだ未生成)

## 機能性質タグ
- feature, auth-required

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
