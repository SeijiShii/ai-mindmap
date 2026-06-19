import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { InfoButton } from "../components/ui/InfoButton";
import { MapPage } from "../features/mindmap-canvas/MapPage";

/**
 * Composition root (O57): providers + router + app shell. Routes wire feature
 * screens; the footer carries the legal links (O55 reachability). Kept provider-
 * agnostic for Clerk so it renders in tests (the real ClerkProvider wraps this
 * in main.tsx).
 */
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function HomePage() {
  return (
    <main className="p-4">
      <p className="mb-4 text-text-muted">
        会議や講義を聞きながら、AI と往復でマインドマップを育てましょう。
      </p>
      <Link className="text-primary underline" to="/map/demo">
        マップをひらく
      </Link>
    </main>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/map/:id"
        element={<MapPage nodes={[]} edges={[]} onSend={async () => {}} />}
      />
      <Route
        path="/legal/privacy"
        element={<main className="p-4">プライバシーポリシー</main>}
      />
      <Route
        path="/legal/terms"
        element={<main className="p-4">利用規約</main>}
      />
      <Route
        path="/legal/specified-commercial-transactions"
        element={<main className="p-4">特定商取引法に基づく表記</main>}
      />
      <Route
        path="*"
        element={<main className="p-4">ページが見つかりません</main>}
      />
    </Routes>
  );
}

export function AppShell({ initialPath = "/" }: { initialPath?: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <div className="flex min-h-screen flex-col">
          <AppHeader
            title="AIと一緒に描くマインドマップ"
            actions={
              <InfoButton>
                会議を聞きながら AI と往復で考えをほどくマインドマップです。
              </InfoButton>
            }
          />
          <div className="flex-1">
            <AppRoutes />
          </div>
          <footer className="flex flex-wrap gap-3 border-t border-border px-4 py-3 text-xs text-text-muted">
            <Link to="/legal/privacy">プライバシー</Link>
            <Link to="/legal/terms">利用規約</Link>
            <Link to="/legal/specified-commercial-transactions">
              特商法表記
            </Link>
          </footer>
        </div>
      </MemoryRouter>
    </QueryClientProvider>
  );
}
