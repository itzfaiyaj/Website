import { createAuthClient } from "better-auth/react";
import type { Me } from "./types";

// Same-origin: the Vite dev server proxies /api to Express, and in production Express serves the app.
export const authClient = createAuthClient();

export function useMe() {
  const session = authClient.useSession();
  return { me: (session.data?.user ?? null) as unknown as Me | null, loading: session.isPending };
}
