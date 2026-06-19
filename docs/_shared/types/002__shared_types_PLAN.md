# _shared/types 実装計画書

> **入力**: `./001__shared_types_SPEC.md`, `../db/`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/types/domain.ts` | ドメイン型 + 列挙（NodeSource/Status/EdgeKind）+ DB 型 re-export | _shared/db schema | 80 |
| `src/types/ai-contract.ts` | AI 構造化出力型 + Zod スキーマ（Structure/Expand Result） | zod | 60 |
| `src/types/api.ts` | API 入力 Zod スキーマ（CreateMap/UpdateNode/Structure/Expand Input） | zod | 60 |
| `src/types/index.ts` | re-export | — | 10 |

## 2. 実装 Phase 分割
### Phase 1: domain + ai-contract + api スキーマ
- テスト: Zod スキーマの parse 成功/失敗、型の構造一致
- ゴール: 全型 export + Zod 検証 green

## 3. 依存関係順序
```
_shared/db schema → domain.ts → (ai-contract.ts, api.ts) → index.ts
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
_shared/db の型を消費（再定義しない）

## 6. リスク
- DB スキーマ変更時に型が追随する設計（`$inferSelect` 利用で自動追随）

## 7. DoD
- [ ] 全型 + Zod export、parse テスト green、カバレッジ達成
- [ ] E2E スキップ（cross-cutting、消費側 feature でカバー）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
