# legal 単体テスト計画

> **入力**: `./001_legal_SPEC.md`, `./002_legal_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | api/account/delete | owner の全データ削除（maps cascade + usage + user） |
| N2 | 法務ページ | 3 ページ表示 |
| N3 | ConsentBanner | opt-in 記録 |
| N4 | DeleteAccountPanel | 二段階確認後に削除 API 呼び出し |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | 他人データ削除 | 不可（自分のみ、SEC-001） |
| E2 | 未確認削除 | 1 段階目では実行しない |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | データなしユーザー削除 | 0 件 | 冪等成功 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| _shared/db | pg-mem |
| auth | requireOwner mock + 他人アクセス実検証 |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
_shared/db, _shared/auth, _shared/ui

## 5. テスト実行環境
Vitest + jsdom

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
