/**
 * Auth-related REST routes.
 * Primary auth (sign up, sign in, sign out, session) is handled by Better Auth at /api/auth/*
 * This file can be used for custom auth-related endpoints if needed.
 */

import { json, Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth, orgAuth } from "../auth.js";
import { User, UserOrg } from "../models/OpModel.js";

const Organizations = {
  upes: {},
};

const router = Router();

router.get("/session", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  res.json(session);
});

router.get("/me", async(req,res)=>{
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if(!session){
    return res.status(401).json({
      message: "User Not Authorised"
    })
  }
  const orgDets = await UserOrg.findOne({userId: session.user.id})

  if (orgDets){
    return res.json({user: session.user, orgDetails: orgDets})
  }
  else{
    return res.json({user: session.user})
  }
  
})

router.post("/org/get-verifier", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if(!session){
    return res.status(401).json({
      message: "User Not Authorised"
    })
  }
  const { orgID } = req.body;
  if (!Organizations[orgID]) {
    return res.status(400).json({
      message: "Org id not Found",
    });
  }
  let ghredirect;
  try {
    const resp = await orgAuth.api.signInSocial({
      body: {
        provider: "microsoft",
        callbackURL: "http://localhost:5173/",
        errorCallbackURL: "http://localhost:5173/profile",
        additionalData: {addedUserId: session.user.id, orgID: orgID}
      },
      asResponse: true,
    });
    
    const result = await resp.json();
    res.setHeaders(resp.headers);
    ghredirect = result.url;
  } catch (error) {
    return res.status(400).json({
      message: "Error",
    });
  }
  if (!ghredirect) {
    return res.status(400).json({
      message: "Error",
    });
  }
  return res.json({ url: ghredirect });
});

export default router;
