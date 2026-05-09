import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";
import { UserOrg } from "../models/OpModel.js";
import { Notification } from "../models/NotificationModel.js";

const router = Router();

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

router.get("/notifications", async (req, res) => {
  const ctx = await requireOrgUser(req, res);
  if (!ctx) return;
  try {
    const notifications = await Notification.find({ recipientId: ctx.session.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = await Notification.countDocuments({ recipientId: ctx.session.user.id, read: false });
    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error("GET /api/notifications error:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.put("/notifications/:id/read", async (req, res) => {
  const ctx = await requireOrgUser(req, res);
  if (!ctx) return;
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    if (notification.recipientId !== ctx.session.user.id)
      return res.status(403).json({ message: "Not authorized" });

    notification.read = true;
    await notification.save();
    res.json({ notification });
  } catch (err) {
    console.error("PUT /api/notifications/:id/read error:", err);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

router.put("/notifications/mark-all-read", async (req, res) => {
  const ctx = await requireOrgUser(req, res);
  if (!ctx) return;
  try {
    await Notification.updateMany(
      { recipientId: ctx.session.user.id, read: false },
      { read: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("PUT /api/notifications/mark-all-read error:", err);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
});

export default router;
