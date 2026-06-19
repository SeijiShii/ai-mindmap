# _shared/ui 実装計画書

> **入力**: `./001__shared_ui_SPEC.md`, `../../design/design-system.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/styles/tokens.css` | CSS 変数（color/radius/shadow/spacing、design-system §2-4） | — | 60 |
| `tailwind.config.ts` | theme 拡張（トークン参照） | tailwindcss | 50 |
| `src/components/ui/{Button,Card,Chip,Input,Panel}.tsx` | 基本コンポーネント（shadcn ベース） | tokens | 220 |
| `src/components/ui/AppHeader.tsx` | モバイル横一列ヘッダー（nowrap+ellipsis+overflow） | — | 60 |
| `src/components/ui/InfoButton.tsx` | 「これは何？」モーダル（O41） | — | 50 |
| `src/components/ui/StageSpinner.tsx` | 進捗体験スピナー（O45） | — | 40 |
| `src/components/illustrations/{EmptyState,Hero}.tsx` | 自作 SVG line-art（currentColor 追従） | — | 80 |

## 2. 実装 Phase 分割
### Phase 1: トークン + テーマ
- tokens.css + tailwind.config。テスト: トークン値の存在/型
### Phase 2: 基本コンポーネント
- Button/Card/Chip/Input/Panel。テスト: variant レンダリング、role/label
### Phase 3: AppHeader + InfoButton + StageSpinner + イラスト
- テスト: 狭幅で nowrap、InfoButton 開閉

### Phase 3.5: app/api bootstrap
（UI 基盤だが app-shell が合成。本フォルダは scaffold 不要、app-shell 側で wiring）

## 3. 依存関係順序
```
tokens.css → tailwind.config → 基本コンポーネント → 複合(AppHeader/InfoButton) → イラスト
```

## 4. 既存ファイルへの影響
なし（初期）

## 5. 横断への変更
design-system トークンの実体化。ブランドマークは `/flow:design` フル適用時 or app-shell で生成（gen-favicon）。

## 6. リスク
- design-system 更新時にトークン追随（CSS 変数集中で一括変更可）

## 7. DoD
- [ ] Phase 1-3 完了、コンポーネントテスト green、カバレッジ達成
- [ ] 視覚レビューは画面実装後に /flow:design（Design gate b）
- [ ] E2E スキップ（cross-cutting）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
