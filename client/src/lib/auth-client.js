import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api/auth",
});

export const orgVerifer = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api/org-verify",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
