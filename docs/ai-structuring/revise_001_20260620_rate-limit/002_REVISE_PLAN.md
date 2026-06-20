# ai-structuring 変更計画書（AI エンドポイント レート制限）

> **入力**: `./001_REVISE_SPEC.md`, concept §1.4 / §3.X SEC-004
> **最終更新**: 2026-06-20

## 1. 既存ファイル変更一覧
| ファイル | 変更内容 | リスク |
|---|---|---|
| src/app/api-structure.ts | `StructureDeps` に `rateLimited` 追加、auth 後に 429 分岐 | 低 |
| src/app/api-expand.ts | `ExpandDeps` に `rateLimited` 追加、同分岐 | 低 |
| src/app/server-deps.ts | memory limiter を生成し `rateLimited` を提供 | 低 |
| api/structure.ts, api/expand.ts | `rateLimited: deps.rateLimited` を配線 | 低 |

## 2. 新規ファイル一覧
| ファイル | 責務 | LOC |
|---|---|---|
| src/app/rate-limit.ts | RateLimiter interface + createMemoryRateLimiter + makeRateLimited(owner+IP) | ~50 |
| src/app/rate-limit.test.ts | 窓内/窓外/owner/IP/429 ハンドラ統合 | ~60 |

## 3. 削除ファイル一覧
(なし)

## 4. マイグレーション要否
- DB スキーマ変更: ❌ / 既存データ変換: ❌ → MIGRATION 不要

## 5. 実装 Phase 分割
### Phase 1 (RED→GREEN→IMPROVE)
- rate-limit.ts のスライディングウィンドウ + owner/IP 合成。テスト先行
### Phase 2
- 両ハンドラに 429 分岐配線 + 統合テスト + api/ 配線

## 6. 依存関係順序
rate-limit.ts → handlers → server-deps → api/ 配線

## 7. ロールアウト計画
| ステップ | 内容 | 検証 |
|---|---|---|
| 1 | in-memory limiter 出荷 | unit + handler 統合テスト green |
| 2 | release 時に実ストア(Upstash)を env で差し替え（任意） | 実機スモーク |

## 9. DoD
- [ ] rate-limit unit green / [ ] 両ハンドラ 429 統合 green / [ ] 既存 112 tests 維持 / [ ] api/ 配線

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-20 | 初版作成 | /flow:revise |
