# _shared/ui 単体テスト計画

> **入力**: `./001__shared_ui_SPEC.md`, `./002__shared_ui_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | Button variant=primary | primary トークンクラス適用、role=button |
| N2 | Chip kind=relation | EdgeKind 色分けチップ表示 |
| N3 | Input error | aria-invalid + エラーテキスト |
| N4 | InfoButton click | モーダル open（O41 文言表示） |
| N5 | StageSpinner stageLabel | 段階文言レンダリング（O45） |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | Button disabled | クリック無効 |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | AppHeader 長いタイトル | 360px 幅 | ellipsis 省略・縦折れしない（jsdom では class 確認、視覚は Design gate） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| DOM | @testing-library/react + jsdom |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
shadcn/ui, tailwind, lucide

## 5. テスト実行環境
Vitest + @testing-library/react（jsdom）、並列 ✅

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
