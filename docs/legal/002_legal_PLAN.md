# legal 実装計画書

> **入力**: `./001_legal_SPEC.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/features/legal/pages/{Privacy,Terms,Sct}.tsx` | 法務ページ（Markdown/JSX） | _shared/ui | 120 |
| `src/features/legal/ConsentBanner.tsx` | 初回 consent opt-in | _shared/ui | 60 |
| `src/features/legal/DeleteAccountPanel.tsx` | データ削除セルフサービス UI（二段階確認） | _shared/ui | 70 |
| `api/account/delete.ts` | owner の全データ削除（withOwner cascade） | _shared/db, auth | 60 |
| `content/legal/*.md` | 法務文面ドラフト（テンプレ + ゲスト特例文言） | — | — |

## 2. 実装 Phase 分割
### Phase 1: api/account/delete（全データ削除、withOwner）
- テスト: owner の全データ削除、他人データ不可（SEC-001）
### Phase 2: 法務ページ + ConsentBanner
- テスト: ルート到達性（O55、フッタ導線）
### Phase 3: DeleteAccountPanel（二段階確認）

## 3. 依存関係順序
```
api/account/delete → 法務ページ/ConsentBanner → DeleteAccountPanel
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
_shared/db 全データ削除。フッタ導線（app-shell ナビ）。

## 6. リスク
- **O54 ゲスト特例**: 文面で「窓口削除を約束しない / アプリ内セルフサービスで完結」を正直に明記
- 削除は不可逆 → 二段階確認 + 取り消し不可明示

## 7. DoD
- [ ] Phase 1-3 完了、削除/隔離/到達性 テスト green
- [ ] 法務文面ドラフト作成（公開前に本人確認）
- [ ] E2E（004）green
- [ ] 視覚レビュー Design gate（O55 導線）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
