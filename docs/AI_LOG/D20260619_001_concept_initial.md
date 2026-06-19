# AI_LOG セッション D20260619_001 — /flow:concept (initial)

**実行日時**: 2026-06-19 17:47 〜 (進行中→完了) (+09:00)
**コマンド**: /flow:concept
**対象**: プロジェクト全体（初版作成）
**実行者**: Claude (Opus 4.8) + seiji
**状態**: 完了
**含まれる decision**: D20260619-001 〜 D20260619-009 (9 件)
**ファイル**: `D20260619_001_concept_initial.md`

---

## 主要決定サマリ

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260619-001 | MVP 入力モダリティ | テキスト + Web Speech ライブ（音声非保存） | explicit-choice |
| D20260619-002 | コア体験 | 聞きながらツリーが逐次育つ + メモ追加 | explicit-choice（設計指針） |
| D20260619-003 | 文字起こし経路 | Web Speech API + 手動テキスト | auto-recommended |
| D20260619-004 | AI プロバイダ | gpt-4o-mini 単一 | auto-recommended |
| D20260619-005 | 技術スタック | 標準 Neon スタック | auto-recommended |
| D20260619-006 | 多人数同期 | 非対象（AI + 1 人） | auto-recommended |
| D20260619-007 | preferences 読込 | 10 PJ 強い選好を推奨バイアスに採用 | auto-recommended |
| D20260619-008 | 論点抽出 | 無料枠設計 / マージ UX / hub / ブランド名 | open |
| D20260619-009 | デザイン方向 | /flow:design に委譲（穏やか・ミニマル下案） | auto-recommended |

## 依存関係

- D20260619-003 → 依存: [D20260619-002]（聞きながら育つ体験から文字起こし経路が必要に）
- D20260619-004 → 依存: [D20260619-003]（高頻度ライブ呼び出し前提でコスト最適プロバイダ選定）
- D20260619-001 → supersede 注記: 初回回答「テキストのみ」は D20260619-002 設計指針で「ライブ文字起こし含む」へ拡張・上書き

外部依存: ~/ideas registry I20260619-025（human-seed 起点）

## 生成・更新したアーティファクト

- 新規: `docs/concept.md` (§1〜§11)
- 新規: `docs/AI_LOG/INDEX.md`, `docs/INDEX.md`, `docs/DOC_MAP.md`, `docs/PREREQUISITES.md`, `docs/SCENARIO.md`
- 新規: 機能 9 フォルダ + 横断 7 フォルダの README + INDEX placeholder
- 新規: `README.md`（ルート）
- 更新: `docs/wants.md`（クリア）

## 学習・改善

- 本セッションでのコマンド変更なし（既存 perspectives で充足）

---

## Decisions

```yaml
- id: D20260619-001
  timestamp: 2026-06-19T17:50:00+09:00
  command: /flow:concept
  phase: Step 2 / MVP 入力モダリティ
  question: MVP の入力モダリティをどこまで含めるか
  options:
    - テキスト入力のみ (recommended)
    - テキスト + 音声入力
    - テキスト + 画像/手書き取込
  recommended: テキスト入力のみ
  chosen: テキスト入力のみ
  chosen_type: explicit-choice
  depends_on: []
  context: |
    wants.md が音声入力を「検討」止まりだったため MVP 範囲を確認。
    直後に D20260619-002 設計指針でライブ文字起こし含む方向へ拡張された。

- id: D20260619-002
  timestamp: 2026-06-19T17:55:00+09:00
  command: /flow:concept
  phase: Step 2 / 設計指針割り込み
  question: コア体験の定義（ユーザー割り込み）
  options:
    - 会議/講義を聞きながらツリーが逐次育つ + 眺めながらメモ追加
  recommended: null
  chosen: 会議/講義を聞きながらツリーが逐次育つ + 眺めながらメモ追加
  chosen_type: explicit-choice
  depends_on: [D20260619-001]
  context: |
    ユーザーがヒアリング外で割り込み提示。「テキストのみ MVP」と緊張するため
    再評価。ライブ音声→逐次マージがコア体験と確定、D20260619-001 を実質上書き。

- id: D20260619-003
  timestamp: 2026-06-19T18:00:00+09:00
  command: /flow:concept
  phase: Step 2 / 文字起こし経路
  question: ライブ体験を MVP 実現する文字起こし経路は
  options:
    - Web Speech API + 手動テキスト (recommended)
    - チャンク録音 → Whisper
    - 後追い取込（ライブでない）
  recommended: Web Speech API + 手動テキスト
  chosen: Web Speech API + 手動テキスト
  chosen_type: auto-recommended
  depends_on: [D20260619-002]
  context: |
    無料枠厳守 + 音声非保存（プライバシー）+ ライブ性を両立。
    差別化コアは逐次マージ AI であり文字起こし手段は差し替え可能。Whisper/R2 は v2。

- id: D20260619-004
  timestamp: 2026-06-19T18:05:00+09:00
  command: /flow:concept
  phase: Step 2 / AI プロバイダ
  question: コア AI ロジックのプロバイダ構成
  options:
    - gpt-4o-mini 単一 (recommended)
    - 階層 mini + Claude Haiku
    - Claude Haiku 4.5 単一
  recommended: gpt-4o-mini 単一
  chosen: gpt-4o-mini 単一
  chosen_type: auto-recommended
  depends_on: [D20260619-003]
  context: |
    ライブ逐次マージは高頻度呼び出し → コスト最適 + 構造化 JSON 強い gpt-4o-mini。
    preferences §2.10 採用済（store=false / PII scrub）。Claude へ差し替え容易。

- id: D20260619-005
  timestamp: 2026-06-19T18:08:00+09:00
  command: /flow:concept
  phase: Step 2 / 技術スタック
  question: 技術スタック方向性
  options:
    - 標準 Neon スタック (recommended)
  recommended: 標準 Neon スタック
  chosen: 標準 Neon スタック（Vite+React+TS / Vercel Functions / Neon+Drizzle / Clerk / Stripe / shadcn / React Flow）
  chosen_type: auto-recommended
  depends_on: []
  context: |
    preferences §2-§3.1（採用 7-8 回の強い選好）と wants.md 技術選好が一致。
    マップ描画のみ React Flow を新規採用（wants 指定、キャンバス手編集に最適）。

- id: D20260619-006
  timestamp: 2026-06-19T18:09:00+09:00
  command: /flow:concept
  phase: Step 3 / スコープ
  question: リアルタイム多人数同期を含めるか
  options:
    - 非対象（AI + 1 人）(recommended)
    - 多人数同期対応
  recommended: 非対象（AI + 1 人）
  chosen: 非対象（AI + 1 人）
  chosen_type: auto-recommended
  depends_on: []
  context: wants.md 明示。複雑度・インフラ要件を意図的に回避。

- id: D20260619-007
  timestamp: 2026-06-19T17:48:00+09:00
  command: /flow:concept
  phase: Step 1.7 / preferences 読込
  question: preferences.md 読込
  options: []
  recommended: null
  chosen: 読込完了（10 PJ、強い選好 React+TS/Vercel Functions/Neon/Clerk/Drizzle/Vercel/Sentry/shadcn 採用 7-8）
  chosen_type: auto-recommended
  depends_on: []
  context: 最終更新 2026-06-09、学習元 10 PJ。標準 Neon スタックを推奨バイアスに採用。

- id: D20260619-008
  timestamp: 2026-06-19T18:10:00+09:00
  command: /flow:concept
  phase: Step 3 / 論点抽出
  question: 未決論点の抽出
  options:
    - 論点-001 AI 無料枠トークン量 + PWYW 追加枠設計
    - 論点-002 ライブ逐次マージの矛盾なしマージ UX/AI 設計
    - 論点-003 feedback-hub 構築状況
    - 論点-004 ブランド名
  recommended: null
  chosen: null
  chosen_type: open
  depends_on: [D20260619-001, D20260619-004]
  context: concept §8 に登録。論点-002 がコア差別化の核心。

- id: D20260619-009
  timestamp: 2026-06-19T18:11:00+09:00
  command: /flow:concept
  phase: Step 2 / Q12.12 デザイン方向
  question: デザイン方向
  options:
    - 穏やか・ミニマル・思考をほどく静けさ (recommended)
  recommended: 穏やか・ミニマル
  chosen: 穏やか・ミニマル下案（詳細は /flow:design に委譲）
  chosen_type: auto-recommended
  depends_on: []
  context: |
    提供価値「考えをほどく」+ charter §2.2（煽らない）から穏やか・ミニマルを下案。
    確定は /flow:design で世界観 + 1 画面スパイク承認。
```
