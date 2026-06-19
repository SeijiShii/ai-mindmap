# _shared/app-shell 実装計画書

> **入力**: `./001__shared_app-shell_SPEC.md`, 全 feature PLAN
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `index.html` | エントリ + head（favicon/manifest/OGP） | — | 30 |
| `src/main.tsx` | React 起動 | — | 20 |
| `src/App.tsx` | router + providers（Clerk/Query/テーマ）+ レイアウト | 全 feature, _shared | 120 |
| `src/routes.tsx` | ルート定義（O55 導線含む） | — | 60 |
| `src/AppShell.tsx` | AppHeader + フッタ(legal 導線) + FeedbackWidget 常設 | _shared/ui, feedback, legal | 90 |
| `scripts/dev.sh` / `scripts/stop.sh` | 統合 launcher + smoke（O36） | — | 80 |
| `.github/workflows/ci.yml` | lint/typecheck/unit/e2e/audit（O37） | — | 60 |
| `.github/dependabot.yml` | weekly + security（O37） | — | 15 |
| `scripts/gen-favicon.js` | ブランドマーク派生生成（O56） | sharp/to-ico | 50 |
| `vercel.json` / `tsconfig` / `package.json` | scaffold | — | — |
| `.env.example` | 全 env 変数（実値なし） | — | — |

## 2. 実装 Phase 分割
### Phase 1: scaffold（package.json/vite/ts/tailwind/vercel）+ index.html/main
- テスト: ビルド成功
### Phase 2: App + routes + AppShell（features 配線）
- テスト: ルーティング、O55 導線、ゲストセッション → authed
### Phase 3: API ルートハンドラ層束ね（全 api/* を requireOwner で公開）
- テスト: 匿名→authed で全保護 API 200（P4.46 統合）

### Phase 3.5: app/api bootstrap（O36/O37/O56 統合）
- scripts/dev.sh + CI yaml + dependabot + gen-favicon + .env.example
- 完了条件: `bash scripts/dev.sh` で全 service 起動 + smoke green、PR で CI green

## 3. 依存関係順序
```
scaffold → main → App/routes/AppShell → API 束ね → dev.sh/CI/favicon
```
（全 feature + 全 _shared が先に設計・実装済み前提）

## 4. 既存ファイルへの影響
全 feature を統合（合成）

## 5. 横断への変更
全 _shared を配線。

## 6. リスク
- **O57 合成漏れ防止**: 全 feature が画面/ API に接続されているか（孤立部品を残さない）
- **P4.46**: ゲスト実セッションで全 API が通る統合検証必須
- ローカル toolchain（npm install）が必要 = 実装フェーズの前提

## 7. DoD（MVP）
- [ ] `bash scripts/dev.sh` で全 service 起動 + smoke green（O36）
- [ ] PR で CI green（O37）
- [ ] 匿名→authed で全保護 API 200（P4.46）
- [ ] 全画面が router に接続（O55、孤立なし）
- [ ] E2E（004 統合スモーク）green
- [ ] 視覚レビュー Design gate（全画面）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
