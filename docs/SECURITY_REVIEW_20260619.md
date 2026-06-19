<!-- auto-generated-start -->
# 設計レベル脆弱性レビュー — ai-mindmap (プロダクト全体)

**レビュー日**: 2026-06-19
**レビュー実施者**: Claude (Opus 4.8) + seiji
**対象**: プロダクト全体（concept）
**入力**: docs/concept.md (§1.1 / §1.3 / §3 / §4.3 / §5 / §6 / §9)
**観点ソース**: ~/.claude/flow-data/perspectives.md (O23-O28, O54)
**severity-threshold**: medium

## 1. PJ 性質判定
- 複数ユーザー（各ユーザーが自分のマップを所有、相互隔離）
- 公開
- 有償（PWYW / Stripe 単発）
- 個人情報扱いあり（思考内容・会話 = 機微情報）
- AI 利用あり（コア機能）
- 国内中心

## 2. 脆弱性パターン照合結果

### 2.1 サマリ
- Critical: 0 件
- High: 4 件（うち §8 論点登録 4 件、すべて accepted-as-requirement）
- Medium: 0 件
- Low: 0 件
- 法令必須: 1 件（O26、High・accepted-as-requirement）
- 対応済み: 2 件（O25 秘密情報 / O54 DSR）
- deferred: 1 件（O28 依存 CVE、実装後）

### 2.2 詳細（severity 降順）

#### [SEC-001] O23 認可・所有者スコープ (severity=High) {#sec-001}
- **照合結果**: 部分対応（§5 で user_id 列、§3 で Clerk 認証境界は記載、RLS/所有者チェック設計が未明示）
- **PJ 性質との関連**: require=複数ユーザー ✅
- **推奨対策**: 全マップ/ノード/エッジ API で `owner = clerk_user_id` を DB レベル + サーバ側 `withOwner` ラッパで強制。匿名ゲスト→アカウント連携時の所有者整合
- **route**: accepted-as-requirement（concept §3.X SEC-001 + §8 [論点-005]）

#### [SEC-002] O24 入力検証 (severity=High) {#sec-002}
- **照合結果**: 未対応
- **PJ 性質との関連**: require=公開 ✅、AI 利用ありで prompt injection が特に重要
- **推奨対策**: (1) AI 送信テキストの prompt injection 耐性（システムプロンプト分離 / 構造化 JSON 制約）、(2) ノードテキスト描画の XSS sanitize、(3) CSV/Markdown エクスポートの injection エスケープ、(4) Zod 入力スキーマ
- **route**: accepted-as-requirement（concept §3.X SEC-002 + §8 [論点-006]）

#### [SEC-003] O26 PII ログマスキング (severity=High, legal_required) {#sec-003}
- **照合結果**: 部分対応（§3/§6 で AI 送信前 PII scrub・store=false は記載、ログ/Sentry の PII マスキングが未明示）
- **PJ 性質との関連**: require=公開+個人情報扱い ✅、思考内容は機微
- **推奨対策**: Sentry `beforeSend` で思考内容/PII マスク、エラーに本文/DB 内容を含めない、アナリティクスは匿名 ID のみ
- **route**: accepted-as-requirement（concept §3.X SEC-003 + §8 [論点-007]）

#### [SEC-004] O27 レート制限 (severity=High) {#sec-004}
- **照合結果**: 未対応
- **PJ 性質との関連**: require=公開 ✅、AI エンドポイントのコスト爆発リスク（ライブ高頻度呼び出し）
- **推奨対策**: `/api/structure` `/api/expand` にユーザー/IP レート制限（Upstash/Vercel Edge）+ 無料枠トークン上限（§4.6.2）と二重防御
- **route**: accepted-as-requirement（concept §3.X SEC-004 + §8 [論点-008]）

### 2.3 対応済み（finding なし）
- **O25 秘密情報管理**: concept §4.5.3（.env.example/.env.local/.gitignore + 平文コミット禁止リスト）+ §10.7 + ルート `.gitignore`（.env*.local 除外）作成済み
- **O54 DSR 履行可能性（O22 ゲスト特例）**: concept §9.3 で「運営側で本人特定不能 → セルフサービス削除（非交渉の必須）+ 正直明記 + 窓口削除を約束しない」を明記済み

### 2.4 deferred
- **O28 依存ライブラリ CVE**: 現時点 lockfile 不在（コード未生成）。実装着手後に `/flow:secure --phase=deps` で npm audit 等を実行

## 3. §8 未決事項に登録した論点

| 論点 ID | severity | title | status |
|---|---|---|---|
| [論点-005] | High | SEC-001 認可・所有者スコープ | accepted-as-requirement |
| [論点-006] | High | SEC-002 入力検証 | accepted-as-requirement |
| [論点-007] | High (法令必須) | SEC-003 PII ログマスキング | accepted-as-requirement |
| [論点-008] | High | SEC-004 レート制限 | accepted-as-requirement |

## 4. 次のステップ
- §3.X セキュリティ要件を各機能 SPEC に反映（/flow:feature 時に O23/O24/O27 を _shared/db・auth・ai-client・ai-structuring・export へ展開）
- L2 実装前チェックリスト生成（`/flow:secure --phase=pre-impl`、各機能 PLAN 後）
- L4 依存スキャン（実装後 `/flow:secure --phase=deps`）
- L3 実装後コードレビュー（`security-review` スキル）
- CI に npm audit / Dependabot 組み込み
<!-- auto-generated-end -->
