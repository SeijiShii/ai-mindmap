# mindmap-canvas 単体テスト計画

> **入力**: `./001_mindmap-canvas_SPEC.md`, `./002_mindmap-canvas_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | edit-actions 追加 | ノード追加 + 楽観更新 |
| N2 | つなぎ直し | エッジ source/target 更新 |
| N3 | suggestion 承認 | status confirmed（実線化） |
| N4 | suggestion 却下 | ノード削除 |
| N5 | MindNode 人/AI | source に応じ実線/点線クラス |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | 循環つなぎ直し | tree-guard が弾く |
| E2 | XSS テキスト | sanitize で無害化（SEC-002） |
| E3 | 保存失敗 | 楽観更新ロールバック |
| E4 | 人編集中の AI 追加 | 人の変更を壊さず追加のみ（論点-001） |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | ルートノード削除 | 子あり | 子も cascade（確認） |
| B2 | 多数ノード | 数百 | レンダリング破綻なし（性能は別途） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| React Flow | @testing-library + reactflow test utils |
| map-management | spy/mock |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
reactflow, _shared/ui, _shared/types, map-management

## 5. テスト実行環境
Vitest + @testing-library/react（jsdom）

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
