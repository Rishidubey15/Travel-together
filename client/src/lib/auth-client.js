import { createAuthClient } from "better-auth/react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const authClient = createAuthClient({
  baseURL: `${apiUrl}/api/auth`,
});

export const orgVerifer = createAuthClient({
  baseURL: `${apiUrl}/api/org-verify`,
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
