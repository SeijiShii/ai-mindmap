# mindmap-canvas 機能仕様書

> **役割**: React Flow キャンバス。ノード/エッジの手編集（追加・削除・並べ替え・つなぎ直し）+ AI 提案の視覚区別 + 承認/却下。
> **タグ**: feature
> **最終更新**: 2026-06-19
> **入力**: `../concept.md` §1.1 UC3, `../design/design-system.md`, `../_shared/types/`

---

## 1. 詳細 UC

### UC3: 手編集（concept §1.1 #3）
- **トリガー**: キャンバス操作
- **操作**: ノード追加 / テキスト編集 / 削除 / ドラッグ移動 / エッジつなぎ直し / 親変更
- **出力**: nodes/edges 更新（楽観更新 + 永続化、map-management 経由）

### UC: AI 提案の承認/却下
- **トリガー**: ai-structuring/ai-expand が status=suggested ノードを追加
- **表示**: ティール点線（人ノードと視覚区別、design-system）
- **操作**: 承認 → status=confirmed（実線化）/ 却下 → 削除
- **ライブ**: 自動追加 + 取り消し可（論点-002 ハイブリッド）

## 2. 入出力
### 2.1 画面操作 → 永続化
| 操作 | 副作用 |
|---|---|
| ノード追加/編集/削除 | nodes upsert/delete（map-management） |
| エッジ追加/つなぎ直し | edges upsert |
| ドラッグ移動 | nodes.pos_x/y 更新（デバウンス保存） |
| 承認/却下 | nodes.status 更新 / 削除 |

### 2.2 副作用
- _shared/db（map-management 経由）

## 3. データモデル
nodes/edges（_shared/db）を描画・編集。新規エンティティなし。

## 4. バリデーション + エラー
| 条件 | 振る舞い |
|---|---|
| ノードテキスト描画 | XSS sanitize（SEC-002、生 HTML 注入禁止） |
| 循環エッジ（つなぎ直し） | ツリー整合チェック（parent 循環防止） |
| 保存失敗 | 楽観更新ロールバック + 再試行案内 |
| 他人マップ | withOwner で 403（SEC-001） |

## 5. NFR + 連携
### 5.1 NFR
- 数百ノードでスムーズ（React Flow 仮想化、concept §3 キャンバス性能）
- ドラッグ移動はデバウンス保存（過書き込み回避）
- ライブ更新中の手編集と AI 追加の競合解決（論点-002）
### 5.2 連携
| 連携先 | 依存 |
|---|---|
| map-management | nodes/edges CRUD |
| ai-structuring/ai-expand | suggested ノードの受領・承認 |
| _shared/ui | トークン/コンポーネント |

## 6. タグ別
（feature、リアルタイム反映は live-capture/ai-structuring と協調）

## 7. スコープ外
- 多人数同時編集（非対象）
- 自動レイアウトの高度アルゴリズム（MVP は基本ツリーレイアウト）

## 8. 未決事項
### [論点-001]（= concept §8 論点-002）ライブマージ時の競合解決
- **影響範囲**: 手編集中の AI 自動追加
- **問い**: last-write-wins / 追加のみ（人編集を壊さない）/ ハイライト承認 のどれか
- **推奨**: 「AI は追加のみ + ライブ時はゆっくり自動追加 + 取り消し可」。理由: 主導権は人間（提供価値）、人の手編集を壊さない
- **判断期限**: ai-structuring 実装と連動
- **担当**: 本人

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
