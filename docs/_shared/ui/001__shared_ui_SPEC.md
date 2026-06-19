# _shared/ui 共通 UI 仕様書

> **役割**: design-system トークンを実装に落とす基盤（テーマ + 基本コンポーネント + アイコン/イラスト + ブランドマーク）。
> **タグ**: cross-cutting
> **最終更新**: 2026-06-19
> **入力**: `../../concept.md`, `../../design/design-system.md`

---

## 1. 提供インターフェース
- デザイントークン（CSS 変数 + Tailwind theme 拡張、design-system.md §2-4 由来）
- 基本コンポーネント（Button / Card / Chip / Input / Panel / AppHeader / InfoButton / Spinner-with-stage）
- アイコン（lucide）+ 自作 SVG イラスト（EmptyState / Hero / line-art）
- ブランドマーク deliverable（favicon 一式 + manifest icons、O56）

## 2. 入出力
| コンポーネント | props 概要 |
|---|---|
| Button | variant(primary/secondary/ghost/danger), size, disabled |
| Card / Panel | children, elevation |
| Chip | kind(EdgeKind 色分け), label |
| Input | value, onChange, error, placeholder |
| AppHeader | title, actions[]（モバイル横一列標準形、nowrap+ellipsis） |
| InfoButton | onClick → 軽量モーダル（「これは何？」O41） |
| StageSpinner | stageLabel（進捗体験 O45、ブランド文言） |

## 3. データモデル
なし（presentation のみ、状態は呼び出し側）

## 4. バリデーション / トークン規律
- 生値（hex/px）の直書き禁止 → トークン経由（design-system 原則#3、視覚レビュー #2.6 token-conformance）
- 絵文字を UI アイコンに使わない（lucide / 自作 SVG）

## 5. NFR + 連携
- 連携: design-system.md（SoT）/ 全 feature（UI 消費）
- a11y: role/label を保つ（テストは role/text ベース）
- モバイル: AppHeader は狭幅 360px で縦折れしない（CF-20260609-007）

## 6. タグ別
（cross-cutting、UI 提供基盤）

## 7. スコープ外
- 各画面固有のレイアウト（feature 側）

## 8. 未決事項
現時点で論点なし (2026-06-19)

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
