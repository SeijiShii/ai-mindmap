# 実装レポート — O22(B) 段階認証 UI + ゲストセッション bootstrap

> **状態**: 完了（no-key スコープ） / **日付**: 2026-06-20

## 実装サマリ
(A) クライアントのゲストセッション確立 (`/api/auth/guest` → ticket → signIn.create → setActive) と (B) サインイン/アカウント連携/サインアウト UI (両輪) を実装。AppShell は Clerk 非依存を維持（authControl prop 注入）し、既存テストを壊さない。

## 変更/新規ファイル
| ファイル | 内容 |
|---|---|
| src/auth/guest-session.ts (新) | establishGuestSession (純粋, 注入式) |
| src/auth/guest-session.test.ts (新, 2) | bootstrap / 失敗時非活性化 |
| src/auth/useGuestSession.ts (新) | Clerk useAuth/useSignIn ラッパ (1 回 bootstrap, retry 可) |
| src/auth/AuthControl.tsx (新) | SignedOut→SignInButton / SignedIn→UserButton(連携+サインアウト) |
| src/app/App.tsx | AppShell authControl prop (Clerk 非依存維持) |
| src/main.tsx | AuthControl 注入 |

## テスト結果
- 全 136 tests green (+2)、typecheck clean、build 成功
- AppShell の既存 5 テストは authControl なしで不変（Clerk 非依存を確認）
- establishGuestSession: 成功時 setActive(sessionId) / fetch 失敗時 setActive 未呼出

## O22 充足
- (A) ゲスト実セッション: bootstrap 配線済 / (B) 連携(UserButton manage)・サインイン(SignInButton)・サインアウト(UserButton, 両輪) 実装
- データ引き継ぎ: 同 Clerk userId 維持（owner churn 回避、scaffold 準拠）

## 残（release）
- 実 Clerk publishable/secret キーでアプリ起動 → guest→authed→連携→signout を実機確認
- aged guest の連携 step-up (reverification 403) を release E2E (aged guest smoke) で確認
