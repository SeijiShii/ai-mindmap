# プロダクトドキュメントマップ (ai-mindmap)

**最終更新**: 2026-06-19
**最新コマンド**: /flow:concept (D20260619_001_concept_initial)
**統計**: 機能フォルダ 9 / 横断フォルダ 7 / 改修件数 0 / バグ修正件数 0 / クレーム判定件数 0 / Open 論点 4 件

> **このファイルは AI 用エントリポイント**。目的別に「どこから読めばいいか」「次に何を Read すべきか」を示す。

<!-- auto-generated-start -->

## 0. AI 用クイックアクセス（目的別）

| 目的 | 最初に Read | 次に Read | 注記 |
|---|---|---|---|
| プロダクト全体を理解する | `./concept.md` (§1, §1.3, §4.2) | `./INDEX.md` | 5 分で全体像 |
| 次に何をすべきか判断する | `./SCENARIO.md` (§5 カーソル) | `./AI_LOG/INDEX.md` | `/flow:auto` 起動 |
| コア差別化を理解する | `./concept.md` §1（差別化）+ `./ai-structuring/README.md` | §8 論点-002 | 逐次マージが核心 |
| 特定機能を理解する | `./<feature>/README.md` | `./<feature>/INDEX.md` | feature 一覧は §2 |
| 設計判断の経緯を辿る | `./AI_LOG/INDEX.md` | 該当セッションファイル | depends_on でトレース |
| 未決論点を見る | `./concept.md §8` | `./AI_LOG/INDEX.md` Open 論点 | 4 件 |
| 実装前準備を確認 | `./PREREQUISITES.md` | — | API キー / 法務 |
| 法務書類対応状況 | `./concept.md §9` | — | 公開 + 有償 |

## 1. プロダクト全体
- **概念設計 (SoT)**: [./concept.md](./concept.md)
  - 一行で言うと: AI と人が往復で育てる共同編集型マインドマップ（聞きながらツリーが育つ）
  - 現フェーズ: 企画
  - 最終更新: 2026-06-19
- **プロジェクト INDEX (フラット一覧)**: [./INDEX.md](./INDEX.md)
- **実装前準備**: [./PREREQUISITES.md](./PREREQUISITES.md)
- **見積もり**: [./estimates/](./estimates/)（未生成）

## 2. 機能フォルダ（業務ドメイン）
| 優先度 | 基盤 | フォルダ | 状態 | INDEX |
|---|---|---|---|---|
| 3 | ❌ | live-capture | 計画中 | [INDEX](./live-capture/INDEX.md) |
| 3 | ❌ | mindmap-canvas | 計画中 | [INDEX](./mindmap-canvas/INDEX.md) |
| 3 | ❌ | map-management | 計画中 | [INDEX](./map-management/INDEX.md) |
| 4 | ❌ | ai-structuring | 計画中 | [INDEX](./ai-structuring/INDEX.md) |
| 4 | ❌ | ai-expand | 計画中 | [INDEX](./ai-expand/INDEX.md) |
| 4 | ❌ | export | 計画中 | [INDEX](./export/INDEX.md) |
| 4 | ❌ | billing | 計画中 | [INDEX](./billing/INDEX.md) |
| 4 | ❌ | feedback | 計画中 | [INDEX](./feedback/INDEX.md) |
| 4 | ❌ | legal | 計画中 | [INDEX](./legal/INDEX.md) |

## 3. 横断フォルダ（_shared/*）
| 優先度 | フォルダ | 状態 | INDEX |
|---|---|---|---|
| 1 | _shared/db | 計画中 | [INDEX](./_shared/db/INDEX.md) |
| 1 | _shared/types | 計画中 | [INDEX](./_shared/types/INDEX.md) |
| 1 | _shared/ui | 計画中 | [INDEX](./_shared/ui/INDEX.md) |
| 2 | _shared/auth | 計画中 | [INDEX](./_shared/auth/INDEX.md) |
| 2 | _shared/ai-client | 計画中 | [INDEX](./_shared/ai-client/INDEX.md) |
| 2 | _shared/cost-tracking | 計画中 | [INDEX](./_shared/cost-tracking/INDEX.md) |
| 5 | _shared/app-shell | 計画中 | [INDEX](./_shared/app-shell/INDEX.md) |

## 4. 設計判断の経緯
- **AI_LOG インデックス**: [./AI_LOG/INDEX.md](./AI_LOG/INDEX.md)
- **最新セッション**: D20260619_001_concept_initial（完了、9 decision）
- **Open 論点**: 4 件（concept §8 と同期）
- **Superseded chain**: 0 件

## 5. 観点・選好データ（PJ 外部参照）
- **観点 SoT**: `~/.claude/flow-data/perspectives.md`
- **開発者選好**: `~/.claude/flow-data/preferences.md`（学習元 10 PJ、強い選好: 標準 Neon スタック）

## 6. ファイル種別ガイド（番号体系）
| 種別 | 番号 / パターン | パス例 | 生成元 |
|---|---|---|---|
| 機能 SPEC | `001_*_SPEC.md` | `./<feature>/001_<feature>_SPEC.md` | `/flow:feature` |
| 機能 PLAN | `002_*_PLAN.md` | `./<feature>/002_<feature>_PLAN.md` | `/flow:feature` |
| 単体テスト計画 | `003_*_UNIT_TEST.md` | 同上 | `/flow:feature` |
| E2E テスト計画 | `004_*_E2E_TEST.md` | 同上 | `/flow:feature` |
| 実装レポート | `101_*_IMPL_REPORT.md` | 同上 | `/flow:tdd` |
| AI_LOG セッション | `D<date>_<sess>_<cmd>_<target>.md` | `./AI_LOG/D20260619_001_concept_initial.md` | 各 flow コマンド |

## 7. 依存・優先度グラフ（concept §1.3.4 から導出）
```
_shared/db (優先度 1, 基盤 ✅)
_shared/types (優先度 1, 基盤 ✅)
_shared/ui (優先度 1, 基盤 ✅)
_shared/auth (優先度 2, 基盤 ✅) ← db
_shared/ai-client (優先度 2, 基盤 ✅) ← types
_shared/cost-tracking (優先度 2, 基盤 ✅) ← db
live-capture (優先度 3) ← ui
mindmap-canvas (優先度 3) ← ui, types
map-management (優先度 3) ← db, auth
ai-structuring (優先度 4) ← ai-client, types, cost-tracking
ai-expand (優先度 4) ← ai-client, types, cost-tracking
export (優先度 4) ← types
billing (優先度 4) ← db, auth, cost-tracking
feedback (優先度 4) ← ui
legal (優先度 4) ← ui
_shared/app-shell (優先度 5, 合成) ← 全 feature + 全 _shared
```
循環依存: なし

## 8. コマンド使い分けガイド
| やりたいこと | コマンド | 入力 | 主要出力 |
|---|---|---|---|
| 新規 PJ の概念設計 | `/flow:concept` | wants ファイル | `./concept.md` + 各 INDEX |
| 全体見積もり | `/flow:estimate` | concept.md | estimate ファイル |
| デザインシステム | `/flow:design` | concept.md | design/design-system.md |
| 新規機能を設計 | `/flow:feature <feature>` | concept + README | 001〜004 |
| TDD 実装 | `/flow:tdd` | 設計 4 文書 | 101 IMPL_REPORT |
| next-step 自動実行 | `/flow:auto` | SCENARIO + AI_LOG | 各コマンド連鎖 |

## 9. 履歴サマリ
- **改修件数 (累計)**: 0 件
- **バグ修正件数 (累計)**: 0 件
- **クレーム判定件数 (累計)**: 0 件

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
