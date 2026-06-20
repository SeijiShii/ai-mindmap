# _shared/auth 変更計画書（O22(B) 段階認証 UI）

> **入力**: 001_REVISE_SPEC / **最終更新**: 2026-06-20

## 1. 既存ファイル変更
| ファイル | 変更 |
|---|---|
| src/app/App.tsx | AppShell に authControl?: ReactNode prop、header actions に注入 |
| src/main.tsx | `<AppShell authControl={<AuthControl/>} />` |

## 2. 新規ファイル
| ファイル | 責務 | LOC |
|---|---|---|
| src/auth/guest-session.ts | establishGuestSession (純粋, 注入式) | ~20 |
| src/auth/guest-session.test.ts | bootstrap 成功 / 失敗時 setActive 未呼出 = 2 tests | ~35 |
| src/auth/useGuestSession.ts | Clerk hooks ラッパ | ~35 |
| src/auth/AuthControl.tsx | SignedIn/SignedOut + UserButton/SignInButton | ~30 |

## 3. 削除 (なし)
## 4. マイグレーション: 不要

## 5. 実装 Phase
- Phase 1: establishGuestSession + test / Phase 2: hook + AuthControl / Phase 3: AppShell prop + main 配線

## 7. ロールアウト
| ステップ | 検証 |
|---|---|
| no-key 出荷 (UI + bootstrap ロジック) | 136 tests green + build、AppShell テスト不変 |
| release: 実 Clerk キーで guest→authed→連携→signout 動作確認 + aged guest smoke | 実機/E2E |

## 9. DoD
- [x] establishGuestSession + 2 tests / [x] AuthControl (両輪) / [x] AppShell Clerk 非依存維持 / [ ] 実キー描画 (release)

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:revise |
