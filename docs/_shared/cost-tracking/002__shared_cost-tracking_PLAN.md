# _shared/cost-tracking 実装計画書

> **入力**: `./001__shared_cost-tracking_SPEC.md`
> **最終更新**: 2026-06-19

---

## 1. 実装対象ファイル
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `src/cost/pricing.ts` | .env 単価ロード + estimateCost | — | 40 |
| `src/cost/record-usage.ts` | usage_log insert + cost 算出 | _shared/db, pricing | 50 |
| `src/cost/quota.ts` | checkQuota / consumeQuota / 月次 lazy リセット | _shared/db | 110 |
| `src/cost/alert.ts` | 80%/100%/120% アラート（Sentry/メール） | — | 50 |

## 2. 実装 Phase 分割
### Phase 1: pricing + record-usage
- テスト: 単価 × tokens、usage_log 書き込み
### Phase 2: quota（free→topup 消費、lazy リセット）
- テスト: 枠消費順序、reset_at 経過で補充、blocked 判定
### Phase 3: alert
- テスト: 閾値で通知発火（mock）

## 3. 依存関係順序
```
pricing → record-usage → quota → alert
```

## 4. 既存ファイルへの影響
なし

## 5. 横断への変更
_shared/db users/usage_log を更新。ai-client が recordUsage を呼ぶ。

## 6. リスク
- 高頻度書き込み: usage_log は append のみ、集計はインデックス利用
- lazy リセットの競合（同時消費）→ DB レベルの原子更新（条件付き UPDATE）

## 7. DoD
- [ ] Phase 1-3 完了、枠消費/リセット/アラートテスト green
- [ ] .env.example に COST_* 追記
- [ ] E2E スキップ（cross-cutting、課金フロー E2E は billing でカバー）

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
