/** プライバシーポリシー（ドラフト、公開前に内容確認）。O54 ゲスト特例を反映。 */
export function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 text-sm leading-relaxed">
      <h1 className="mb-3 text-lg font-medium">プライバシーポリシー</h1>
      <p className="mb-2 text-text-muted">最終更新: 2026-06-19（ドラフト）</p>

      <h2 className="mt-4 font-medium">1. 取得する情報</h2>
      <p>認証プロバイダ経由のユーザー識別子、あなたが作成したマップ・ノード等の思考内容、AI 利用ログ。アクセス解析は cookieless（IP 匿名化）で Cookie バナーは不要です。</p>

      <h2 className="mt-4 font-medium">2. 音声・AI 送信の取り扱い（重要）</h2>
      <p>
        音声は保存しません。ライブ文字起こしはブラウザ内で行い、確定したテキストのみを送信します。AI
        機能では要点抽出・枝提案のためテキストを外部 AI へ送信し、送信前にメール・電話番号等をマスクします。送信データは学習に使われない設定で送ります。
      </p>

      <h2 className="mt-4 font-medium">3. データ主体の権利（削除・確認）</h2>
      <p>
        ゲスト利用では運営側でご本人を特定できないため、データの確認・削除は窓口へのご請求ではなく、
        <strong>アプリ内のセルフサービス機能でご自身で行えます</strong>
        。自分のマップは常時閲覧・書き出しでき、設定の「全データ削除」からすべてを削除できます。アカウント連携後は窓口でも対応します。
      </p>

      <h2 className="mt-4 font-medium">4. 第三者提供・保管</h2>
      <p>法令に基づく場合を除き第三者提供はしません。データは削除操作で速やかに消去します。</p>
    </main>
  );
}
