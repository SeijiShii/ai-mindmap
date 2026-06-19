/** 利用規約（ドラフト、公開前に内容確認）。 */
export function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 text-sm leading-relaxed">
      <h1 className="mb-3 text-lg font-medium">利用規約</h1>
      <p className="mb-2 text-text-muted">最終更新: 2026-06-19（ドラフト）</p>

      <h2 className="mt-4 font-medium">1. サービス内容</h2>
      <p>本サービスは AI と人が往復で育てる共同編集型マインドマップを提供します。AI の出力は補助であり、内容の正確性を保証しません。</p>

      <h2 className="mt-4 font-medium">2. 利用者の責任・禁止事項</h2>
      <p>法令・公序良俗に反する利用、第三者の権利侵害、サービスへの不正アクセス等を禁止します。作成内容の管理は利用者の責任で行ってください。</p>

      <h2 className="mt-4 font-medium">3. 知的財産</h2>
      <p>あなたが作成したマップの内容はあなたに帰属します。本サービス自体の権利は運営者に帰属します。</p>

      <h2 className="mt-4 font-medium">4. 課金</h2>
      <p>本体は無料です。AI のお手伝いの無料枠を超えた場合、100 円の買い切りで追加枠を購入できます（継続課金なし）。</p>

      <h2 className="mt-4 font-medium">5. 免責・準拠法</h2>
      <p>本サービスは現状有姿で提供されます。損害賠償は法令の認める範囲に限ります。準拠法は日本法とします。</p>
    </main>
  );
}
