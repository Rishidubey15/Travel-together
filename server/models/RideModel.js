import mongoose from "mongoose";

const { Schema, model } = mongoose;

const joinRequestSchema = new Schema(
  {
    userId:      { type: String, required: true },
    name:        { type: String, required: true },
    workEmail:   { type: String, required: true },
    pickupPoint: { type: String },
    requestedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const rideSchema = new Schema(
  {
    // ── Route ────────────────────────────────────────────────────────────────
    routeType: {
      type: String,
      enum: ["current", "alternate", "custom"],
      required: true,
      default: "current",
    },
    // Human-readable stop list (auto-set for current/alternate, user-entered for custom)
    routeLabel: { type: String, required: true },

    // ── Schedule ─────────────────────────────────────────────────────────────
    days: {
      type: [String],
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      required: true,
      validate: [(arr) => arr.length > 0, "At least one day is required"],
    },
    departureTime: { type: String, required: true },   // e.g. "08:00"
    returnTime:    { type: String },                   // e.g. "16:00"

    // ── Pickup & drop ─────────────────────────────────────────────────────────
    pickupPoint: { type: String, trim: true },   // where the poster boards
    dropPoint:   { type: String, trim: true },   // where the poster exits

    // ── Capacity & cost ───────────────────────────────────────────────────────
    seats:     { type: Number, required: true, min: 1, max: 10, default: 1 },
    budgetMin: { type: Number },
    budgetMax: { type: Number },

    // ── Extra info ────────────────────────────────────────────────────────────
    vehicleType: {
      type: String,
      enum: ["car", "bike", "auto", "bus", "cab", "other", ""],
      default: "",
    },
    description: { type: String, trim: true, maxlength: 500 },

    // ── Poster info ───────────────────────────────────────────────────────────
    postedBy: {
      userId:    { type: String, required: true },
      name:      { type: String, required: true },
      workEmail: { type: String, required: true },
    },

    orgId:  { type: String, required: true, index: true },

    /** Who can see this ride: whole org, or only matching category (student/professor). */
    audience: {
      type: String,
      enum: ["all", "student", "professor"],
      default: "all",
    },

    joinRequests: { type: [joinRequestSchema], default: [] },

    status: {
      type:    String,
      enum:    ["open", "full", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const Ride = model("Ride", rideSchema);
