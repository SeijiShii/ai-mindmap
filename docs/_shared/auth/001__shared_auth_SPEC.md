# _shared/auth 認証・認可基盤 仕様書

> **役割**: Clerk 匿名ゲスト開始 → 課金/同期時に段階認証。ctxOwner 供給 + withOwner 所有者強制（SEC-001）。
> **タグ**: cross-cutting, auth-required
> **最終更新**: 2026-06-19
> **入力**: `../../concept.md` §1.2/§3.X, `../db/001__shared_db_SPEC.md`, perspectives O22

---

## 1. 提供インターフェース
- `<ClerkProvider>` ラッパ（フロント）
- **ゲストセッション確立**（匿名サインイン）— 初回起動でアカウント不要（O22）
- `getOwnerId(req)` — Clerk セッションから clerk_user_id を解決（サーバ side、API ルート）
- `requireOwner(req)` — 未認証なら 401、認証済なら ctxOwner を返す
- `ensureUser(ownerId)` — users テーブルへ upsert（FK 保証、_shared/db）
- ゲスト→アカウント連携（同 Clerk id 保持でデータ引き継ぎ）

## 2. 入出力
| 関数 | 入力 | 出力 |
|---|---|---|
| ゲストサインイン | （初回起動、ユーザー操作なし） | 匿名 Clerk セッション確立 |
| getOwnerId(req) | リクエスト（Cookie/JWT） | clerk_user_id \| null |
| requireOwner(req) | 同上 | ownerId or 401 |
| アカウント連携 | email/OAuth（課金/同期時） | is_guest=false に更新、id 不変 |

## 3. データモデル
- users（_shared/db）へ upsert。id = Clerk user_id（匿名も発行、連携後も不変 → データ引き継ぎ自動）

## 4. バリデーション / エラー
| 条件 | 振る舞い |
|---|---|
| 未認証で保護 API | 401（ゲストセッションすら無い異常時） |
| 他人の owner_id 操作 | requireOwner + withOwner で 403/404（SEC-001） |
| Clerk セッション失効 | 再ゲストセッション or 再認証 |

## 5. NFR + 連携
### 5.1 NFR（SEC-001 / O22 / P4.46）
- **本番でゲスト実セッションが張れる経路を実装**（stub 注入だけにしない、P4.46）。匿名サインイン → authed owner で保護 API が 200 を検証
- 認証摩擦最小: 初回起動はアカウント不要、課金/同期時のみ段階認証
### 5.2 連携
| 連携先 | 依存 |
|---|---|
| _shared/db | users upsert / ctxOwner を withOwner に供給 |
| billing | 課金時のアカウント連携トリガ |
| 全 API ルート（app-shell） | requireOwner ミドルウェア |

## 6. タグ別（auth-required）
- ロール: 単一ユーザー所有（admin ロールは MVP 不要）
- 所有者チェック: 全データアクセスで owner 照合（SEC-001）
- 匿名/段階認証: Clerk Anonymous + Social Provider（Google）/ パスキーは将来

## 7. スコープ外
- 多人数共有/権限委譲（非対象）
- 管理者画面（MVP なし）

## 8. 未決事項
### [論点-001] ゲスト匿名セッションの実装手段（Clerk Anonymous の可否）
- **影響範囲**: ゲストサインイン経路、P4.46
- **問い**: Clerk の anonymous/no-password サインインを使うか、guest-auth-clerk-scaffold パターン（server createUser + signInToken → フロント ticket）を使うか
- **推奨**: `guest-auth-clerk-scaffold.md` のパターン（server `users.createUser()` + `signInTokens.createSignInToken()` → フロント `signIn.create({strategy:'ticket'})`）。理由: Clerk で確実に実セッションを張れる実績パターン、P4.46 を満たす
- **判断期限**: tdd 実装時
- **担当**: 本人

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
