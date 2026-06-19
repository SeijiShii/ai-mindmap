# live-capture 実装計画書

> **入力**: `./001_live-capture_SPEC.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/features/live-capture/useSpeechRecognition.ts` | Web Speech API フック（interim/final/エラー/フォールバック） | — | 110 |
| `src/features/live-capture/CapturePanel.tsx` | 聞き取り/テキスト入力 UI + ライブ表示 | _shared/ui | 120 |
| `src/features/live-capture/delta-buffer.ts` | final テキストのデバウンス + 送出キュー（オフライン対応） | — | 80 |
| `src/features/live-capture/send-delta.ts` | ai-structuring 呼び出し + 枠チェック | ai-structuring, cost-tracking | 50 |

## 2. 実装 Phase 分割
### Phase 1: delta-buffer（純ロジック、デバウンス/キュー）
- テスト: 句点/文字数デバウンス、オフラインキュー → flush
### Phase 2: useSpeechRecognition（フォールバック分岐）
- テスト: 非対応/不許可フォールバック（mock SpeechRecognition）
### Phase 3: CapturePanel + send-delta 配線
- テスト: 入力 → 送出、枠枯渇案内

## 3. 依存関係順序
```
delta-buffer → useSpeechRecognition → send-delta → CapturePanel
```

## 4. 既存ファイルへの影響
なし（_shared 消費）

## 5. 横断への変更
なし（ai-structuring/cost-tracking/ui を利用）

## 6. リスク
- Web Speech API はブラウザ差大（Chrome 中心）→ 非対応フォールバックを必ずテスト
- 過送出によるコスト増 → デバウンス必須（論点-001）

## 7. DoD
- [ ] Phase 1-3 完了、フォールバック/デバウンス/オフラインキュー green
- [ ] E2E（004）green（テキスト入力経路は headless 可、音声は mock/手動）
- [ ] 視覚レビューは Design gate

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
