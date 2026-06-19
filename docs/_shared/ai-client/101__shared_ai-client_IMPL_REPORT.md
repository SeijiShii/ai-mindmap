# 実装レポート: _shared/ai-client

## 実装日時
2026-06-19 (JST)

## モード
feature (cross-cutting)

## 関連ドキュメント
- 001/002/003 + [AI_LOG](../AI_LOG/D20260619_024_tdd__shared_ai-client.md)

## 変更一覧
### Phase 1: pii-scrub + prompts
- `src/ai/pii-scrub.ts` — メール/電話/長数字列マスク（SEC-003）
- `src/ai/prompts.ts` — system/user 分離 + `<user_text>` をデータとして明示（SEC-002 injection 耐性）、出力 JSON 制約
### Phase 2: 構造化呼び出し（injectable ChatFn O35）
- `src/ai/client.ts` — `callStructure` / `callExpand`：scrub → prompt → ChatFn → Zod parse → リトライ(2)→ フォールバック(空)。空 delta は no-op（コスト節約）。usage 抽出
### Phase 3.5: 実 SDK
- `src/ai/openai.ts` — gpt-4o-mini（store=false / json response_format）の実 ChatFn（API キーはサーバ side）

## 実装計画からの差分
計画通り。ChatFn を injectable にして OpenAI を mock 注入でテスト（実 API 不要）。

## PR Description
### タイトル
_shared/ai-client: gpt-4o-mini ラッパ（SEC-002/003）
### 変更内容
- PII scrub + injection 耐性プロンプト + 構造化 Zod parse/リトライ/フォールバック + usage
### テスト
- 9/9 パス（scrub/prompts/structure/expand、injection・parse 失敗・API エラー網羅）、typecheck clean（累計 42/42）
