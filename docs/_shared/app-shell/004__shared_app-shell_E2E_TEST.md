# _shared/app-shell E2E テスト計画（統合スモーク）

> **入力**: `./001__shared_app-shell_SPEC.md`, `../../concept.md` §1.1
> **最終更新**: 2026-06-19
> **注記**: cross-cutting だが合成 target のため統合スモーク E2E を実施（O57、全部品が動くアプリに組み上がるか）

---

## 1. ユーザージャーニー（フルパス統合）
| シナリオ ID | 前提 | 操作 | 期待結果 |
|---|---|---|---|
| APP-S1 (boot) | 初回 | アプリ起動 | ゲストセッション確立、入口リード/InfoButton 表示（O41） |
| APP-S2 (e2e core) | ゲスト | マップ作成 → テキスト入力 → AI 逐次マージ(mock) → 手編集 → 枝を広げる(mock) → エクスポート | コア体験が一気通貫で動く |
| APP-S3 (protected) | — | 保護 API を未認証で叩く | 401（P4.46） |
| APP-S4 (legal) | — | フッタ → /legal/* | 到達（O55） |
| APP-S5 (quota→billing) | 枠枯渇 mock | AI 操作 | UpgradePanel（O43 価格透明）→ Checkout(mock) |

## 2. 環境要件
| 項目 | 要件 |
|---|---|
| ブラウザ | Chromium |
| 認証 | ゲストセッション（実経路、stub でない、P4.46） |
| 外部 SDK | OpenAI/Stripe は mock（sandbox、実 API/課金なし） |

## 3. データセットアップ
- Seed: なし（初回起動から作る）
- Cleanup: テストデータ削除

## 4. タグ別追加
- 統合: 全 feature が画面/API に接続されている（孤立部品なし、O57）

## 5. レイアウト・ビジュアル検証（O34）
- **Level 1 (snapshot)**: ✅ — 主要画面（一覧/キャンバス/法務/課金）
- **Level 2 (意味的)**: ✅ — 入口リード（O41）、フッタ法務導線（O55）、人/AI 区別、価格透明（O43）
- **Level 3 (AI Vision)**: ❌ — コスト回避（重要 LP がないため）

## 6. 期待 KPI
- 成功率 100%、P4.46（401）+ O55 + O43 必須 pass、コア体験 APP-S2 完走

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
