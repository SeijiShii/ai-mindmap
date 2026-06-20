import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
/**
 * O22(B) progressive-auth control for the header — the両輪 the audit flagged as
 * missing:
 *  - guests use a §1.7 self-signed guest JWT (provisioned lazily by useAuthToken
 *    on the first /api call; Clerk-decoupled so no owner churn);
 *  - <UserButton> exposes "manage account" (link an email/OAuth = upgrade) AND
 *    sign-out;
 *  - <SignInButton> lets a signed-out user log into an existing account.
 * Mounted from main.tsx (inside ClerkProvider); AppShell stays Clerk-agnostic.
 */
export function AuthControl() {
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
