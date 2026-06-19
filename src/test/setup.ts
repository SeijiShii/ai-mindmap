import "@testing-library/jest-dom";

// jsdom lacks ResizeObserver (used by React Flow). Polyfill for component tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as { ResizeObserver?: unknown }).ResizeObserver =
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver ??
  ResizeObserverStub;
