# AI_LOG セッション D20260620_004 — /flow:release (ai-mindmap 初回リリース)

**実行日時**: 2026-06-20 (+09:00)
**コマンド**: /flow:release
**状態**: 進行中 (Phase 1 — Class C FILL)
**含まれる decision**: D20260620-007〜

## 主要決定サマリ
| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260620-007 | live 化状態判定 | pre-release 初回 (.env.local/.env.production.local 不在 → test/dev のまま)。§1.0c prod-direct 既定 | auto-recommended |
| D20260620-008 | 公開ドメイン (§3.2 上流依存) | mindmap.givers.work (concept §4.7 明示) | explicit-choice |

## Decisions
```yaml
- id: D20260620-007
  timestamp: 2026-06-20T17:20:00+09:00
  command: /flow:release
  phase: §1.0 / live 化判定
  question: live 化状態
  chosen: pre-release 初回 (test/dev のまま)。§1.0c microservice fleet = prod-direct 既定 (billing/auth/AI で high-risk のため --dev-first opt-in を 1 行 recommend、block せず)
  chosen_type: auto-recommended
  context: |
    SoT 順序判定: ① .env.production.local 不在 ② .env.local 不在 ③ 初回。
    deploy 方法 = Vercel (vercel.json なし、scaffold を Phase 3 で生成)。
    git remote なし → §3.0a GitHub setup 要。"type":module + extensionless import → O51 bundle 要。

- id: D20260620-008
  timestamp: 2026-06-20T17:21:00+09:00
  command: /flow:release
  phase: §3.2 / 公開ドメイン確定 (依存グラフ上流)
  question: 公開サブドメイン
  chosen: mindmap.givers.work
  chosen_type: explicit-choice
  depends_on: [D20260620-007]
  context: |
    concept §4.7 = mindmap.<domain>、保有ドメイン givers.work。
    確定 webhook EP = https://mindmap.givers.work/api/billing/webhook (実コード api/billing/webhook.ts)。
    Clerk production instance / 告知 URL もこのドメインに依存 (CF-20260531-001 依存グラフ)。
```
