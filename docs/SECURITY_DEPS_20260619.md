<!-- auto-generated-start -->
# 依存ライブラリ脆弱性スキャン結果

**スキャン日**: 2026-06-19
**対象**: package-lock.json
**スキャナ**: npm audit

## 1. サマリ（対応後）
- Critical: 0（対応前 1）
- High: 0（対応前 2）
- Moderate: 4（記載のみ）
- **対応前の Critical/High はすべて解消**

## 2. 対応した Critical/High
| CVE/Advisory | パッケージ | severity | 対応 |
|---|---|---|---|
| SQL injection via improperly escaped SQL identifiers | drizzle-orm | High（**production**） | 0.36→**0.45.2** へ upgrade（解消）。※本 PJ は静的スキーマ識別子のみ使用で直接の悪用余地は低かったが要件として解消 |
| Vitest UI server arbitrary file read/exec（@vitest/mocker） | vitest | Critical（**dev-only**） | vitest **3.2.6** へ upgrade（解消） |
| Vite dev server path traversal / fs.deny bypass | vite | High（**dev-only**） | vite **6.4.3** へ upgrade（解消） |

> dev-only 脆弱性（vitest UI / vite dev server）は production バンドルに含まれず実運用リスクは低かったが、toolchain bump で clean に解消（112 tests 維持）。

## 3. Moderate 以下（記載のみ、4 件）
- 推移的依存の moderate 4 件。実運用影響は低。次回 Dependabot で追従。

## 4. 自動更新メカニズム
- [x] `.github/dependabot.yml`（weekly）設定済
- [x] CI に `npm audit --audit-level=high` 組み込み済（`.github/workflows/ci.yml`）
<!-- auto-generated-end -->
