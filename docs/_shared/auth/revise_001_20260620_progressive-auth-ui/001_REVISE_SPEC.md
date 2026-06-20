# _shared/auth 変更仕様書（O22(B) 段階認証 UI + ゲストセッション bootstrap）

> **改修種別**: 拡張（契約済み動線の実装）
> **issue / slug**: 001 / progressive-auth-ui
> **基準 SPEC**: `../001_auth_SPEC.md`
> **最終更新**: 2026-06-20
> **起点**: AUDIT_20260620_1232.md [AUDIT-perspective-004] O22(B) (High, CF-20260609-009)

## 1. 変更概要
ClerkProvider + サーバ側ゲスト発行 (createGuestSession) は実装済みだったが、**(A) クライアントのゲストセッション確立が未配線**（`signIn.create({strategy:'ticket'})` がコメントのみ）で、**(B) サインイン/アカウント連携/サインアウト UI が皆無**だった（broad-match が (A) で pass して見逃し）。concept §1.2 が「ゲスト開始 → 課金/同期時に段階認証 + ゲスト→アカウント連携データ引き継ぎ」を契約。両輪 (連携↔サインアウト) を実装。

## 2. 変更前 vs 変更後
| 対象 | 変更前 | 変更後 |
|---|---|---|
| ゲストセッション (A) | サーバ発行のみ、client 未確立 | useGuestSession: POST /api/auth/guest → signIn.create(ticket) → setActive で実セッション確立 |
| サインイン/連携 (B) | UI なし | AuthControl: SignedOut→SignInButton(ログイン/登録)、SignedIn→UserButton(アカウント管理=email/OAuth 連携=アップグレード) |
| サインアウト (両輪) | UI なし | UserButton 内サインアウト (afterSignOutUrl="/") |

## 3. 影響範囲
| 対象 | 影響度 | 説明 |
|---|---|---|
| _shared/auth | 高 | bootstrap + AuthControl |
| app-shell | 中 | authControl prop（Clerk 非依存を維持） |

## 4. 後方互換性
- ✅ AppShell は authControl 省略時 Clerk 非依存（既存テスト不変）。main.tsx でのみ実 Clerk UI を注入

## 5. ロールバック方針
- コード revert。AuthControl を外せば従来状態

## 6. リリース戦略
- 一括。実 Clerk キーでの描画確認・連携フローは release Phase 2 / E2E（aged guest の連携 step-up は scaffold 準拠で同 userId 維持）

## 7. 詳細仕様
- `establishGuestSession(ports)` (純粋, 注入式): fetchTicket → createSignIn(ticket) → setActive。同 Clerk userId 維持でデータ引き継ぎ (O22 データ保存不変条件)
- `useGuestSession()`: isLoaded && !isSignedIn で 1 回 bootstrap、失敗時リトライ可
- `AuthControl`: SignedIn=UserButton(連携+サインアウト) / SignedOut=SignInButton(modal)

## 9. 未決事項
- ゲストの email/OAuth 連携時の aged-session step-up（reverification 403）は Clerk 標準フローに委譲。release E2E (aged guest smoke) で確認（論点 Low）

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:revise |
