# ai-expand 機能仕様書

> **役割**: 選択ノードからの「枝を広げて」深掘り（関連/対立/問い/具体例）+「足りない観点は?」補完。
> **タグ**: feature
> **最終更新**: 2026-06-19
> **入力**: `../concept.md` §1.1 UC4/UC5, `../_shared/ai-client/`

---

## 1. 詳細 UC
### UC4: 枝を広げる（concept §1.1 #4）
- トリガー: ノード選択 →「広げて」
- 入力: 対象ノード + 周辺文脈（親/兄弟の要約）
- 処理: ai-client.callExpand → ExpandResult（kind: relation/opposition/question/example）→ suggested ノードで追加
- 出力: 4 種の枝候補が点線で提案 → 承認/却下
### UC5: 観点補完（concept §1.1 #5）
- トリガー:「足りない観点は?」
- 処理: ツリー全体要約 → 抜けている観点を提案

## 2. 入出力
| 処理 | 入力 | 出力 | 副作用 |
|---|---|---|---|
| /api/expand | ExpandInput{mapId, nodeId} | ExpandResult | suggested 追加, usage_log, consumeQuota |
| /api/expand?mode=gaps | mapId | 観点候補 | 同上 |

## 3. データモデル
nodes（source=ai, status=suggested）+ edges（kind=relation/opposition/question/example）

## 4. バリデーション + エラー
| 条件 | 振る舞い |
|---|---|
| injection / parse 失敗 | ai-client が処理（構造化 + リトライ、SEC-002） |
| 枠枯渇 | 402 案内 |
| 他人マップ | 403（SEC-001） |

## 5. NFR + 連携
- 低頻度（オンデマンド）ゆえ品質重視。応答数秒
- 連携: ai-client（callExpand）/ cost-tracking（quota/usage）/ mindmap-canvas（suggested 表示）/ map-management（永続化）

## 6. タグ別
（feature）

## 7. スコープ外
- 逐次マージ（ai-structuring の責務）

## 8. 未決事項
現時点で論点なし（プロンプト詳細は tdd 時）(2026-06-19)

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
