# 実装レポート: _shared/auth

## 実装日時
2026-06-19 (JST)

## モード
feature (cross-cutting)

## 関連ドキュメント
- 001/002/003 + [AI_LOG](../AI_LOG/D20260619_027_tdd__shared_auth.md)

## 変更一覧
### Phase 1: owner 解決 + ensureUser
- `src/auth/owner.ts` — `getOwnerId` / `requireOwner`（injectable SessionVerifier、401=AuthError、stub bypass なし）
- `src/auth/ensure-user.ts` — `ensureUser`（冪等 upsert）/ `linkAccount`（ゲスト→アカウント、id 不変でデータ引き継ぎ、O22）
### Phase 2: 本番ゲストセッション実コード（P4.46）
- `src/auth/clerk.ts` — `createClerkVerifier`（@clerk/backend authenticateRequest）+ `createGuestSession`（server `users.createUser` + `signInTokens.createSignInToken`、scaffold パターン）

## 実装計画からの差分
| 項目 | 内容 |
|---|---|
| P4.46 | **本番セッション経路の実コードを実装**（stub 注入でない）。匿名→authed の 200 ライブ検証は実 Clerk キーが要るため Release 時、ただし実コード経路は存在 |
| 設計通り | SessionVerifier/UserStore を injectable にして owner 解決・401・冪等 upsert を unit テスト |

## PR Description
### タイトル
_shared/auth: Clerk 匿名ゲスト→段階認証 + 所有者解決（SEC-001/P4.46）
### 変更内容
- requireOwner(401) + ensureUser(冪等) + linkAccount(id 不変) + 本番ゲストセッション実コード
### テスト
- 6/6 パス、typecheck clean（累計 54/54）
