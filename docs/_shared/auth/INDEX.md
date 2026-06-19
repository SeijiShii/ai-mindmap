# _shared/auth ドキュメントインデックス

**最終更新**: 2026-06-19
**生成元**: /flow:concept (初期化)

<!-- auto-generated-start -->

## 責務
認証・認可基盤（Clerk）。匿名ゲスト開始→課金/同期時に段階認証、ゲスト→アカウント連携データ引き継ぎ。

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001__shared_auth_SPEC.md | SPEC | 設計済 | 2026-06-19 | Clerk匿名ゲスト→段階認証+withOwner |
| 002 | 002__shared_auth_PLAN.md | PLAN | 設計済 | 2026-06-19 | guest-session/get-owner/ensure-user |
| 003 | 003__shared_auth_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-06-19 | 匿名→authed 実経路検証(P4.46) |

## 関連
- 親 concept: `../../concept.md` §1.3.2 auth 行
- **依存**: _shared/db

## AI アクセスガイド
- 責務概要 → README.md
- 仕様詳細 → 001_*_SPEC.md (まだ未生成)

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
