# _shared/app-shell アプリ合成レイヤ 仕様書（O57）

> **役割**: 全 feature + 全 _shared を「動く・デプロイ可能な 1 アプリ」に組み立てる合成 target。合成ルート + 配線 + API ルートハンドラ層 + Clerk セッション確立 + deploy scaffold。
> **タグ**: cross-cutting（合成、優先度最大=最後）
> **最終更新**: 2026-06-19
> **入力**: `../../concept.md` §1.3.2, 全 feature SPEC, §10/§12.9

---

## 1. 提供インターフェース（合成 target）
- **合成ルート**: `index.html` / `main.tsx` / `App.tsx` / router / providers（ClerkProvider, QueryClientProvider, テーマ）
- **UI↔data 配線**: features を画面に組み込み、TanStack Query で API と接続
- **API ルートハンドラ層**: `api/*`（structure/expand/maps/billing/feedback/account/auth/cost）を requireOwner で保護・公開
- **Clerk セッション確立**: ゲスト自動サインイン → 全保護 API が authed（P4.46 本番経路）
- **deploy scaffold**: scripts/dev.sh・stop.sh（O36）、CI/CD yaml（O37）、ブランドマーク生成（O56）、vercel 設定

## 2. ルーティング
| ルート | 画面 | 導線 |
|---|---|---|
| `/` | マップ一覧（map-management）+ 入口リード文/InfoButton（O41） | — |
| `/map/:id` | キャンバス（mindmap-canvas）+ CapturePanel + Expand + Export | 一覧から |
| `/legal/*` | 法務ページ | フッタ常設（O55） |
| 設定 | DeleteAccountPanel + 通知/枠 | グローバルナビ |
| グローバル | FeedbackWidget + UpgradePanel（枠枯渇時） | 常設 |

## 3. データモデル
なし（合成）

## 4. バリデーション + エラー
| 条件 | 振る舞い |
|---|---|
| 全保護 API | requireOwner（401 で弾く、stub でない実セッション、P4.46） |
| エラー境界 | React Error Boundary + Sentry（PII マスク、SEC-003） |
| ルート未定義 | 404 ページ |

## 5. NFR + 連携
### 5.1 NFR
- 起動・デプロイ可能（全部品が組み上がる、O57）
- 初回起動でゲストセッション確立 → 即利用可（O22 摩擦最小）
### 5.2 連携
- **全 feature + 全 _shared に依存**（合成）

## 6. タグ別
（合成、最終 target）

## 7. スコープ外
- 各 feature の内部ロジック（既設計）

## 8. 未決事項
現時点で論点なし (2026-06-19)

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
