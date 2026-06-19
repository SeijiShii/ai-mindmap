# _shared/auth 実装計画書

> **入力**: `./001__shared_auth_SPEC.md`, `~/.claude/flow-data/guest-auth-clerk-scaffold.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/auth/clerk-provider.tsx` | ClerkProvider ラッパ + ゲスト自動サインイン hook | @clerk/clerk-react | 70 |
| `src/auth/guest-session.ts` | ゲストセッション確立（scaffold パターン） | @clerk/backend | 90 |
| `api/auth/guest.ts` | server: createUser + signInToken 発行 | @clerk/backend | 60 |
| `src/auth/get-owner.ts` | getOwnerId / requireOwner（サーバ side） | @clerk/backend | 50 |
| `src/auth/ensure-user.ts` | users upsert（_shared/db） | _shared/db | 40 |
| `src/auth/link-account.ts` | ゲスト→アカウント連携（is_guest 更新） | clerk | 50 |

## 2. 実装 Phase 分割（injectable + interface、O35）
### Phase 1: getOwnerId / requireOwner interface + ensureUser
- mock Clerk でテスト（ownerId 解決ロジック）
### Phase 2: ゲストセッション実装（P4.46、本番経路）
- guest.ts（server createUser + signInToken）+ guest-session.ts（フロント ticket）
- テスト: 匿名サインイン → authed owner で保護 API 200（stub でなく実セッション経路）
### Phase 3: アカウント連携 + ClerkProvider 配線
- link-account（is_guest=false、id 不変でデータ引き継ぎ）

### Phase 3.5: app/api bootstrap
- requireOwner ミドルウェアを API ルートに配線（app-shell と協調）。SDK: @clerk/clerk-react + @clerk/backend install

## 3. 依存関係順序
```
ensure-user(_shared/db) → get-owner → guest-session/guest.ts → link-account → clerk-provider
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
_shared/db users を upsert。app-shell が requireOwner を全保護ルートに適用。

## 6. リスク
- **P4.46 ハードゲート**: stub auth（固定 ownerId 注入）テストだけで green にしない。匿名→authed API 200 の実経路検証を必須に
- Clerk anonymous の挙動はプラン依存 → scaffold パターンで確実性担保

## 7. DoD
- [ ] Phase 1-3 完了、匿名→authed 検証 green（P4.46）
- [ ] withOwner と統合し他人データ漏洩テスト green（SEC-001）
- [ ] E2E スキップ（cross-cutting、認証フロー E2E は app-shell/map-management でカバー）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
