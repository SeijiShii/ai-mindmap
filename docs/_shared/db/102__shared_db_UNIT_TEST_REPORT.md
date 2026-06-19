# 単体テストレポート: _shared/db

## 実施日時
2026-06-19 (JST)

## 関連ドキュメント
- 003__shared_db_UNIT_TEST.md（計画）

## テスト実行環境
- Node: v22.11.0
- Vitest: 2.1.9

## テスト結果

| # | テストケース | テストファイル | 結果 | 備考 |
|---|---|---|---|---|
| N6/E4 | ensureOwnerId 有効/空 | with-owner.test.ts | ✅ | 空 owner で OwnerScopeError |
| N6/N7 | ownerScope 述語生成 | with-owner.test.ts | ✅ | maps/usageLog |
| E4 | owner なしスコープ拒否 | with-owner.test.ts | ✅ | |
| N6 | assertOwner 一致 | with-owner.test.ts | ✅ | |
| E1 | 他人行/欠落で 404 | with-owner.test.ts | ✅ | 漏洩なし（SEC-001） |
| — | enum 値（source/status/kind/endpoint） | schema.test.ts | ✅ | 4 enum |
| — | 5 テーブル + スコープ列 | schema.test.ts | ✅ | |

## 追加テストケース
追加テストケースなし（計画 003 をカバー、pg-mem 結合は map-management で実施）

## サマリー
| 項目 | 値 |
|---|---|
| 計画テスト数 | 15 |
| 追加テスト数 | 0 |
| 合計 | 15 |
| 成功 | 15 |
| 失敗 | 0 |
| 成功率 | 100% |
| typecheck | clean |
