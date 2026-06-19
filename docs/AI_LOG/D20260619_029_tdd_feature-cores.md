# AI_LOG セッション D20260619_029 — /flow:tdd (feature cores)

**実行日時**: 2026-06-19 / **モード**: feature / **対象**: 8 機能コア(mindmap-canvas/export/live-capture/ai-expand/billing/feedback/legal/map-management)
**状態**: 完了 / **decision**: D20260619-065〜072

## 主要決定サマリ
8 機能のコアロジックを実装・テスト green(全体 85/85)。UI/API ルートは app-shell 合成で配線(O35 injectable)。

## Decisions
```yaml
- id: D20260619-065
  timestamp: 2026-06-19T22:10:00+09:00
  command: /flow:tdd
  phase: Step 6 / mindmap-canvas
  question: mindmap-canvas コア実装結果
  chosen: green。wouldCreateCycle で reconnect 時の循環を防止。UI/API は app-shell 合成
  chosen_type: auto-recommended
  depends_on: []
  context: feature コアロジックを純ロジックで実装・検証(O35 injectable)。
- id: D20260619-066
  timestamp: 2026-06-19T22:11:00+09:00
  command: /flow:tdd
  phase: Step 6 / export
  question: export コア実装結果
  chosen: green。toMarkdown(入れ子)/toOutline(タブ)/escapeFormula(CSV injection SEC-002)。UI/API は app-shell 合成
  chosen_type: auto-recommended
  depends_on: []
  context: feature コアロジックを純ロジックで実装・検証(O35 injectable)。
- id: D20260619-067
  timestamp: 2026-06-19T22:12:00+09:00
  command: /flow:tdd
  phase: Step 6 / live-capture
  question: live-capture コア実装結果
  chosen: green。句点/文字数デバウンス + オフラインキュー/drain(論点-001)。UI/API は app-shell 合成
  chosen_type: auto-recommended
  depends_on: []
  context: feature コアロジックを純ロジックで実装・検証(O35 injectable)。
- id: D20260619-068
  timestamp: 2026-06-19T22:13:00+09:00
  command: /flow:tdd
  phase: Step 6 / ai-expand
  question: ai-expand コア実装結果
  chosen: green。対象+親+兄弟+子の文脈要約。UI/API は app-shell 合成
  chosen_type: auto-recommended
  depends_on: []
  context: feature コアロジックを純ロジックで実装・検証(O35 injectable)。
- id: D20260619-069
  timestamp: 2026-06-19T22:14:00+09:00
  command: /flow:tdd
  phase: Step 6 / billing
  question: billing コア実装結果
  chosen: green。processCheckoutEvent 冪等 + TOKENS_PER_PACK 付与。UI/API は app-shell 合成
  chosen_type: auto-recommended
  depends_on: []
  context: feature コアロジックを純ロジックで実装・検証(O35 injectable)。
- id: D20260619-070
  timestamp: 2026-06-19T22:15:00+09:00
  command: /flow:tdd
  phase: Step 6 / feedback
  question: feedback コア実装結果
  chosen: green。送信前 PII scrub(text/UA, SEC-003 O40)。UI/API は app-shell 合成
  chosen_type: auto-recommended
  depends_on: []
  context: feature コアロジックを純ロジックで実装・検証(O35 injectable)。
- id: D20260619-071
  timestamp: 2026-06-19T22:16:00+09:00
  command: /flow:tdd
  phase: Step 6 / legal
  question: legal コア実装結果
  chosen: green。owner-scoped cascade 削除(maps→usage→user)。UI/API は app-shell 合成
  chosen_type: auto-recommended
  depends_on: []
  context: feature コアロジックを純ロジックで実装・検証(O35 injectable)。
- id: D20260619-072
  timestamp: 2026-06-19T22:17:00+09:00
  command: /flow:tdd
  phase: Step 6 / map-management
  question: map-management コア実装結果
  chosen: green。createMapsRepo: 全 CRUD で owner 照合(SEC-001, 他人 404)。UI/API は app-shell 合成
  chosen_type: auto-recommended
  depends_on: []
  context: feature コアロジックを純ロジックで実装・検証(O35 injectable)。
```
