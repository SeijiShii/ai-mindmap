# 実装前準備チェックリスト

**最終更新**: 2026-06-19
**集約元**: §4.3 リソース選定 / §6 外部連携 / §9 法務 / §4.5 ローカル開発 / §4.4 コスト / perspectives O12 / O22 / O25
**生成元**: /flow:concept

> 開発運用者向け実装前準備チェックリスト。状態列は `<!-- user-edit -->` 区間で手動更新可。

<!-- auto-generated-start -->

## 1. 外部 API キー（環境変数 `.env.local`）

| サービス | 環境変数名 | 用途 | 取得 URL | プラン / 無料枠 |
|---|---|---|---|---|
| OpenAI | `OPENAI_API_KEY` | 逐次マージ + 枝提案（gpt-4o-mini） | platform.openai.com | 従量（store=false） |
| Clerk | `CLERK_SECRET_KEY` / `VITE_CLERK_PUBLISHABLE_KEY` | 認証 | clerk.com | Free 10k MAU |
| Neon | `DATABASE_URL` | DB | neon.tech | Free 0.5GB |
| Stripe | `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | PWYW 課金 | dashboard.stripe.com | 従量手数料のみ |
| Sentry | `SENTRY_DSN` | エラー監視 | sentry.io | Free 5k events |

## 2. BaaS / インフラアカウント（charter §0 デフォルト = Neon スタック）

| サービス | 用途 | 取得 URL | プラン |
|---|---|---|---|
| Neon | DB (Postgres) | neon.tech | Free |
| Vercel | ホスティング + Functions | vercel.com | Hobby (Free) |
| Clerk | Auth | clerk.com | Free 10k MAU |

> R2 は MVP では不要（音声/画像非保存）。v2 で音声・画像取り込み時に追加。

## 3. ドメイン（公開時）
- 既存ドメインのサブドメ運用推奨（`mindmap.<domain>`、撤退時 DNS 1 行削除）
- 検証段階: `<project>.vercel.app` で開始可

## 4. 認証プロバイダ設定（O05 / O22）
| 項目 | 取得方法 | 備考 |
|---|---|---|
| Clerk App 作成 | clerk.com → New Application | Publishable / Secret Key |
| ゲスト認証 (O22) | Clerk Anonymous / no-password を有効化 | 匿名ゲスト開始 → 課金/同期で段階認証 |
| Google OAuth (段階認証) | console.cloud.google.com → Credentials | Clerk Social Provider 設定 |

## 5. 決済プロバイダ設定（PWYW、charter §1）
| 項目 | 取得方法 | 備考 |
|---|---|---|
| Stripe アカウント本人確認 | dashboard.stripe.com | 国内有償時必須 |
| Stripe API キー (test / live) | dashboard.stripe.com/apikeys | live は本番後 |
| Webhook エンドポイント登録 | dashboard.stripe.com/webhooks | 100 円追加枠購入の署名検証 |

## 6. 法務書類準備（§9）
| 書類 | 必要性 | 配置 URL | 作成方法 |
|---|---|---|---|
| プライバシーポリシー | 必須（機微情報 + 公開） | `/legal/privacy` | テンプレ + 自前ドラフト（AI 送信範囲明示） |
| 利用規約 | 必須 | `/legal/terms` | 同上 |
| 特定商取引法表記 | 必須（国内 + 有償） | `/legal/specified-commercial-transactions` | 自前作成 |
| データ削除セルフサービス | 必須（O12×O22） | アプリ内設定 | ゲスト特例: 窓口削除を約束しない |

## 7. 監視・アナリティクス（O01 / O02）
| サービス | 用途 | プラン |
|---|---|---|
| Sentry | エラー監視 | Free |
| Vercel Web Analytics | cookieless 計測 | Hobby 無料 |

## 10. ローカル開発環境準備（§4.5）
| 項目 | コマンド / 手順 |
|---|---|
| Node.js | nvm / asdf で管理 |
| Vercel CLI | `npm i -g vercel`（`vercel dev`） |
| Drizzle | `npm run db:migrate` |
| `.env.example` 作成 | §1, §4, §5 のキー名をダミー値付きで列挙 |
| `.env.local` 作成 | `.env.example` をコピー、実値入力、`.gitignore` 確認 |

## 11. コスト試算（§4.4）
- **初期コスト**: $0（全サービス無料枠）
- **変動費**: OpenAI gpt-4o-mini トークン従量のみ（PWYW で相殺）
- **無料枠超過アラート**: usage_log 積算で 80% / 100% 通知（§4.6.2）

## 12. 実装着手前 最終チェックリスト
- [ ] §1-§7 の必須項目すべて取得済み
- [ ] `.env.example` 作成・必須キー定義済み
- [ ] `.gitignore` に `.env*.local` / `.env` 追加（O25）
- [ ] 法務書類ドラフト作成済み
- [ ] データ削除セルフサービス導線を legal/設定に計上（O12×O22 非交渉の必須）
- [ ] `/flow:secure` で L1 設計レビュー実施
- [ ] CI に `npm audit` / Dependabot 組み込み

<!-- auto-generated-end -->

<!-- user-edit-start -->

## ユーザー手動メモ

### 取得状況
| 項目 | 状態 | 取得日 / 備考 |
|---|---|---|
| OPENAI_API_KEY | ❌ | |
| Clerk プロジェクト | ❌ | |
| Neon プロジェクト | ❌ | |
| Stripe アカウント | ❌ | |

<!-- user-edit-end -->
