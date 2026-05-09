import mongoose from "mongoose";

const { Schema, model } = mongoose;

const notificationSchema = new Schema(
  {
    recipientId: { type: String, required: true, index: true },
    rideId: { type: String, required: true },
    type: { type: String, enum: ["join_request"], default: "join_request" },
    requesterName: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    routeLabel: { type: String, required: true },
    pickupPoint: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = model("Notification", notificationSchema);
