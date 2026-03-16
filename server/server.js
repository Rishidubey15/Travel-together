import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth, orgAuth } from "./auth.js";
import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/rides.js";
import connect from "./utils/db.js";

const app = express();
const PORT = process.env.PORT || 5001;

await connect();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};


app.options("*", cors(corsOptions));
app.use(cors(corsOptions));


app.all("/api/auth/*", toNodeHandler(auth));
app.all("/api/org-verify/*", toNodeHandler(orgAuth));

app.use(express.json());


app.use("/api", authRoutes);


app.use("/api", rideRoutes);


app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
