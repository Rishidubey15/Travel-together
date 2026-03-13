/**
 * Auth-related REST routes.
 * Primary auth (sign up, sign in, sign out, session) is handled by Better Auth at /api/auth/*
 * This file can be used for custom auth-related endpoints if needed.
 */

import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

const router = Router();

router.get("/session", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  res.json(session);
});

export default router;
