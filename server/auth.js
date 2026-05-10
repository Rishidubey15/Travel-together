import { APIError, betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createAuthMiddleware, getOAuthState } from "better-auth/api";
import { User, UserOrg } from "./models/OpModel.js";
import { normalizeAndCompare } from "./utils/extra.js";

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://localhost:27017",
);
const db = client.db(process.env.DATABASE_NAME || "travel_together");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5001",
  
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  advanced: {
    cookiePrefix: "traveltogether",
  },
  user: {
    additionalFields: {
      isVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      organisationDomain: {
        type: "string",
        required: false,
      },
    },
  },
  trustedOrigins: ["http://localhost:5173", "http://127.0.0.1:5173"],
});

export const orgAuth = betterAuth({
  basePath: "/api/org-verify",
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    cookiePrefix: "TT-org-ver",
  },
  trustedOrigins: ["http://localhost:5173", "http://127.0.0.1:5173"],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
 
      if (!ctx.path.startsWith("/callback/")) return;

      try {
        const additionalData = await getOAuthState(ctx);

       
        if (!additionalData || !additionalData.addedUserId) {
          return;
        }

        const user = ctx.context?.newSession?.user || ctx.context?.user;
        const calledUser = await User.findOne({
          _id: additionalData.addedUserId,
        });
        if (!user) {
          console.error(
            "User object missing in context! Here is the context:",
            ctx.context,
          );
          return;
        }

        if (!normalizeAndCompare(user.name, calledUser.name)) {
          console.error("Name Mismatch!!");
          return ctx.redirect(
            "http://localhost:5173/error?code=409&type=Name+Mismatch&message=The+name+of+user+does+not+match+with+employee+name"
          );
        }

        const newOrg = await UserOrg.create({
          userId: additionalData.addedUserId,
          workEmail: user.email,
          jobTitle: user.jobTitle,
          companyDomain: user.companyDomain,
          allotedCompanyId: additionalData.orgID,
          name: user.name,
          assignedCategory: "Student",
          derivedCompanyName: user.companyName,
        });
        console.log("User Mapping Done");
      } catch (error) {}
    }),
  },
  user: {
    additionalFields: {
      jobTitle: {
        type: "string",
        required: false,
        input: false,
      },
      companyDomain: {
        type: "string",
        required: false,
        input: false,
      },
      companyName: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  socialProviders: {
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: process.env.MICROSOFT_TENET_ID,
      authority: "https://login.microsoftonline.com",
      scope: ["User.Read"],

      getUserInfo: async (tokens) => {
        const res = await fetch("https://graph.microsoft.com/v1.0/me", {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        const res2 = await fetch(
          "https://graph.microsoft.com/v1.0/organization",
          {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          },
        );

        const profile = await res.json();
        const res2t = await res2.json();
        let op2 = res2t.value[0];
        let op = op2.verifiedDomains.filter((obj) => {
          return obj.isDefault;
        });

        return {
          user: {
            id: profile.id,
            name: profile.displayName,
            email: profile.email ?? profile.userPrincipalName,
            emailVerified: true,
            image: profile.picture,
            jobTitle: profile.jobTitle,
            companyDomain: op[0].name,
            companyName: op2.displayName,
          },
          data: profile,
        };
      },
    },
  },
});
