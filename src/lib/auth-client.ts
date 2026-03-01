import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, emailOTPClient } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
  plugins: [
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
  ],
});

// Export hooks for easy access
export const { 
  useSession, 
  signIn, 
  signUp, 
  signOut 
} = authClient;
