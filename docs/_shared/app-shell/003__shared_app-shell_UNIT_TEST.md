# _shared/app-shell 単体テスト計画

> **入力**: `./001__shared_app-shell_SPEC.md`, `./002__shared_app-shell_PLAN.md`
> **最終更新**: 2026-06-19

---

## 1. テストケース
### 1.1 正常系
| ID | 対象 | 期待 |
|---|---|---|
| N1 | routes | 各ルートが対応画面をレンダリング |
| N2 | AppShell | ヘッダー/フッタ(legal 導線)/FeedbackWidget 常設 |
| N3 | providers | Clerk/Query/テーマ が App をラップ |
| N4 | ゲストセッション | 起動で匿名サインイン |

### 1.2 異常系
| ID | 対象 | 期待 |
|---|---|---|
| E1 | 保護 API 未認証 | 401（requireOwner、P4.46） |
| E2 | エラー境界 | Error Boundary + Sentry（PII マスク） |
| E3 | 未定義ルート | 404 |

### 1.3 境界値
| ID | 対象 | 境界 | 期待 |
|---|---|---|---|
| B1 | 全ルート inbound link | — | orphaned page なし（O55） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| Clerk | test instance / mock セッション + 実経路（P4.46） |
| API | handler 統合（mock 外部 SDK） |

## 3. カバレッジ目標
行 80% / 分岐 70%

## 4. 既存ユーティリティ依存
全 feature + 全 _shared

## 5. テスト実行環境
Vitest + @testing-library + Playwright（統合は 004）

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-19 | 初版作成 | /flow:feature |
