# live-capture 機能仕様書

> **役割**: ライブ音声認識（Web Speech API）+ 手動テキスト入力。ストリーミングテキストを逐次取り込み ai-structuring へ渡す。
> **タグ**: feature, realtime, offline-critical(部分)
> **最終更新**: 2026-06-19
> **入力**: `../concept.md` §1.1 UC1/UC2, `../design/design-system.md`

---

## 1. 詳細 UC

### UC1: ライブ聞き取り（concept §1.1 #1）
- **トリガー**: 「聞き取り開始」ボタン
- **前提**: マイク許可、Chrome 系（Web Speech API）、マップ選択済
- **入力**: マイク音声 → Web Speech API でテキスト化（interim + final）
- **処理**: final 確定テキストを delta としてバッファ → 一定量/間隔で ai-structuring へ送出（PII scrub 後）
- **出力**: 文字起こしのライブ表示 + ツリーが逐次育つ（mindmap-canvas 更新）
- **例外**: マイク不許可 → テキスト入力にフォールバック案内。Web Speech 非対応ブラウザ → テキスト入力のみ + 案内

### UC2: 手動テキスト入力（concept §1.1 #2）
- **トリガー**: テキスト入力欄に書く/貼る → 送信
- **処理**: 同様に ai-structuring へ delta 送出
- **出力**: ツリー更新

## 2. 入出力
### 2.1 内部 API
| 処理 | 入力 | 出力 |
|---|---|---|
| 送出 | StructureInput{mapId, transcriptDelta} | StructureResult（ai-structuring 経由） |

### 2.2 画面入力
| フィールド | 型 | 必須 | バリデーション |
|---|---|---|---|
| 手動テキスト | string | — | 空は no-op |
| 聞き取り状態 | enum(idle/listening/paused) | — | — |

### 2.3 副作用
- ai-structuring 呼び出し（→ nodes/edges 更新、usage_log）
- **音声は保存しない**（テキストのみ、ブラウザ内で破棄）

## 3. データモデル
新規エンティティなし（nodes/edges は ai-structuring 経由で _shared/db）

## 4. バリデーション + エラー
| 条件 | 振る舞い |
|---|---|
| マイク不許可 | テキスト入力にフォールバック |
| Web Speech 非対応 | テキストのみ + 案内（O38 平易文言） |
| ネット断（オフライン） | 文字起こしはローカル継続不可（Web Speech はオンライン依存）→ テキスト手入力は可、AI 送出はキューして復帰時 |
| AI 枠枯渇 | checkQuota blocked → 「今月の AI を使い切りました（100円で追加）」案内、文字起こし表示は継続 |

## 5. NFR + 連携
### 5.1 NFR
- ライブ表示は低遅延、final 確定で delta 送出（過送出を避けるデバウンス）
- 送出前 PII scrub（SEC-003、ai-client が担うがフロントでも明示）
### 5.2 連携
| 連携先 | 依存 |
|---|---|
| ai-structuring | delta 送出 |
| mindmap-canvas | ツリー更新の反映 |
| _shared/cost-tracking | 枠チェック |
| _shared/ui | StageSpinner（進捗体験 O45）/ 入力コンポーネント |

## 6. タグ別
### 6.1 realtime
- Web Speech interim/final、final のみ送出、送出間隔デバウンス（例: 数秒 or 句点）
### 6.2 offline-critical（部分）
- オフライン時はテキスト手入力のみ、AI 送出はキュー → 復帰で flush

## 7. スコープ外
- 音声保存・録音アーカイブ（v2）
- Whisper/チャンク録音（v2）

## 8. 未決事項
### [論点-001] AI 送出のトリガ粒度
- **影響範囲**: ライブ体験の自然さ + コスト
- **問い**: 何秒/何文字/句点ごとに delta を送るか（高頻度=コスト増、低頻度=育ちが遅い）
- **推奨**: 「final 確定 + 一定文字数 or 無音区切り」でデバウンス。理由: コストと体験のバランス、§4.6 トークン消費に直結
- **判断期限**: tdd 実装時（concept §8 論点-001 無料枠設計と連動）
- **担当**: 本人

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
