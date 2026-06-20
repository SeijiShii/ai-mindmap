import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useGuestSession } from "./useGuestSession";

/**
 * O22(B) progressive-auth control for the header — the両輪 the audit flagged as
 * missing:
 *  - guests get a real session (useGuestSession, O22 A);
 *  - <UserButton> exposes "manage account" (link an email/OAuth = upgrade, data
 *    carries over on the same userId) AND sign-out;
 *  - <SignInButton> lets a signed-out user log into an existing account.
 * Mounted from main.tsx (inside ClerkProvider); AppShell stays Clerk-agnostic.
 */
export function AuthControl() {
  useGuestSession();
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="rounded-md border border-border px-3 py-1 text-sm font-medium hover:bg-surface-hover">
            ログイン / 登録
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  );
}
