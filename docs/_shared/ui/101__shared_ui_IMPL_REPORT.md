# 実装レポート: _shared/ui

## 実装日時
2026-06-19 (JST)

## モード
feature (cross-cutting)

## 関連ドキュメント
- 001/002/003 + [AI_LOG](../AI_LOG/D20260619_025_tdd__shared_ui.md)

## 変更一覧
### Phase 1: トークン + テーマ
- `src/styles/tokens.css` — design-system §2-4 の CSS 変数（生値はここのみ、原則#3）
- `tailwind.config.ts` — semantic トークン → CSS var マッピング
- frontend toolchain 追加（react/react-dom/vite/@vitejs/plugin-react/tailwind/@testing-library/jsdom）+ vitest jsdom 化
### Phase 2-3: コンポーネント
- `Button` / `Chip`(EdgeKind 色分け) / `AppHeader`(モバイル横一列, CF-20260609-007) / `InfoButton`(O41) / `StageSpinner`(O45)

## 実装計画からの差分
| 項目 | 内容 |
|---|---|
| 設計通り | トークン経由（生値直書きなし）。絵文字不使用 |
| deferred | 視覚レビュー（Design gate b）は画面実装後。ブランドマーク生成は app-shell で（O56） |

## PR Description
### タイトル
_shared/ui: デザイントークン + 基本コンポーネント
### 変更内容
- CSS 変数トークン + Tailwind theme + Button/Chip/AppHeader/InfoButton/StageSpinner
### テスト
- 6/6 パス（jsdom + @testing-library）、typecheck clean（累計 48/48）
