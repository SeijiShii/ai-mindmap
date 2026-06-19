# AIと一緒に描くマインドマップ 開発シナリオ

**最終更新**: 2026-06-19
**生成元**: /flow:concept (初回) / /flow:scenario (更新)
**シナリオ種別**: 新規 MVP 立ち上げ（個人開発マイクロサービス、UI あり）

> 本ファイルは AI が「次に何をすべきか」を判断する際の参照ドキュメント。
> `/flow:auto` および引数空起動された各 flow コマンドが本ファイルを Read する。
> §5 現在地カーソルは flow コマンドが auto-generated 範囲で書き換える。

---

## 1. ゴール
AI と人が往復で育てる共同編集型マインドマップの MVP を、無料枠厳守 + PWYW（AI 従量）で立ち上げる。コア差別化は「聞きながら/書きながら、AI 逐次マージでツリーが育つ」体験。

## 2. 進行フェーズ
1. **Phase 1: 概念設計** — concept.md + SCENARIO.md 確定 ✅
2. **Phase 1.5: デザインシステム** — concept から design SoT を導出 + スタイル基盤適用（`/flow:design`、穏やか・ミニマル方向）
3. **Phase 2: 機能設計** — concept §1.3 優先度順に SPEC〜E2E_TEST 生成（基盤 → コア → 機能）
4. **Phase 3: 実装** — TDD で各機能を実装 + 画面実装後の視覚デザインレビュー
5. **Phase 4: 公開準備** — audit + secure(deps) + 法務書類 + PR
6. **Phase 5: 公開後運用** — feedback / claim / fix / revise の循環

## 3. 各フェーズで使う flow コマンド + 完了ゲート

### Phase 1: 概念設計
- 主: `/flow:concept`（完了）
- セキュア: `/flow:secure --phase=design --scope=concept`
- 見積: `/flow:estimate`（初回フェルミ推定）
- 完了ゲート: concept.md 全節埋まり / secure Critical・High closed / 初回見積生成

### Phase 1.5: デザインシステム
- 主: `/flow:design`
- 完了ゲート: design-system.md 生成 + トークンがスタイル基盤に反映

### Phase 2: 機能設計
- 主: `/flow:feature <target>`（優先度順: _shared/db・types・ui → auth・ai-client・cost-tracking → live-capture・mindmap-canvas・map-management → ai-structuring・ai-expand・export・billing・feedback・legal → _shared/app-shell）
- 完了ゲート: 全機能 001〜004 生成 / Critical・High 解決 / 再キャリブレ見積

### Phase 3: 実装
- 主: `/flow:tdd`
- 完了ゲート: 全機能 101 IMPL_REPORT + テスト通過 + コミット

### Phase 4: 公開準備
- 主: `/flow:audit` + `/flow:secure --phase=deps` + `/flow:release`
- 完了ゲート: 実キー FILL → ローカルスマホ動作確認 → デプロイ

### Phase 5: 公開後運用（循環）
- feedback → `/flow:claim` → `/flow:fix` or `/flow:revise` → `/flow:tdd` → PR

## 4. 分岐ルール
| イベント | 切替先 | 戻り先 |
|---|---|---|
| Critical/High SEC finding | `/flow:revise` or `/flow:fix` | 元 Phase |
| クレーム受領 | `/flow:claim` | 判定先 |
| 論点-002（マージ UX）が実装で詰まる | 設計に戻して再検討 | ai-structuring |

## 5. 現在地カーソル

<!-- AUTO-GENERATED:BEGIN scenario-cursor -->
- 現在フェーズ: Phase 3 (実装) ほぼ完了 → Phase 4 (公開準備) へ
- 進行中ターゲット: 全 17 対象 実装済（logic/composition/screens, 112 tests green, vite build 成功, deps Critical/High 0）
- 最終更新セッション: D20260619_034_secure_deps
- 最終更新時刻: 2026-06-19
- 完了フェーズ: [Phase 1 概念, Phase 1.5 デザインSoT, Phase 2 設計, Phase 3 実装(no-keyスコープ)]
- 次の推奨コマンド: /flow:release（実 API キー FILL → ローカル実機確認 → デプロイ）+ /flow:wording（UI 文言の声を仕上げ）。視覚レビュー(/flow:design --review-only)と E2E(/flow:e2e)は実 Clerk キーでアプリ起動後
- 残（要・実キー/人間）: 実キー(OpenAI/Clerk/Neon/Stripe) / 視覚デザインレビュー / E2E / wording / 課金 live 化
<!-- AUTO-GENERATED:END scenario-cursor -->

## 6. 変更履歴
- 2026-06-19: /flow:concept で初回生成
