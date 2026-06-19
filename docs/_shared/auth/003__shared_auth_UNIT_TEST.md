# _shared/auth 単体テスト計画

> **入力**: `./001__shared_auth_SPEC.md`, `./002__shared_auth_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | getOwnerId | 有効セッション → clerk_user_id |
| N2 | ensureUser | 新規 owner → users upsert（is_guest=true） |
| N3 | requireOwner | 認証済 → ownerId 返却 |
| N4 | アカウント連携 | link → is_guest=false、id 不変（maps 引き継ぎ） |
| N5 | **ゲスト→authed 実経路** | 匿名サインイン後、保護 API が 200（P4.46、stub でない） |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | requireOwner 未認証 | 401 |
| E2 | 他人 owner_id 操作 | 403/404（withOwner 連携、SEC-001） |
| E3 | セッション失効 | 再認証要求 |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | ensureUser 二重呼び | 既存 owner | 冪等（upsert） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| Clerk backend | Phase1 は mock、Phase2 は test instance / 実セッション経路検証 |
| _shared/db | pg-mem |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
@clerk/backend, _shared/db

## 5. テスト実行環境
Vitest、並列 ✅

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
