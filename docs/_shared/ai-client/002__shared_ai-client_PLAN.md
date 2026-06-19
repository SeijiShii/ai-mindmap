# _shared/ai-client 実装計画書

> **入力**: `./001__shared_ai-client_SPEC.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/ai/openai.ts` | OpenAI client（store:false, gpt-4o-mini） | openai | 40 |
| `src/ai/pii-scrub.ts` | 送信前 PII マスク（メール/電話/位置/数字列） | — | 70 |
| `src/ai/call-structure.ts` | 逐次マージプロンプト + Zod parse + リトライ | types, cost-tracking | 100 |
| `src/ai/call-expand.ts` | 枝提案プロンプト + Zod parse | types, cost-tracking | 90 |
| `src/ai/prompts.ts` | システムプロンプト（injection 分離、SEC-002） | — | 60 |

## 2. 実装 Phase 分割（injectable + interface、O35）
### Phase 1: interface（AiClient）+ pii-scrub + prompts
- mock OpenAI でテスト（scrub / プロンプト構築 / Zod parse）
### Phase 2: call-structure / call-expand（mock 注入で green）
- リトライ・フォールバック・usage 抽出
### Phase 3.5: 実 SDK install（openai）+ 実クライアント注入 + 結合（dev key）

## 3. 依存関係順序
```
prompts + pii-scrub → openai → call-structure / call-expand
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
cost-tracking へ usage を渡す（callback or 戻り値）。

## 6. リスク
- prompt injection（SEC-002）: テストに「悪意あるテキスト」ケースを必ず含める
- Zod parse 失敗時の無限リトライ防止（最大 N 回 + フォールバック）

## 7. DoD
- [ ] Phase 1-2 完了、injection/PII/parse テスト green
- [ ] usage が cost-tracking に渡る検証
- [ ] E2E スキップ（cross-cutting、AI フローは ai-structuring/ai-expand の E2E でカバー）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
