# live-capture E2E テスト計画

> **入力**: `./001_live-capture_SPEC.md`, `../concept.md` §1.1
> **最終更新**: 2026-06-19

---

## 1. ユーザージャーニー
| シナリオ ID | 前提 | 操作 | 期待結果 |
|---|---|---|---|
| LC-S1 (happy/text) | マップ選択済 | テキスト入力 → 送信 | ツリーにノードが追加される（ai-structuring mock） |
| LC-S2 (fallback) | Web Speech 非対応に偽装 | ページ表示 | テキスト入力のみ表示 + 案内文 |
| LC-S3 (quota) | 枠枯渇に偽装 | 送信 | 100円追加案内、入力は継続可 |
| LC-S4 (offline) | オフライン化 | テキスト送信 → 復帰 | キュー → 復帰で反映 |

## 2. 環境要件
| 項目 | 要件 |
|---|---|
| ブラウザ | Chromium |
| オフライン | ✅（LC-S4） |
| マイク | mock（音声は自動化対象外、テキスト経路で検証） |
| 認証 | ゲストセッション（テストユーザー） |
| AI | ai-structuring を mock（実 API 叩かない、sandbox） |

## 3. データセットアップ
- Seed: ゲストユーザー + 空マップ 1 件
- Cleanup: テストマップ削除

## 4. タグ別追加シナリオ
- realtime: 連続送信でデバウンス（過送出しない）を確認
- offline-critical: LC-S4

## 5. レイアウト・ビジュアル検証（O34）
- **Level 1 (snapshot)**: ✅ — CapturePanel の idle/listening 状態
- **Level 2 (意味的)**: ✅ — 入力欄がフッタ固定、聞き取りボタンが視認可能、StageSpinner 表示（5 点）
- **Level 3 (AI Vision)**: ❌ — 重要 LP でないため不採用（コスト回避）

## 6. 期待 KPI
- シナリオ成功率 100%、Level1 差分 0、Level2 pass 100%

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
