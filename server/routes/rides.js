/**
 * Ride routes – all require an active session AND a verified UserOrg record.
 *
 * GET    /api/rides          – list rides for caller's org
 * GET    /api/rides/mine     – rides posted by the caller
 * POST   /api/rides          – create a new ride
 * PUT    /api/rides/:id/join – toggle join-request (join / withdraw)
 * DELETE /api/rides/:id      – delete caller's own ride
 */

import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";
import { UserOrg } from "../models/OpModel.js";
import { Ride } from "../models/RideModel.js";
import { Notification } from "../models/NotificationModel.js";

const router = Router();

const ROUTE_LABELS = {
  current:
    "Aman Vihar → Canal Road → Dilaram Chowk → Kalidas Road → Cantt → Kualagarh Route → Bidholi",
  alternate:
    "Aman Vihar → Canal Road → Dilaram Chowk → Kalidas Road → Cantt → Premnagar → Bidholi",
};

const VALID_DAYS = [
  "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",
];

async function requireOrgUser(req, res) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) { res.status(401).json({ message: "Not authenticated" }); return null; }
  const orgDetails = await UserOrg.findOne({ userId: session.user.id });
  if (!orgDetails) {
    res.status(403).json({ message: "Organisation not verified.", code: "ORG_NOT_VERIFIED" });
    return null;
  }
  return { session, orgDetails };
}

router.get("/rides", async (req, res) => {
  const ctx = await requireOrgUser(req, res);
  if (!ctx) return;
  try {
    const rides = await Ride.find({ orgId: ctx.orgDetails.allotedCompanyId }).sort({ createdAt: -1 });
    res.json({ rides, orgId: ctx.orgDetails.allotedCompanyId });
  } catch (err) {
    console.error("GET /api/rides error:", err);
    res.status(500).json({ message: "Failed to fetch rides" });
  }
});

router.get("/rides/mine", async (req, res) => {
  const ctx = await requireOrgUser(req, res);
  if (!ctx) return;
  try {
    const rides = await Ride.find({ "postedBy.userId": ctx.session.user.id }).sort({ createdAt: -1 });
    res.json({ rides });
  } catch (err) {
    console.error("GET /api/rides/mine error:", err);
    res.status(500).json({ message: "Failed to fetch your rides" });
  }
});

router.post("/rides", async (req, res) => {
  const ctx = await requireOrgUser(req, res);
  if (!ctx) return;
  const { session, orgDetails } = ctx;
  const { routeType, customRouteLabel, days, departureTime, returnTime,
          pickupPoint, dropPoint, seats, budgetMin, budgetMax, vehicleType, description } = req.body;

  if (!["current","alternate","custom"].includes(routeType))
    return res.status(400).json({ message: "Invalid routeType" });

  let routeLabel;
  if (routeType === "custom") {
    if (!customRouteLabel?.trim()) return res.status(400).json({ message: "Custom route label is required" });
    routeLabel = customRouteLabel.trim();
  } else {
    routeLabel = ROUTE_LABELS[routeType];
  }

  if (!Array.isArray(days) || days.length === 0)
    return res.status(400).json({ message: "At least one day is required" });
  const invalidDay = days.find((d) => !VALID_DAYS.includes(d));
  if (invalidDay) return res.status(400).json({ message: `Invalid day: ${invalidDay}` });

  if (!departureTime) return res.status(400).json({ message: "Departure time is required" });

  try {
    const ride = await Ride.create({
      routeType, routeLabel, days, departureTime,
      returnTime: returnTime || undefined,
      pickupPoint: pickupPoint?.trim() || undefined,
      dropPoint: dropPoint?.trim() || undefined,
      seats: seats ? Math.max(1, Math.min(10, Number(seats))) : 1,
      budgetMin: budgetMin != null && budgetMin !== "" ? Number(budgetMin) : undefined,
      budgetMax: budgetMax != null && budgetMax !== "" ? Number(budgetMax) : undefined,
      vehicleType: vehicleType || "",
      description: description?.trim() || undefined,
      postedBy: { userId: session.user.id, name: orgDetails.name, workEmail: orgDetails.workEmail },
      orgId: orgDetails.allotedCompanyId,
    });
    res.status(201).json({ ride });
  } catch (err) {
    console.error("POST /api/rides error:", err);
    res.status(500).json({ message: "Failed to create ride" });
  }
});

router.put("/rides/:id/join", async (req, res) => {
  const ctx = await requireOrgUser(req, res);
  if (!ctx) return;
  const { session, orgDetails } = ctx;
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.orgId !== orgDetails.allotedCompanyId)
      return res.status(403).json({ message: "You can only join rides from your organisation" });
    if (ride.postedBy.userId === session.user.id)
      return res.status(400).json({ message: "You cannot join your own ride" });

    const existingIdx = ride.joinRequests.findIndex((r) => r.userId === session.user.id);
    if (existingIdx !== -1) {
      ride.joinRequests.splice(existingIdx, 1);
      await ride.save();
      return res.json({ ride, joined: false });
    }

    const { pickupPoint } = req.body;
    ride.joinRequests.push({
      userId: session.user.id, name: orgDetails.name,
      workEmail: orgDetails.workEmail,
      pickupPoint: pickupPoint?.trim() || undefined,
      requestedAt: new Date(),
    });
    await ride.save();

    // Create notification for ride poster
    await Notification.create({
      recipientId: ride.postedBy.userId,
      rideId: ride._id,
      type: "join_request",
      requesterName: orgDetails.name,
      requesterEmail: orgDetails.workEmail,
      routeLabel: ride.routeLabel,
      pickupPoint: pickupPoint?.trim() || undefined,
    });

    return res.json({ ride, joined: true });
  } catch (err) {
    console.error("PUT /api/rides/:id/join error:", err);
    res.status(500).json({ message: "Failed to update join request" });
  }
});

router.delete("/rides/:id", async (req, res) => {
  const ctx = await requireOrgUser(req, res);
  if (!ctx) return;
  const { session } = ctx;
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.postedBy.userId !== session.user.id)
      return res.status(403).json({ message: "You can only delete your own rides" });
    await ride.deleteOne();
    res.json({ message: "Ride deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/rides/:id error:", err);
    res.status(500).json({ message: "Failed to delete ride" });
  }
});

export default router;
