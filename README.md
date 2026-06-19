# AIと一緒に描くマインドマップ

会議や講義を聞きながら AI がリアルタイムでマインドマップを育て、人が眺めながら手で編集・追記し、AI がまた枝を広げる——AI と人が往復で育てる「共同編集型」マインドマップ。

## 概要

新規 MVP（個人開発・無料枠厳守）。白紙のマインドマップは最初の枝出しが重く、AI 一発生成は「生成して終わり」で自分の思考として育てにくい。本プロダクトは **ストリーミングしてくるテキスト（ライブ文字起こし or 手入力）を、人が手編集した既存ツリーに矛盾なくマージしながら育てる** ことを核に、AI 書き起こし⇄手編集の往復（共同編集）を一級市民にする。

## 主要機能

- **ライブ聞き取り**: Web Speech API で会議/講義を文字起こししながらツリーが逐次育つ（音声は保存しない）
- **手編集キャンバス**: React Flow でノード/エッジを自由に追加・削除・並べ替え・つなぎ直し
- **枝を広げる**: 選択ノードから AI が関連・対立・問い・具体例を提案、人が取捨選択
- **観点補完**: 「足りない観点は?」で抜けを補完
- **エクスポート**: 画像 / Markdown / アウトライン

## 技術スタック

- フロント: Vite + React + TypeScript (PWA)
- マップ描画: React Flow
- UI: shadcn/ui + Tailwind / 状態取得: TanStack Query
- バック: Vercel Functions（AI 呼び出しをキー秘匿）
- DB: Neon (Postgres) + Drizzle
- 認証: Clerk（匿名ゲスト → 段階認証）
- AI: OpenAI gpt-4o-mini（store=false / PII scrub）
- 決済: Stripe（PWYW 単発）
- 監視/計測: Sentry / Vercel Web Analytics (cookieless)

## Getting Started (Local Development)

### 前提条件
- Node.js（nvm / asdf で管理）
- Vercel CLI（`npm i -g vercel`）
- `.env.local` の準備（`.env.example` をコピーして実値を埋める。詳細は [PREREQUISITES.md](./docs/PREREQUISITES.md)）

### 起動
```bash
# 統合 launcher（実装後に scripts/dev.sh を用意）
./scripts/dev.sh

# または個別に
vercel dev   # API (Vercel Functions)
npm run dev  # Vite フロント
```

### 停止
```bash
./scripts/stop.sh   # または Ctrl+C
```

> Web Speech API は HTTPS or localhost + Chrome 推奨。

## 開発状態

計画中（concept 初版完了、機能設計はこれから）。

## 設計ドキュメント

- [全体概念・要件・設計](./docs/concept.md) — プロジェクト中央書類（`/flow:concept` で生成・更新）
- [開発シナリオ](./docs/SCENARIO.md) — next-step 判断用ナラティブ
- [機能フォルダ INDEX](./docs/INDEX.md) — 全機能フォルダ + 横断フォルダのリスト
- [AI 用エントリポイント](./docs/DOC_MAP.md) — 目的別アクセスガイド
- [実装前準備チェックリスト](./docs/PREREQUISITES.md) — API キー / アカウント / 法務書類

## ライセンス

All Rights Reserved（公開方針確定後に見直し）。
