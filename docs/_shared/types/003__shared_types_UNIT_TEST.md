# _shared/types 単体テスト計画

> **入力**: `./001__shared_types_SPEC.md`, `./002__shared_types_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 入力 | 期待 |
|---|---|---|---|
| N1 | StructureResult Zod | 正しい suggestions JSON | parse 成功 |
| N2 | CreateMapInput | { title:'x' } / {} | 成功（title 任意） |
| N3 | UpdateNodeInput | { id, posX, posY } | 成功 |
| N4 | ExpandResult | kind 列挙の全値 | parse 成功 |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待 |
|---|---|---|---|
| E1 | StructureResult | suggestions 欠落 / 型不一致 | parse 失敗（AI 出力を弾く、SEC-002） |
| E2 | UpdateNodeInput | status='invalid' | reject |
| E3 | StructureInput | transcriptDelta 非文字列 | reject |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | transcriptDelta | 空文字 | 成功（空は許容、上位で no-op） |
| B2 | suggestions | 空配列 | 成功（追加なし） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| なし（純粋関数 + スキーマ） | mock 不要 |

## 3. カバレッジ目標
行 80% / 分岐 70%（concept 継承）

## 4. 既存ユーティリティ依存
zod

## 5. テスト実行環境
Vitest、並列 ✅

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
