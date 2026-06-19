# ai-structuring 機能仕様書（コア差別化）

> **役割**: ストリーミングテキスト → 既存ツリーへの逐次マージ。人が手編集したツリーを壊さず、矛盾なく要点ノードを差分追加する。
> **タグ**: feature, realtime
> **最終更新**: 2026-06-19
> **入力**: `../concept.md` §1.1, §8 論点-002, `../_shared/ai-client/`, `../_shared/types/`

---

## 1. 詳細 UC

### UC: 逐次マージ（concept §1.1 #1/#2 のコア）
- **トリガー**: live-capture から delta（文字起こし or 手入力テキスト）
- **前提**: マップ + 既存ツリー（人編集済みの可能性）、AI 枠 OK
- **入力**: transcriptDelta + 既存ツリーの要約（トークン節約のため全文でなく構造要約）
- **処理**:
  1. PII scrub（ai-client）
  2. 既存ツリー要約 + delta を gpt-4o-mini へ（システム/ユーザー分離、SEC-002）
  3. 構造化出力 StructureResult（追加候補ノード + 親参照 + kind）を Zod 検証
  4. **マージ戦略 = 追加のみ**（既存ノードを書き換えない、論点-002）。重複/近似は既存にマージ or スキップ
  5. status=suggested で nodes/edges 追加（mindmap-canvas が点線表示 → 承認で confirmed）
- **出力**: ツリーがゆっくり育つ（suggested ノード追加）
- **例外**: 枠枯渇 → 案内 / parse 失敗 → リトライ → フォールバック（追加なし）

## 2. 入出力
| 処理 | 入力 | 出力 | 副作用 |
|---|---|---|---|
| /api/structure | StructureInput + mapId | StructureResult（追加ノード差分） | nodes/edges insert(suggested), usage_log, consumeQuota |

## 3. データモデル
nodes（source=ai, status=suggested）/ edges（kind 付与）を追加。新規エンティティなし。

## 4. バリデーション + エラー
| 条件 | 振る舞い |
|---|---|
| prompt injection | システム/ユーザー分離 + 構造化出力制約（SEC-002、ai-client） |
| 出力 parse 失敗 | リトライ → フォールバック（追加なし） |
| 枠枯渇 | 402 案内、表示は継続 |
| ノード爆発（情報過多） | 要約/集約戦略で抑制（論点-001） |
| 他人マップ | withOwner 403（SEC-001） |

## 5. 機能固有 NFR + 連携
### 5.1 NFR
- 1 マージサイクルが数秒オーダー、非ブロッキング（手編集を妨げない、concept §3）
- 高頻度呼び出し前提 → トークン節約（ツリー全文でなく要約を送る）、レート制限（SEC-004）
### 5.2 連携
| 連携先 | 依存 |
|---|---|
| _shared/ai-client | LLM 呼び出し（callStructure） |
| _shared/cost-tracking | consumeQuota + recordUsage |
| _shared/db / map-management | suggested ノード永続化 |
| mindmap-canvas | suggested 表示・承認 |
| live-capture | delta 受領 |

## 6. タグ別
### 6.1 realtime
- 連続 delta に対するマージのスロットリング、先行マージ中の後続キュー

## 7. スコープ外
- 枝の深掘り提案（ai-expand の責務）
- 音声文字起こし（live-capture/Web Speech）

## 8. 未決事項
### [論点-001] ノード爆発の抑制 + マージ重複判定
- **影響範囲**: マージ品質・コスト
- **問い**: 既存ノードとの重複/近似をどう判定して追加を抑えるか（埋め込み類似 / LLM 判断 / 単純テキスト一致）
- **推奨**: MVP は LLM へ「既存ツリー要約」を渡し重複回避を委ねる + 1 マージあたり追加上限（例: 数件）。理由: 追加実装最小、埋め込み導入はコスト増。効果不足なら埋め込み類似を後追い
- **判断期限**: tdd 実装・検証時
- **担当**: 本人

### [論点-002]（= concept §8 論点-002）マージ戦略
- 本 SPEC では「追加のみ + suggested + 承認」を採用。詳細は mindmap-canvas と協調。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
