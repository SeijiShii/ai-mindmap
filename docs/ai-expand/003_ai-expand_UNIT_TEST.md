# ai-expand 単体テスト計画

> **入力**: `./001_ai-expand_SPEC.md`, `./002_ai-expand_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | context-builder | ノード+周辺の要約生成 |
| N2 | /api/expand | 4 種 kind の suggested 追加 |
| N3 | gaps モード | 不足観点候補を返す |
| N4 | usage 記録 | recordUsage 呼び出し |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | 枠枯渇 | 402 案内 |
| E2 | parse 失敗 | フォールバック（提案なし） |
| E3 | 他人マップ | 403（SEC-001） |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | ルートノード expand | 周辺なし | 成功（文脈最小） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| ai-client | mock（ExpandResult 固定） |
| cost-tracking | mock + spy |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
_shared/ai-client, _shared/cost-tracking, map-management

## 5. テスト実行環境
Vitest、並列 ✅

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
