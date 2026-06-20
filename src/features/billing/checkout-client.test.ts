import { describe, it, expect, vi, afterEach } from "vitest";
import { startCheckout } from "./checkout-client";

afterEach(() => vi.restoreAllMocks());

describe("startCheckout (UC7)", () => {
  it("posts the pack and redirects to the returned url", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ url: "https://checkout.stripe.test/s/1" }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const redirect = vi.fn();
    await startCheckout(2, redirect);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/billing/checkout",
      expect.objectContaining({ method: "POST" }),
    );
    expect(redirect).toHaveBeenCalledWith("https://checkout.stripe.test/s/1");
  });

  it("throws on a non-ok response (no redirect)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 })),
    );
    const redirect = vi.fn();
    await expect(startCheckout(1, redirect)).rejects.toThrow();
    expect(redirect).not.toHaveBeenCalled();
  });
});
