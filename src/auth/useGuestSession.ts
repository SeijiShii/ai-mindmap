import { useEffect, useRef } from "react";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { establishGuestSession } from "./guest-session";

/**
 * Establishes an anonymous guest session once Clerk is loaded and nobody is
 * signed in (O22 A). Thin wrapper over establishGuestSession; the actual
 * orchestration is unit-tested there.
 */
export function useGuestSession(): void {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, setActive } = useSignIn();
  const started = useRef(false);

  useEffect(() => {
    if (!isLoaded || isSignedIn || started.current || !signIn || !setActive)
      return;
    started.current = true;
    establishGuestSession({
      fetchTicket: async () => {
        const res = await fetch("/api/auth/guest", { method: "POST" });
        if (!res.ok) throw new Error(`guest bootstrap failed: ${res.status}`);
        return res.json();
      },
      createSignIn: async (ticket) => {
        const r = await signIn.create({ strategy: "ticket", ticket });
        return { createdSessionId: r.createdSessionId! };
      },
      setActive: async (sessionId) => {
        await setActive({ session: sessionId });
      },
    }).catch(() => {
      started.current = false; // allow a retry on the next render
    });
  }, [isLoaded, isSignedIn, signIn, setActive]);
}
