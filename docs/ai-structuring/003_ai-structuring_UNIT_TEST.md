# ai-structuring 単体テスト計画

> **入力**: `./001_ai-structuring_SPEC.md`, `./002_ai-structuring_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | tree-summary | 既存ツリーが簡潔要約に（トークン削減） |
| N2 | merge 追加のみ | suggested ノード追加、既存を書き換えない |
| N3 | 重複抑制 | 近似ノードはスキップ/上限内 |
| N4 | /api/structure | quota OK → ai-client 呼び出し → 追加 + usage 記録 |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | prompt injection delta | 構造化出力のみ、指示無視（SEC-002） |
| E2 | parse 失敗 | リトライ → フォールバック（追加なし） |
| E3 | quota 枯渇 | 402 案内、追加しない |
| E4 | 人編集中の追加 | 既存ノードを壊さない（論点-002） |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | 空 delta | 空 | API 叩かず no-op |
| B2 | 巨大ツリー | 数百ノード | 要約で送信サイズ制御 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| ai-client | mock（固定 StructureResult / injection / parse 失敗） |
| cost-tracking | mock（quota 切替）+ spy（usage） |
| map-management | spy |

## 3. カバレッジ目標
行 80% / 分岐 70%（コアゆえ重点的に）

## 4. 既存ユーティリティ依存
_shared/ai-client, _shared/cost-tracking, map-management, _shared/types

## 5. テスト実行環境
Vitest、並列 ✅

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
