# AIと一緒に描くマインドマップ

> **一行で言うと**: 会議や講義を聞きながら AI がリアルタイムでマインドマップを育て、人が眺めながら手で編集・追記し、AI がまた枝を広げる——AI と人が往復で育てる「共同編集型」マインドマップ。

| 項目 | 内容 |
|---|---|
| ユーザー | 考えを整理したい個人（会議/講義の聞き手、企画・学習・悩み整理・文章構成など頭をほどきたい人） |
| 解決する課題 | 白紙のマインドマップは最初の枝出しが重く、AI 一発生成は「生成して終わり」で自分の思考として育てにくい。**聞きながら/書きながら、AI と往復でツリーが育つ**手段が少ない |
| 提供価値 | AI 書き起こし⇄手編集の往復（共同編集）が一級市民。AI は下書き役・発想の相方で、マップの主導権は人間にある |
| 現フェーズ | 企画（concept 初版） |
| 最終更新 | 2026-06-19 |

---

## 1. プロダクト概要

会議・講義を聞きながら、または自分で書き/話しながら、AI が要点をノードに書き起こしてマインドマップのツリーをゆっくり育てる。ユーザーはそれを眺めつつ、自分でノードを追加・削除・並べ替え・つなぎ直しして手編集できる。任意のノードを選んで「広げて」と頼めば、AI が関連・対立・問い・具体例を枝として提案し、人が取捨選択する。行き詰まったら「足りない観点は?」と問うて抜けを補完。完成したマップは画像 / Markdown / アウトラインでエクスポートできる。

差別化の核は **ストリーミングしてくるテキスト（ライブ文字起こし or 手入力）を、人が手編集した既存ツリーに矛盾なくマージしながら育てる AI ロジック**。一問一答ではなく、構造を保ったまま持続的に共同編集できる点が汎用 AI チャットや一発生成系との違い。

### 1.1 主要ユースケース
1. **ライブ聞き取り**: 会議/講義を Web Speech API で文字起こししながら、AI が要点ノードを逐次マージしてツリーがゆっくり育つ。ユーザーは眺めながらメモ（ノード）を追加・編集
2. **書き起こし整理**: 頭の中のもやもやを手で書く/話す → AI が要点ノードに書き起こしてマップ化
3. **手編集**: 出てきたマップを人が手で編集（ノード追加・削除・並べ替え・つなぎ直し）
4. **枝を広げる**: 任意ノードを選んで「広げて」→ AI が関連・対立・問い・具体例を枝として提案、人が取捨選択
5. **観点補完**: 行き詰まったら AI に「足りない観点は?」と問い、抜けを補完
6. **エクスポート**: 完成マップを画像 / Markdown / アウトラインで書き出し
7. **PWYW 課金**: AI 共同編集の無料枠を超えたら 100 円で追加枠を購入（任意）

### 1.2 スコープ
**含むもの（MVP）**:
- テキスト手入力 + Web Speech API ライブ文字起こし（音声は保存しない、テキストのみ AI へ）
- AI 逐次マージによるツリー成長（コア差別化ロジック）
- React Flow ベースのキャンバス手編集
- 選択ノードからの「枝を広げて」深掘り + 「足りない観点は?」補完
- マップの保存・一覧管理（個人ごとに複数マップ）
- 画像 / Markdown / アウトライン エクスポート
- Clerk 匿名ゲスト開始 → 課金/同期時に段階認証
- Stripe 単発課金（PWYW、AI 従量無料枠 + 100 円追加枠）

**含まないもの（明示除外）**:
- リアルタイム多人数同期（共同編集 = AI + 1 人。複雑度・インフラ要件を意図的に回避）
- 音声そのものの保存・録音アーカイブ（プライバシー + 無料枠厳守、v2 検討）
- Whisper / 専用ストリーミング STT・チャンク録音アップロード（v2 でクロスブラウザ精度向上時に検討）
- 画像/手書き取り込み（Vision、v2 検討）
- 公開・共有・いいね等のソーシャル競争要素（charter §2.2、自分のための思考ツール）

### 1.3 ドキュメントフォルダ分割設計

> **重要**: ここで設計するのは `docs/` 配下の**ドキュメント置き場**の構造であって、実装コード (`src/` 等) の構造ではない。

#### 1.3.1 機能フォルダ（業務ドメイン別）

| フォルダ (docs/ 配下) | 含む機能 | 担当する画面 / API | 依存 | 優先度 | 基盤 |
|---|---|---|---|---|---|
| docs/live-capture/ | ライブ音声認識(Web Speech API)+手動テキスト入力、ストリーミングテキストの逐次取り込み | キャプチャ UI / 入力バッファ | _shared/ui | 3 | ❌ |
| docs/mindmap-canvas/ | React Flow キャンバス、ノード/エッジ手編集（追加・削除・並べ替え・つなぎ直し）、レイアウト | キャンバス画面 / レイアウト計算 | _shared/ui, _shared/types | 3 | ❌ |
| docs/map-management/ | マップの保存・一覧・リネーム・削除（個人ごと複数マップ） | マップ一覧画面 / CRUD API | _shared/db, _shared/auth | 3 | ❌ |
| docs/ai-structuring/ | **コア差別化**: ストリーミングテキスト→既存ツリーへの逐次マージ AI ロジック（矛盾なく構造保持） | マージ API / 構造化プロンプト | _shared/ai-client, _shared/types, _shared/cost-tracking | 4 | ❌ |
| docs/ai-expand/ | 選択ノードからの「枝を広げて」深掘り（関連・対立・問い・具体例）+「足りない観点は?」補完 | 枝提案 API / 提案 UI | _shared/ai-client, _shared/types, _shared/cost-tracking | 4 | ❌ |
| docs/export/ | 画像 / Markdown / アウトライン エクスポート | エクスポート UI / 変換ロジック | _shared/types | 4 | ❌ |
| docs/billing/ | Stripe 単発課金（PWYW、AI 無料枠 + 100 円追加枠）、Webhook 署名検証 | 課金 UI / Stripe Webhook | _shared/db, _shared/auth, _shared/cost-tracking | 4 | ❌ |
| docs/feedback/ | 好き嫌い 👍/👎 + バグ報告ウィジェット → feedback-hub 連携（PII scrub） | フィードバック UI / ingestion 呼び出し | _shared/ui | 4 | ❌ |
| docs/legal/ | プライバシーポリシー / 利用規約 / 特商法表記 公開ページ + 初回 consent | /legal/* ページ / consent UI | _shared/ui | 4 | ❌ |

#### 1.3.2 横断フォルダ（機能をまたぐ技術設計）

| フォルダ (docs/ 配下) | 責務 | 含む設計 | 依存 | 優先度 | 基盤 |
|---|---|---|---|---|---|
| docs/_shared/db/ | DB スキーマ・マイグレーション（Neon + Drizzle） | maps / nodes / edges / usage_log / users テーブル・インデックス・制約 | (なし) | 1 | ✅ |
| docs/_shared/types/ | 共通型定義 | MindMapNode / Edge / MapMeta / AiSuggestion / UsageEvent 等 | (なし) | 1 | ✅ |
| docs/_shared/auth/ | 認証・認可基盤（Clerk） | 匿名ゲスト開始 → 課金/同期時に段階認証、ゲスト→アカウント連携データ引き継ぎ | _shared/db | 2 | ✅ |
| docs/_shared/ai-client/ | OpenAI クライアントラッパ | server side 呼び出し、store=false、送信前 PII scrub、構造化 JSON 出力、リトライ | _shared/types | 2 | ✅ |
| docs/_shared/cost-tracking/ | コスト集計メカニズム（§4.6.2） | usage_log 積算 + .env 単価管理 + 概算コスト算出 + 無料枠超過アラート | _shared/db | 2 | ✅ |
| docs/_shared/ui/ | 共通 UI 部品（shadcn/ui + Tailwind） | テーマ / 基本コンポーネント / レイアウトシェル | (なし) | 1 | ✅ |
| docs/_shared/app-shell/ | **アプリ合成レイヤ**（部品を動く・デプロイ可能なアプリに組み立てる、O57） | 合成ルート(entry/main/router/providers) + UI↔data 配線 + API ルートハンドラ層 + Clerk セッション確立 + deploy scaffold | **全 feature + _shared 全部** | **最大 (最後)** | ❌ |

> **⚠️ 合成レイヤ (app-shell) を必ず立てる (perspectives O57)**: features（葉）+ _shared/db・auth 等（根）だけだと部品ばかりで、全部品を動く・デプロイ可能な 1 アプリに組み立てる target が誰の担当でもなくなる。UI を持つ本 PJ では `_shared/app-shell` を最終 target として立て、全機能 + 全 _shared に依存させる（優先度は常に最後）。

#### 1.3.3 依存・優先度・基盤の定義
- **依存**: そのフォルダが先に必要とする他フォルダ。循環依存は不可
- **優先度**: topological sort 順（小さいほど先）。優先度 1 = 依存なし
- **基盤**: ✅ なら他から多く参照される

#### 1.3.4 優先度算出結果（topological sort）
```
優先度 1: _shared/db, _shared/types, _shared/ui   (基盤の基盤)
優先度 2: _shared/auth, _shared/ai-client, _shared/cost-tracking
優先度 3: live-capture, mindmap-canvas, map-management
優先度 4: ai-structuring, ai-expand, export, billing, feedback, legal
優先度 5: _shared/app-shell   (合成レイヤ、全依存、最後)
```
循環依存: なし

#### 1.3.5 命名規約
- 機能フォルダ: ケバブケース業務名（`live-capture`, `mindmap-canvas`）
- 横断フォルダ: `_shared/<技術領域>/`

### 1.4 実装コードフォルダ構成（たたき台）

> Vite + React + TS（PWA）+ Vercel Functions 構成のたたき台。実装フェーズで詳細化。

```
src/
  features/              # 機能単位（§1.3 機能フォルダと命名統一）
    live-capture/        # Web Speech API + テキスト入力
    mindmap-canvas/      # React Flow キャンバス・手編集
    map-management/      # マップ一覧・CRUD
    ai-structuring/      # 逐次マージ（呼び出し側）
    ai-expand/           # 枝を広げる（呼び出し側）
    export/              # 画像/MD/アウトライン書き出し
    billing/             # Stripe PWYW
    feedback/            # フィードバックウィジェット
    legal/               # /legal/* ページ
  components/            # 共通 UI 部品（shadcn/ui）
  hooks/                 # 共通フック（useSpeechRecognition 等）
  lib/                   # ユーティリティ（PII scrub, tree merge helpers）
  services/              # クライアント側 API ラッパ（TanStack Query）
  types/                 # 共通型
  app/                   # 合成ルート（main / router / providers）
api/                     # Vercel Functions（ai-structuring / ai-expand / billing webhook / cost-tracking）
```

- §1.3 ドキュメントフォルダと機能名を揃える（`docs/live-capture/` ↔ `src/features/live-capture/`）

## 2. 前提条件・制約
- **業務前提**: 個人利用が当面の中心。リアルタイム多人数同期は非対象
- **技術制約**: 無料枠厳守（個人開発）。AI コストは PWYW 従量で吸収。音声は保存しない（プライバシー）
- **体制・予算・納期**: 個人開発、月固定費ゼロ厳守、納期は段階リリース

## 3. 非機能要件

| 項目 | 目標値 | 根拠 |
|---|---|---|
| キャンバス性能 | 数百ノード規模でもスムーズに描画・パン・ズーム（体感カクつきなし） | ノード数増加時のキャンバス性能が体験の肝（wants.md） |
| AI 逐次マージ応答 | ライブ中の 1 マージサイクルが体感「ゆっくり育つ」に収まる（数秒オーダー、ブロッキングしない） | ライブ体験の自然さ。先行ノードの手編集を壊さない非同期更新 |
| プライバシー | 音声は保存しない。AI 送信前に PII scrub。デフォルト非公開。AI 送信範囲・保存方針を透明化 | 思考・会話は機微情報（wants.md、charter §2.2） |
| セキュリティ | OpenAI API キーはサーバサイド秘匿。store=false。Clerk 認証・認可境界 | 個人の思考内容の保護 |
| 運用・監視 | Sentry エラー監視 + 自前コストログ積算 + 無料枠超過アラート | 個人運用、無料枠厳守の継続判断（§4.6） |
| データ可搬性 | ユーザーが自分のマップを画像/MD/アウトラインで持ち出せる（消去権はセルフサービス） | 撤退リスク最小化、O12 データ主体権利 |

## 4. 全体アーキテクチャ

```
[ブラウザ PWA (Vite+React+TS)]
  ├─ Web Speech API (ライブ文字起こし、音声はブラウザ内で破棄)
  ├─ React Flow キャンバス (手編集)
  ├─ Clerk (匿名ゲスト→段階認証)
  └─ TanStack Query
        │  (テキストのみ / PII scrub 後)
        ▼
[Vercel Functions (server side)]
  ├─ /api/structure  逐次マージ (gpt-4o-mini, store=false)
  ├─ /api/expand     枝を広げる (gpt-4o-mini)
  ├─ /api/cost       usage_log 積算
  └─ /api/billing/webhook  Stripe 署名検証
        │
        ▼
[Neon (Postgres) + Drizzle]   maps / nodes / edges / usage_log / users
[Stripe]  単発課金 (PWYW)
[Sentry]  エラー監視     [Vercel Web Analytics]  cookieless 計測
```

### 4.1 主要コンポーネント
| 名前 | 責務 | 技術領域 (例) |
|---|---|---|
| キャプチャ | ライブ音声認識 + テキスト入力 → ストリーミングテキスト | Web Speech API / React |
| キャンバス | ノード/エッジ描画・手編集 | React Flow |
| 構造化エンジン | テキスト→既存ツリー逐次マージ（コア） | Vercel Functions + gpt-4o-mini |
| 枝提案エンジン | 選択ノードの深掘り・観点補完 | Vercel Functions + gpt-4o-mini |
| 永続化 | マップ/ノード/エッジ/利用ログ | Neon + Drizzle |
| 課金 | PWYW 単発・無料枠管理 | Stripe |

### 4.2 技術スタック（方向性）
- フロント: PWA（例: Vite + React + TypeScript）、キャンバス（例: React Flow）、状態/取得（例: TanStack Query）、UI（例: shadcn/ui + Tailwind）
- バック: サーバーレス関数（例: Vercel Functions）で AI 呼び出しをキー秘匿
- データ層: マネージド Postgres（例: Neon）+ 型安全 ORM（例: Drizzle）
- 認証: マネージド認証（例: Clerk、匿名ゲスト→段階認証）
- AI: 外部 LLM（例: OpenAI gpt-4o-mini、store=false、PII scrub）
- 監視・計測: エラー監視（例: Sentry）、cookieless アナリティクス（例: Vercel Web Analytics）

### 4.3 リソース選定たたき台

> 各サービスの pricing は変動。採用判断時は必ず最新公式 pricing を確認。

| カテゴリ | 推奨具体名 | 代替候補 | 選定根拠 | 想定単価 (USD/月、桁感) |
|---|---|---|---|---|
| フロント FW | Vite + React + TS (PWA) | Next.js | preferences §2.1 (採用 7)。SPA キャンバスアプリに好適、SEO は LP のみ後追い | $0 ※ 2026-06 時点想定、最新 pricing 要確認 |
| マップ描画 | React Flow | @xyflow / Cytoscape.js / d3 | ノード/エッジ手編集・カスタムノードに最適、React 親和性。wants.md 指定 | $0（OSS） ※ |
| 状態/取得 | TanStack Query | SWR | preferences §2.15 (採用 4)。マップ取得・生成ステータス | $0 ※ |
| UI | shadcn/ui + Tailwind | MUI | preferences §2.14 (採用 8) | $0 ※ |
| バックエンド | Vercel Functions | Cloudflare Workers | preferences §2.2 (採用 7)。AI キー秘匿 | $0 (Hobby) ※ |
| DB | Neon (Postgres) | Supabase(2PJ 制約で不可) | preferences §2.3 (採用 7)。サービスごと DB 分離 | $0 (Free 0.5GB) ※ |
| ORM | Drizzle | Prisma | preferences §2.13 (採用 7)。Neon + TS 型安全 | $0 ※ |
| 認証 | Clerk | Auth0 | preferences §2.4 (採用 7)。匿名ゲスト→段階認証 O22 | $0 (Free 10k MAU) ※ |
| 外部 AI | OpenAI gpt-4o-mini | Claude Haiku 4.5 | preferences §2.10。高頻度逐次マージにコスト最適、構造化 JSON。store=false | 従量（DAU/利用次第、§4.4） ※ |
| 音声認識 | Web Speech API（ブラウザ標準） | Whisper / Deepgram (v2) | 無料・音声非保存・プライバシー良好。Chrome 中心の制約あり | $0 ※ |
| ホスティング | Vercel Hobby | Cloudflare Pages | preferences §2.5 (採用 8) | $0 ※ |
| 決済 | Stripe（単発 PWYW） | — | preferences §2.19 (採用 5)。月固定費ゼロ、従量手数料のみ | 手数料のみ ※ |
| 監視 | Sentry (Free) | — | preferences §2.6 (採用 8) | $0 (5k events) ※ |
| アナリティクス | Vercel Web Analytics (cookieless) | PostHog | preferences §2.7 (採用 5)。consent banner 不要 | $0 (Hobby) ※ |
| CI/CD | GitHub Actions + Vercel Preview | — | preferences §2.8 (採用 8) | $0 ※ |
| ドメイン | 既存ドメインのサブドメ運用 | 新規取得 | perspectives O29、撤退リスク最小（DNS 1 行削除） | 年 $0〜15 ※ |

### 4.4 想定コストサマリ

| 区分 | 月額目安 (USD) | 内訳の例 |
|---|---|---|
| 個人・無料枠 | $0 + AI 従量 | Neon/Vercel/Clerk/Sentry すべて無料枠。AI のみ gpt-4o-mini 従量 |
| 利用増時 | AI 従量が主変動費 | ライブ逐次マージは高頻度呼び出し → トークン消費が主コスト。PWYW で吸収 |

**本プロジェクトのレンジ**: 個人・無料枠。根拠: 個人開発・月固定費ゼロ厳守・PWYW（AI 従量）。**インフラは無料枠厳守、変動費は AI トークンのみで PWYW 課金で相殺する設計**。上限到達時は §4.3 代替候補（より安価なモデル / 無料枠縮退）に切替判断。

### 4.5 ローカル開発環境計画

#### 4.5.1 開発スタイル
**サーバーレス emulation（コンテナ不要寄り）**。理由: Vercel Functions + Neon（マネージド）構成のため docker 不要。`vercel dev` でローカル関数実行、Neon は dev ブランチ（無料）に直接接続。

#### 4.5.2 必要サービス
| サービス | 役割 | ローカル起動方式 | ポート | 永続化 |
|---|---|---|---|---|
| Vite dev server | フロント | `npm run dev` | 5173 | (なし) |
| Vercel Functions | API | `vercel dev` | 3000 | (なし) |
| Neon (dev branch) | DB | リモート接続（dev ブランチ） | — | リモート |

#### 4.5.3 環境変数・シークレット管理
- `.env.example`: 必須キー一覧（ダミー値、コミット可）
- `.env.local`: 実値（`.gitignore` 必須）
- 平文コミット禁止: `OPENAI_API_KEY` / `CLERK_SECRET_KEY` / `DATABASE_URL` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`

#### 4.5.4 起動・停止コマンド
| 操作 | 抽象表現 | 例 |
|---|---|---|
| 起動 | フロント + 関数を同時起動（統合 launcher） | `./scripts/dev.sh`（内部で vite + vercel dev） |
| 停止 | 全停止 | `./scripts/stop.sh` / Ctrl+C |
| DB マイグレーション | スキーマ反映 | `npm run db:migrate`（Drizzle） |

#### 4.5.5 留意点
- Web Speech API は HTTPS or localhost 必須・Chrome 推奨。ローカルは localhost で動作
- ホットリロード: Vite フロント / Vercel Functions 共に対応
- Windows(WSL2): localhost ポートフォワード、スマホ実機確認は同一 LAN + ポート公開

#### 4.5.7 dev 起動スクリプト計画（O36）
- launcher: bash（`scripts/dev.sh` / `scripts/stop.sh`）
- 起動順: Neon 接続確認 → vercel dev → vite
- smoke test endpoint: `/api/health`, `/api/structure`(ダミー), `/api/cost`
- stop cleanup: vite + vercel dev プロセス停止

### 4.6 コスト・収益追跡と継続判断ループ

#### 4.6.1 PJ 性質別レベル
**本 PJ の該当レベル: 個人ツール / 無料枠**（PWYW 任意支援）。コスト追跡 ✅ / 無料枠超過アラート ✅ / 収益指標 ❌（任意）/ BEP 不要 / 撤退判断 = 無料枠超過時の対応方針 / 判断主体 = 本人。

#### 4.6.2 コスト集計メカニズム（必須）
1. **呼び出しログ積算**: `/api/structure` `/api/expand` の呼び出しごとに `usage_log` テーブルへ記録（user_id / endpoint / input_tokens / output_tokens / timestamp / success）
2. **単価表は `.env` 管理**:
   ```
   COST_OPENAI_GPT4O_MINI_PER_1K_INPUT_TOKENS=0.00015
   COST_OPENAI_GPT4O_MINI_PER_1K_OUTPUT_TOKENS=0.0006
   ```
   （※ 2026-06 時点想定、最新 pricing 要確認。変動時は `.env` 更新のみ、ハードコード禁止）
3. **概算コスト算出**: `tokens × 単価` を user/day/month で集計
4. **無料枠管理**: ユーザーごとに月間無料 AI トークン枠を設定。消費を usage_log から算出し、80% / 100% でユーザーに通知。超過時は Stripe 100 円で追加枠購入を案内
5. **アラート**: 全体コストが想定無料運用の閾値を超えたら本人へ通知（Sentry / メール）

> ライブ逐次マージは高頻度呼び出しのため、**トークン課金が最大の変動費**。無料枠はトークン量ベースで設計（「回数」ではなく実トークンで公平に計量）。

#### 4.6.3 追跡するコスト指標
| 指標 | 集計頻度 | 集計元 |
|---|---|---|
| OpenAI トークンコスト | 日次/月次 | usage_log × .env 単価 |
| Neon / Vercel 使用量 | 日次 | 各ダッシュボード（無料枠監視） |

#### 4.6.7 継続 / 撤退判断基準
| 判断 | 基準 | 対応 |
|---|---|---|
| 継続 | インフラ無料枠内 + AI コストが PWYW 収入内 | 通常運用 |
| 縮退 | AI コストが PWYW を恒常的に超過 | 無料枠縮小 / より安価なモデルへ切替 |
| 撤退 | 無料枠超過の代替も無く本人の利用も無い | §4.7.5 撤退手順 |

#### 4.6.8 判断主体
本人。判断ログは `docs/AI_LOG/` または運用メモに記録。

### 4.7 公開戦略・ドメイン・リバースプロキシ

#### 4.7.1 ドメイン情報
- 既存ドメイン: あり（`givers.work` 等、preferences）/ サブドメ運用想定（`mindmap.<domain>` 等、撤退リスク最小）
- 検証段階: Vercel デフォルトドメイン `<project>.vercel.app` で開始可

#### 4.7.2 公開構成パターン
**(A) PaaS 完結（Vercel）**を採用。運用負担ゼロ、リバースプロキシ不要。

#### 4.7.3 リバースプロキシ
なし（PaaS 完結）。SSL は Vercel 自動。

#### 4.7.5 撤退時の手順
1. ユーザー事前通知（アプリ内バナー）
2. エクスポート機能で自分のマップを持ち出し可能（画像/MD/アウトライン、常時提供）
3. 課金停止（PWYW 単発のため継続課金なし、追加処理不要）
4. DNS サブドメ削除（1 行）
5. データバックアップ N ヶ月保管後 DB 削除

### 4.8 サービス公開周知 / マーケティング戦略

#### 4.8.1 チャネル（個人開発マイクロサービス）
| 優先度 | チャネル | 本 PJ |
|---|---|---|
| ★★★ | 製品内グロース（エクスポート画像が自然にシェアされる）+ SEO | 採用（強制シェアなし、charter §2.2 準拠） |
| ★★★ | note（汎用ブログ） | 採用（月 1 記事目安） |
| ★ 既存維持 | X（開発者向け Build in Public） | 既存活動継続（週 1 目安） |
| 任意 | Product Hunt / Zenn | 任意 |

#### 4.8.2 製品内グロース
- シェア対象: エクスポートした思考マップ画像（「これ何のアプリ?」を誘発）
- 強制シェア・招待煽り・ランキングは不採用（charter §2.2、自分のための思考ツール）

#### 4.8.4 Build in Public ストーリー軸
- 「AI 駆動開発で週 1 ペースの新サービス公開」「AI と往復で考えをほどく道具を作る」

#### 4.8.5 OGP
- `og:title` / `og:description` / `og:image`（動的 OG 検討）、`twitter:card: summary_large_image`

## 5. データ設計（高レベル）

### 5.1 主要エンティティ
- **users**: Clerk user_id 紐付け、月間無料 AI トークン枠、追加枠残量
- **maps**: id / user_id / title / created_at / updated_at
- **nodes**: id / map_id / parent_id / text / position(x,y) / source(ai|human) / created_at
- **edges**: id / map_id / source_node_id / target_node_id / type
- **usage_log**: id / user_id / endpoint / input_tokens / output_tokens / cost_estimate / created_at

### 5.2 データフロー
ライブ文字起こし/手入力テキスト → (PII scrub) → /api/structure → gpt-4o-mini → 構造化ノード差分 → 既存ツリーへマージ → nodes/edges 更新 → キャンバス再描画。usage_log 記録。

## 6. 外部連携

| 連携先 | 用途 | 方式 | 認証 |
|---|---|---|---|
| OpenAI (gpt-4o-mini) | 逐次マージ + 枝提案（コア） | REST API（server side、store=false、PII scrub） | API キー（サーバ秘匿） |
| Clerk | 認証（匿名ゲスト→段階認証） | SDK | Publishable / Secret Key |
| Neon | DB | Postgres 接続（Drizzle） | DATABASE_URL |
| Stripe | PWYW 単発課金 | SDK + Webhook 署名検証 | Secret / Webhook Secret |
| Sentry | エラー監視 | SDK | DSN |
| Vercel Web Analytics | cookieless 計測 | SDK | (プロジェクト紐付け) |
| feedback-hub | フィードバック集約（別 PJ、未構築なら §8 論点） | `POST /api/feedback` | service ID + endpoint env |

**外部 AI サービス利用: あり（Q12.5 で確定、コア機能）**。差別化根拠（O22 価値検証）= **(d) マルチステップ + (e) UI 統合**: 汎用 AI チャットに「マインドマップ作って」と頼むのと違い、(1) 人が手編集した既存ツリー構造を文脈として注入し矛盾なくマージ、(2) ライブで育ち続ける持続的共同編集、(3) 生 LLM 出力ではなく操作可能なキャンバスノードとして提示。Web Speech API のテキストのみ送信、音声は保存しない。

**アナリティクス利用: あり（Vercel Web Analytics、cookieless）**。consent banner 不要、IP 匿名化済み。GDPR/個人情報保護法: cookieless のため同意バナー不要、プラポリに利用を明記。

## 7. 決定事項ログ

| 日付 | 決定内容 | 根拠 | 影響セクション | decision_id |
|---|---|---|---|---|
| 2026-06-19 | MVP 入力 = テキスト + Web Speech API ライブ文字起こし（音声非保存）、Whisper/R2 は v2 | Q設計指針（聞きながらツリーが育つ） | §1.2, §1.1 UC1 | [D20260619-001](./AI_LOG/D20260619_001_concept_initial.md#decisions) |
| 2026-06-19 | コア体験 = 会議/講義を聞きながらツリーが逐次育つ + 眺めながらメモ追加 | ユーザー設計指針 | §1.1, §1.2 | [D20260619-002](./AI_LOG/D20260619_001_concept_initial.md#decisions) |
| 2026-06-19 | 文字起こし = Web Speech API + 手動テキスト（音声非保存・テキストのみ AI） | ヒアリング | §1.2, §3, §4 | [D20260619-003](./AI_LOG/D20260619_001_concept_initial.md#decisions) |
| 2026-06-19 | AI プロバイダ = gpt-4o-mini 単一（store=false / PII scrub） | ヒアリング（高頻度・コスト最適） | §4.3, §6, §4.6 | [D20260619-004](./AI_LOG/D20260619_001_concept_initial.md#decisions) |
| 2026-06-19 | 標準 Neon スタック採用（Vercel Functions / Neon+Drizzle / Clerk / Stripe / shadcn） | preferences §2-§3.1 | §4.3 | [D20260619-005](./AI_LOG/D20260619_001_concept_initial.md#decisions) |
| 2026-06-19 | リアルタイム多人数同期は非対象（AI + 1 人） | wants.md | §1.2 | [D20260619-006](./AI_LOG/D20260619_001_concept_initial.md#decisions) |

## 8. 未決事項（論点リスト）

### [論点-001] AI 無料枠のトークン量と PWYW 追加枠の設計
- **影響範囲**: §4.6.2, billing, _shared/cost-tracking
- **詰めるべき問い**:
  1. 月間無料 AI トークン枠を何トークンにするか（≒ 何分のライブ会議相当か）
  2. 100 円追加枠で何トークン付与するか
  3. ライブ逐次マージの呼び出し頻度（何秒/何文字ごと）をどう設計しコストを抑えるか
- **候補案**:
  - 案 A: トークン量ベースの無料枠 + 100 円トップアップ（公平、実装やや複雑）
  - 案 B: 「AI 操作回数」ベース（分かりやすいが、ライブ連続マージと相性が悪い）
- **推奨**: 案 A（トークンベース）。理由: ライブ逐次マージは連続的でトークン量が実コストに直結。回数では公平に計量できない
- **判断期限**: billing / cost-tracking 設計フェーズ前
- **担当**: 本人

### [論点-002] ライブ逐次マージの「矛盾なくマージ」UX/AI 設計
- **影響範囲**: ai-structuring（コア差別化）
- **詰めるべき問い**:
  1. 既存ツリー（人が手編集済み）に新テキスト要点をどう差分マージするか（プロンプト設計 / ツリー diff アルゴリズム）
  2. 人の手編集中に AI 更新が来た場合の競合解決（last-write-wins / 追加のみ / ハイライト承認）
  3. ノード爆発（情報過多）を防ぐ要約・集約戦略
- **候補案**:
  - 案 A: AI は「追加候補」を提示し人が承認（壊さない、安全、ややクリック多）
  - 案 B: AI が自動マージし変更箇所をハイライト（ライブ感強い、誤マージリスク）
- **推奨**: 案 A 基調 + ライブ時は「ゆっくり自動追加 + 取り消し可能」のハイブリッド。理由: 主導権は人間（提供価値）、ただしライブ体験の自然さも要る
- **判断期限**: ai-structuring 設計フェーズ
- **担当**: 本人

### [論点-003] feedback-hub の構築状況
- **影響範囲**: feedback, §6
- **詰めるべき問い**: 共有 feedback-hub は既存か、本 PJ で別途立ち上げか
- **推奨**: 既存 hub があれば endpoint 設定のみ。無ければ MVP はローカル即時通知（Slack/メール）のみ、hub 連携は後追い
- **判断期限**: feedback 設計フェーズ
- **担当**: 本人

### [論点-004] ブランド名（短い呼称）
- **影響範囲**: §1, README, OGP, デザイン
- **詰めるべき問い**: 「AIと一緒に描くマインドマップ」は説明的タイトル。短いブランド名を付けるか
- **推奨**: `/flow:design` フェーズで世界観確定と合わせて決める（低優先）
- **判断期限**: デザインフェーズ
- **担当**: 本人

## 9. 法務・コンプライアンス書類

> 公開 + 思考/会話という機微情報を扱う + PWYW 有償課金のため、書類が必要。

### 9.1 必須書類チェックリスト
| 書類 | 必要性 | 状態 | 配置パス / URL | 備考 |
|---|---|---|---|---|
| プライバシーポリシー | ✅ | 未作成 | `/legal/privacy` | 思考内容・AI 送信範囲・保存方針の透明化が必須 |
| 利用規約 | ✅ | 未作成 | `/legal/terms` | 公開サービス |
| 特定商取引法に基づく表記 | ✅ | 未作成 | `/legal/specified-commercial-transactions` | 日本国内 + PWYW 有償課金 |
| Cookie ポリシー | ❌（不要） | — | — | Vercel Web Analytics は cookieless、Clerk セッション以外の追跡 Cookie なし |

### 9.2 対応地域法規
| 法規 | 対象 | 対応方針 |
|---|---|---|
| 個人情報保護法（日本） | ✅ | 取得目的明示 / AI 送信範囲の明示 / セルフサービス削除 |
| GDPR (EU) | △（当面国内中心） | cookieless + セルフサービス削除で基本対応、本格対応は対象ユーザー発生時 |

### 9.3 書類作成方針
- 作成手段: テンプレ採用 + 自前ドラフト（公開前に内容確認）
- 配置: `docs/legal/` に原稿、公開時 `/legal/*` ルート
- 公開導線: フッタリンク + 登録/課金時の同意
- **⚠️ ゲスト/匿名認証採用（O22）のデータ主体権利特例（O12 ペア、CF-20260529-021）**: ゲスト利用では運営側がユーザーを特定できないため「削除請求は窓口まで」は履行不能。代わりに「**運営側で個人を特定できないため、データの確認・削除はアプリ内のセルフサービス機能でご自身で行える / アカウント連携後は窓口でも対応**」と正直に明記。**全データ削除のセルフサービス導線は非交渉の必須**（legal 機能 or 設定画面に実装）。エクスポート（可搬性）はマップ常時閲覧 + 書き出し UI があるため一括 export は任意。窓口削除を約束しない。

### 9.4 特定商取引法
- 販売事業者 / 代表者 / 所在地（個人事業主は「請求あれば遅滞なく開示」記載で省略可）/ 連絡先 / 価格（100 円追加枠）/ 支払方法（Stripe）/ 引渡時期 を PWYW 課金公開前に整備

## 10. Git リポジトリ・運用

### 10.1 リポジトリ情報
| 項目 | 値 |
|---|---|
| リポジトリ URL | （未設定、ローカル git init 予定） |
| 可視性 | private（公開判断は後） |
| ホスティング | GitHub 想定 |
| デフォルトブランチ | main |

### 10.2 ブランチ戦略
- Trunk-based + Protected main（推奨）。protected_branches: `[main]`、auto_branch_prefix: `flow/`

### 10.3 コミット規約
- Conventional Commits。flow 自動コミットは `docs(flow:concept): ...`

### 10.6 flow コマンド自動コミット方針
```yaml
auto_commit: true
branch_strategy: trunk-based
commit_message_lang: ja
protected_branches: [main]
auto_branch_prefix: "flow/"
staging_extra_paths: []
staging_exclude_paths: []
```

### 10.7 セキュリティ
- `.env*.local` / 秘密情報を `.gitignore` 除外（O25）。pre-commit で秘密検知推奨

## 11. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成（MVP=テキスト+Web Speech ライブ / gpt-4o-mini 単一 / 標準 Neon スタック） | /flow:concept |
