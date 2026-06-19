import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { prepareFeedback } from "./feedback/context";
import { MemoryRouter } from "react-router-dom";
import { UpgradePanel } from "./billing/UpgradePanel";
import { DeleteAccountPanel } from "./legal/DeleteAccountPanel";
import { FeedbackWidget } from "./feedback/FeedbackWidget";
import { MapList } from "./map-management/MapList";

describe("billing UpgradePanel (O43 price transparency)", () => {
  it("shows the price and value before the CTA", () => {
    render(<UpgradePanel onCheckout={() => {}} />);
    const text = document.body.textContent ?? "";
    const priceIdx = text.indexOf("100 円");
    const ctaIdx = text.indexOf("100 円で追加する");
    expect(priceIdx).toBeGreaterThanOrEqual(0);
    expect(text).toMatch(/約 \d+ 回ぶん/); // 対価が明示
    expect(priceIdx).toBeLessThan(ctaIdx); // 金額が CTA より前
  });
});

describe("legal DeleteAccountPanel (O54 two-step)", () => {
  it("requires a second confirm before deleting", async () => {
    const onDelete = vi.fn(async () => {});
    render(<DeleteAccountPanel onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: "全データを削除" }));
    expect(
      screen.getByText("この操作は取り消せません。本当に削除しますか?"),
    ).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: "削除する（取り消せません）" }),
    );
    expect(onDelete).toHaveBeenCalledOnce();
  });
});

describe("feedback FeedbackWidget (O40)", () => {
  it("sends a like reaction with scrubbed context", async () => {
    const onSend = vi.fn<
      (p: ReturnType<typeof prepareFeedback>) => Promise<void>
    >(async () => {});
    render(
      <FeedbackWidget
        context={{
          route: "/map/1",
          appVersion: "0.1",
          userAgent: "UA",
          at: "t",
        }}
        onSend={onSend}
      />,
    );
    fireEvent.click(screen.getByLabelText("よい"));
    expect(onSend).toHaveBeenCalledOnce();
    expect(onSend.mock.calls[0][0]).toMatchObject({
      kind: "like",
      service: "ai-mindmap",
    });
  });
});

describe("map-management MapList", () => {
  it("shows empty state and create action", () => {
    const onCreate = vi.fn();
    render(
      <MemoryRouter>
        <MapList maps={[]} onCreate={onCreate} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/まだマップがありません/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "あたらしいマップ" }));
    expect(onCreate).toHaveBeenCalledOnce();
  });
  it("links each map to its canvas", () => {
    render(
      <MemoryRouter>
        <MapList maps={[{ id: "m1", title: "企画メモ" }]} onCreate={() => {}} />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: "企画メモ" });
    expect(link).toHaveAttribute("href", "/map/m1");
  });
});
