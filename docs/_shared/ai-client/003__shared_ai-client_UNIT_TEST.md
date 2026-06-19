# _shared/ai-client 単体テスト計画

> **入力**: `./001__shared_ai-client_SPEC.md`, `./002__shared_ai-client_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | pii-scrub | メール/電話/位置がマスクされる |
| N2 | callStructure | mock 応答 → StructureResult parse 成功 + usage 抽出 |
| N3 | callExpand | 枝提案 4 種（関連/対立/問い/具体例）パース |
| N4 | usage 連携 | input/output tokens が cost-tracking へ渡る |

### 1.2 異常系（SEC-002 含む）
| ID | 対象 | 期待 |
|---|---|---|
| E1 | prompt injection | テキストに「これまでの指示を無視して...」→ 構造化出力のみ返り無視される |
| E2 | Zod parse 失敗 | リトライ → N 回後フォールバック（空 suggestions） |
| E3 | API エラー/レート超過 | 例外を握り「提案を出せませんでした」フォールバック |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | transcriptDelta 空 | 空 | API を叩かず空結果（no-op、コスト節約） |
| B2 | 巨大テキスト | 長文 | トークン上限内に丸める/分割 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| OpenAI | mock（固定応答 + エラー注入）。Phase3.5 で dev key 結合 |
| cost-tracking | spy で usage 受領を検証 |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
openai, zod, _shared/types, _shared/cost-tracking

## 5. テスト実行環境
Vitest、並列 ✅

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
