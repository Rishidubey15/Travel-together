import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
const db = client.db(process.env.DATABASE_NAME || "travel_together");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5001",
  // Omit client to disable transactions (required for standalone MongoDB; transactions need a replica set)
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
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
  trustedOrigins: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
});
