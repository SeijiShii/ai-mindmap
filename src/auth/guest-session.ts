/**
 * O22(A) client bootstrap: turn the server-issued sign-in ticket
 * (POST /api/auth/guest → createGuestSession) into a real active Clerk session,
 * so a first-time visitor is authenticated as an anonymous guest without any
 * sign-up. The Clerk hooks are injected (O35) so this orchestration is testable
 * without Clerk. The same userId persists after the guest later links an account
 * (O22 B), so guest data carries over.
 */
export interface GuestSessionPorts {
  fetchTicket: () => Promise<{ ticket: string }>;
  createSignIn: (ticket: string) => Promise<{ createdSessionId: string }>;
  setActive: (sessionId: string) => Promise<void>;
}

export async function establishGuestSession(
  ports: GuestSessionPorts,
): Promise<string> {
  const { ticket } = await ports.fetchTicket();
  const { createdSessionId } = await ports.createSignIn(ticket);
  await ports.setActive(createdSessionId);
  return createdSessionId;
}
