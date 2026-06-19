# live-capture 単体テスト計画

> **入力**: `./001_live-capture_SPEC.md`, `./002_live-capture_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | delta-buffer | 句点/文字数でデバウンス送出 |
| N2 | useSpeechRecognition final | final テキストがバッファへ |
| N3 | send-delta | 枠 OK → ai-structuring 呼び出し |
| N4 | 手動テキスト | 送信 → delta 送出 |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | Web Speech 非対応 | テキスト入力フォールバック表示 |
| E2 | マイク不許可 | フォールバック案内 |
| E3 | 枠枯渇 | 100円追加案内、文字起こし表示は継続 |
| E4 | オフライン | AI 送出キュー、復帰で flush |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | 空 delta | 空 | no-op（送出しない） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| SpeechRecognition | mock（interim/final/error 注入） |
| ai-structuring | spy |
| cost-tracking | mock（blocked 切替） |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
_shared/ui, ai-structuring, cost-tracking

## 5. テスト実行環境
Vitest + @testing-library/react（jsdom、SpeechRecognition は mock）

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
