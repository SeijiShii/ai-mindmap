# 単体テストレポート: _shared/auth

## 実施日時
2026-06-19 (JST)

## テスト実行環境
- Node v22.11.0 / Vitest 2.1.9

## テスト結果
| # | テストケース | 結果 |
|---|---|---|
| N1/N3 | requireOwner 認証済→ownerId | ✅ |
| E1 | 未認証→401（stub bypass なし） | ✅ |
| N2 | ensureUser 新規 guest insert | ✅ |
| B1 | ensureUser 冪等 | ✅ |
| N4 | linkAccount ゲスト→アカウント（id 不変） | ✅ |
| — | linkAccount 新規 non-guest | ✅ |

## 追加テストケース
追加なし

> 注: 匿名→authed API 200 のライブ統合検証は実 Clerk キーが必要（Release gate）。本テストは owner 解決・401・冪等 upsert のロジックを検証。本番セッション経路の実コード（clerk.ts createGuestSession）は存在（P4.46）。

## サマリー
| 項目 | 値 |
|---|---|
| 合計 | 6 |
| 成功 | 6 |
| 失敗 | 0 |
| 成功率 | 100% |
