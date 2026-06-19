# AI_LOG インデックス — ai-mindmap

**最終更新**: 2026-06-19
**総セッション数**: 3
**総 decision 数**: 17

> このフォルダは AI 主導の自走 / 後追いトレースを目的とする詳細ログ。
> セッションごとに 1 ファイル、append-only、過去ファイルは削除・編集禁止。
> 人間向けサマリは `../concept.md` §7 決定事項ログ を参照。

<!-- auto-generated-start -->

## セッション一覧（新しい順）

| ファイル | 実行日 | コマンド | 対象 | decision 範囲 | 状態 |
|---|---|---|---|---|---|
| [D20260619_003_estimate_initial.md](./D20260619_003_estimate_initial.md) | 2026-06-19 | /flow:estimate | initial | D20260619-016〜017 | 完了 |
| [D20260619_002_secure_concept.md](./D20260619_002_secure_concept.md) | 2026-06-19 | /flow:secure | concept | D20260619-010〜015 | 完了 |
| [D20260619_001_concept_initial.md](./D20260619_001_concept_initial.md) | 2026-06-19 | /flow:concept | initial | D20260619-001〜009 | 完了 |

## decision_id 索引（grep 用、新しい順）

| ID | command | phase | chosen (短縮) | type | ファイル |
|---|---|---|---|---|---|
| D20260619-009 | /flow:concept | Q12.12 デザイン | 穏やか・ミニマル下案 | auto-recommended | D20260619_001_concept_initial.md |
| D20260619-008 | /flow:concept | Step 3 論点 | 論点 4 件登録 | open | D20260619_001_concept_initial.md |
| D20260619-007 | /flow:concept | Step 1.7 preferences | 10 PJ 強い選好採用 | auto-recommended | D20260619_001_concept_initial.md |
| D20260619-006 | /flow:concept | Step 3 スコープ | 多人数同期 非対象 | auto-recommended | D20260619_001_concept_initial.md |
| D20260619-005 | /flow:concept | Step 2 スタック | 標準 Neon スタック | auto-recommended | D20260619_001_concept_initial.md |
| D20260619-004 | /flow:concept | Step 2 AI | gpt-4o-mini 単一 | auto-recommended | D20260619_001_concept_initial.md |
| D20260619-003 | /flow:concept | Step 2 文字起こし | Web Speech API + 手動 | auto-recommended | D20260619_001_concept_initial.md |
| D20260619-002 | /flow:concept | 設計指針 | 聞きながら育つ + メモ追加 | explicit-choice | D20260619_001_concept_initial.md |
| D20260619-001 | /flow:concept | Step 2 入力 | テキスト + ライブ文字起こし | explicit-choice | D20260619_001_concept_initial.md |

## Open 論点（chosen_type=open、全期間横断）

| ID | 論点タイトル | 採番セッション | 関連 decision |
|---|---|---|---|
| 論点-001 | AI 無料枠トークン量 + PWYW 追加枠設計 | D20260619_001 | D20260619-008 |
| 論点-002 | ライブ逐次マージの矛盾なしマージ UX/AI 設計 | D20260619_001 | D20260619-008 |
| 論点-003 | feedback-hub 構築状況 | D20260619_001 | D20260619-008 |
| 論点-004 | ブランド名 | D20260619_001 | D20260619-008 |

## Superseded chain（旧 Open → 新解決）

| 旧 ID | 新 ID | 解決日 | 解決セッション |
|---|---|---|---|
| (なし) | | | |

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
