import { describe, it, expect, vi } from "vitest";
import {
  makeCheckoutHandler,
  makeWebhookHandler,
  WebhookSignatureError,
  type CheckoutDeps,
  type WebhookDeps,
  type WebhookEvent,
} from "./api-billing";
import { TOKENS_PER_PACK } from "../features/billing/webhook";

const UUID = "00000000-0000-4000-8000-000000000000";

function memStore() {
  const seen = new Set<string>();
  return {
    has: async (id: string) => seen.has(id),
    mark: async (id: string) => void seen.add(id),
  };
}

function checkoutReq(body: unknown) {
  return new Request("https://app.test/api/billing/checkout", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
function webhookReq() {
  return new Request("https://app.test/api/billing/webhook", {
    method: "POST",
    headers: { "stripe-signature": "sig_x" },
    body: "raw-payload",
  });
}

describe("makeCheckoutHandler (billing SPEC §2 / O43)", () => {
  function deps(over: Partial<CheckoutDeps> = {}): CheckoutDeps {
    return {
      verify: async () => "owner_1",
      createCheckoutSession: async () => "https://checkout.stripe.test/s/abc",
      ...over,
    };
  }
  it("401 without an owner (guest must still have owner_id, SPEC §4)", async () => {
    const h = makeCheckoutHandler(deps({ verify: async () => null }));
    expect((await h(checkoutReq({ pack: 1 }))).status).toBe(401);
  });
  it("200 returns the Stripe checkout url, owner-scoped", async () => {
    const create = vi.fn(async () => "https://checkout.stripe.test/s/abc");
    const h = makeCheckoutHandler(deps({ createCheckoutSession: create }));
    const res = await h(checkoutReq({ pack: 2 }));
    expect(res.status).toBe(200);
    expect((await res.json()).url).toContain("checkout.stripe.test");
    expect(create).toHaveBeenCalledWith("owner_1", 2, "https://app.test");
  });
  it("clamps pack to [1,10]", async () => {
    const create = vi.fn(async () => "u");
    const h = makeCheckoutHandler(deps({ createCheckoutSession: create }));
    await h(checkoutReq({ pack: 99 }));
    expect(create).toHaveBeenCalledWith("owner_1", 10, "https://app.test");
  });
});

describe("makeWebhookHandler (O64 3-state signature handling)", () => {
  const evt = (over: Partial<WebhookEvent> = {}): WebhookEvent => ({
    id: "evt_1",
    type: "checkout.session.completed",
    ownerId: "owner_1",
    packs: 1,
    ...over,
  });
  function deps(over: Partial<WebhookDeps> = {}): WebhookDeps {
    return {
      verifyEvent: () => evt(),
      store: memStore(),
      grantTopup: vi.fn(async () => {}),
      ...over,
    };
  }

  it("O64 state 1: invalid signature → 400, no top-up", async () => {
    const grant = vi.fn(async () => {});
    const h = makeWebhookHandler(
      deps({
        verifyEvent: () => {
          throw new WebhookSignatureError("bad");
        },
        grantTopup: grant,
      }),
    );
    expect((await h(webhookReq())).status).toBe(400);
    expect(grant).not.toHaveBeenCalled();
  });

  it("O64 state 2: valid signature, irrelevant event → 200 ack, no top-up", async () => {
    const grant = vi.fn(async () => {});
    const h = makeWebhookHandler(
      deps({ verifyEvent: () => evt({ type: "invoice.paid" }), grantTopup: grant }),
    );
    const res = await h(webhookReq());
    expect(res.status).toBe(200);
    expect((await res.json()).ignored).toBe(true);
    expect(grant).not.toHaveBeenCalled();
  });

  it("O64 state 3: valid checkout → 200, grants topup tokens", async () => {
    const grant = vi.fn(async () => {});
    const h = makeWebhookHandler(deps({ grantTopup: grant }));
    const res = await h(webhookReq());
    expect(res.status).toBe(200);
    expect((await res.json()).applied).toBe(true);
    expect(grant).toHaveBeenCalledWith("owner_1", TOKENS_PER_PACK);
  });

  it("idempotent: replaying the same event id grants only once (SPEC §4)", async () => {
    const grant = vi.fn(async () => {});
    const store = memStore();
    const h = makeWebhookHandler(deps({ store, grantTopup: grant }));
    await h(webhookReq());
    await h(webhookReq()); // same evt_1
    expect(grant).toHaveBeenCalledTimes(1);
  });
});

void UUID;
