import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { toFlowNodes, toFlowEdges, nodeClass } from "./mindmap-canvas/to-flow";
import { CapturePanel } from "./live-capture/CapturePanel";
import type { MindMapNode, MindMapEdge } from "../types/domain";

const node = (o: Partial<MindMapNode>): MindMapNode => ({
  id: "n1",
  mapId: "m1",
  parentId: null,
  text: "t",
  posX: 0,
  posY: 0,
  source: "human",
  status: "confirmed",
  createdAt: new Date(),
  ...o,
});

describe("mindmap-canvas to-flow (human/AI visual distinction)", () => {
  it("human nodes get the solid class", () => {
    expect(nodeClass({ source: "human", status: "confirmed" })).toBe(
      "node-human",
    );
  });
  it("AI suggested nodes get the dashed class", () => {
    expect(nodeClass({ source: "ai", status: "suggested" })).toBe(
      "node-ai-suggested",
    );
  });
  it("maps domain nodes/edges to flow shapes", () => {
    const fn = toFlowNodes([node({ id: "a", text: "幹", posX: 5, posY: 6 })]);
    expect(fn[0]).toMatchObject({
      id: "a",
      position: { x: 5, y: 6 },
      data: { label: "幹" },
    });
    const fe = toFlowEdges([
      {
        id: "e1",
        mapId: "m1",
        sourceNodeId: "a",
        targetNodeId: "b",
        kind: "relation",
      } as MindMapEdge,
    ]);
    expect(fe[0]).toMatchObject({
      source: "a",
      target: "b",
      className: "edge-relation",
    });
  });
});

describe("live-capture CapturePanel", () => {
  it("sends trimmed text and clears the input", () => {
    const onSend = vi.fn();
    render(<CapturePanel onSend={onSend} />);
    const ta = screen.getByLabelText("メモ・文字起こし") as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "  会議の要点  " } });
    fireEvent.click(screen.getByRole("button", { name: "AIでマップに" }));
    expect(onSend).toHaveBeenCalledWith("会議の要点");
    expect(ta.value).toBe("");
  });
  it("does not send empty text", () => {
    const onSend = vi.fn();
    render(<CapturePanel onSend={onSend} />);
    fireEvent.click(screen.getByRole("button", { name: "AIでマップに" }));
    expect(onSend).not.toHaveBeenCalled();
  });
  it("O45: shows the stage spinner while busy", () => {
    render(<CapturePanel onSend={() => {}} busy />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "要点を聞き取っています…",
    );
  });
});
