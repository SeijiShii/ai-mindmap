/** 特定商取引法に基づく表記（ドラフト、有料公開前に整備）。 */
export function SctPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 text-sm leading-relaxed">
      <h1 className="mb-3 text-lg font-medium">特定商取引法に基づく表記</h1>
      <p className="mb-2 text-text-muted">最終更新: 2026-06-19（ドラフト）</p>
      <dl className="grid grid-cols-[8rem_1fr] gap-y-2">
        <dt className="text-text-muted">販売事業者</dt>
        <dd>（運営者名）</dd>
        <dt className="text-text-muted">所在地</dt>
        <dd>ご請求があれば遅滞なく開示します。</dd>
        <dt className="text-text-muted">連絡先</dt>
        <dd>（メールアドレス）</dd>
        <dt className="text-text-muted">販売価格</dt>
        <dd>AI 追加枠 100 円（買い切り・税込）。本体は無料。</dd>
        <dt className="text-text-muted">支払方法・時期</dt>
        <dd>クレジットカード（Stripe）。購入時に決済。</dd>
        <dt className="text-text-muted">提供時期</dt>
        <dd>決済完了後すぐに追加枠が反映されます。</dd>
        <dt className="text-text-muted">返品・キャンセル</dt>
        <dd>デジタルサービスの性質上、購入後の返金は原則不可とします。</dd>
      </dl>
    </main>
  );
}
