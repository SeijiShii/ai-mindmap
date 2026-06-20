/**
 * Client side of UC7: POST /api/billing/checkout (owner-scoped on the server) and
 * redirect to the returned Stripe Checkout URL. Inject `redirect` for testability.
 */
export async function startCheckout(
  pack = 1,
  redirect: (url: string) => void = (u) => {
    window.location.href = u;
  },
): Promise<void> {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ pack }),
  });
  if (!res.ok) throw new Error(`checkout failed: ${res.status}`);
  const { url } = (await res.json()) as { url: string };
  redirect(url);
}
