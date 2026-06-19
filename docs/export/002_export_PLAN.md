# export 実装計画書

> **入力**: `./001_export_SPEC.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/features/export/to-markdown.ts` | MapGraph → Markdown 入れ子 + エスケープ | types | 80 |
| `src/features/export/to-outline.ts` | MapGraph → アウトライン | types | 50 |
| `src/features/export/to-image.ts` | キャンバス → PNG/SVG（React Flow toImage） | reactflow | 60 |
| `src/features/export/ExportMenu.tsx` | 形式選択 + ダウンロード | _shared/ui | 70 |

## 2. 実装 Phase 分割
### Phase 1: to-markdown / to-outline（純変換 + エスケープ）
- テスト: 入れ子構造、injection エスケープ（SEC-002）
### Phase 2: to-image
- テスト: 画像生成（mock canvas）
### Phase 3: ExportMenu 配線

## 3. 依存関係順序
```
to-markdown / to-outline → to-image → ExportMenu
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
なし（map-management graph 消費）

## 6. リスク
- 画像生成のブラウザ差（toImage の対応）→ フォールバック（SVG）

## 7. DoD
- [ ] Phase 1-3 完了、変換/エスケープ テスト green
- [ ] E2E（004）green
- [ ] 視覚レビュー Design gate（ExportMenu）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
