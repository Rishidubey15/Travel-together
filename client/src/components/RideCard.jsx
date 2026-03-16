import { useState } from "react";

const VEHICLE_ICONS = { car:"🚗", bike:"🏍️", auto:"🛺", bus:"🚌", cab:"🚕", other:"🚐" };
const DAY_SHORT = { Monday:"Mon", Tuesday:"Tue", Wednesday:"Wed", Thursday:"Thu", Friday:"Fri", Saturday:"Sat" };

function fmt12(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${ampm}`;
}

function formatBudget(min, max) {
  if (!min && !max) return null;
  if (min && max) return `₹${Number(min).toLocaleString("en-IN")} – ₹${Number(max).toLocaleString("en-IN")}`;
  if (min) return `From ₹${Number(min).toLocaleString("en-IN")}`;
  return `Up to ₹${Number(max).toLocaleString("en-IN")}`;
}

export default function RideCard({ ride, currentUserId, onJoinToggle, onDelete }) {
  const [joinLoading, setJoinLoading]     = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg]           = useState("");
  const [showJoinBox, setShowJoinBox]     = useState(false);
  const [pickupInput, setPickupInput]     = useState("");

  const isMyRide  = ride.postedBy?.userId === currentUserId;
  const hasJoined = ride.joinRequests?.some((r) => r.userId === currentUserId);
  const joinCount = ride.joinRequests?.length ?? 0;
  const isFull    = ride.status === "full" || joinCount >= ride.seats;
  const budget    = formatBudget(ride.budgetMin, ride.budgetMax);


  const activeDays = ride.days || [];

  const handleJoinClick = () => {
    if (hasJoined) { doJoin(); return; }      
    setShowJoinBox(true);
  };

  const doJoin = async (pickup) => {
    setJoinLoading(true);
    setErrorMsg("");
    setShowJoinBox(false);
    try {
      const res = await fetch(`http://localhost:5001/api/rides/${ride._id}/join`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupPoint: pickup || undefined }),
      });
      const data = await res.json();
      if (res.ok) { onJoinToggle?.(data.ride, data.joined); }
      else { setErrorMsg(data.message || "Failed to update join request"); }
    } catch { setErrorMsg("Network error — is the server running?"); }
    finally { setJoinLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
    setDeleteLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/rides/${ride._id}`, {
        method: "DELETE", credentials: "include",
      });
      if (res.ok) { onDelete?.(ride._id); }
      else { const d = await res.json(); setErrorMsg(d.message || "Failed to delete"); }
    } catch { setErrorMsg("Network error."); }
    finally { setDeleteLoading(false); setConfirmDelete(false); }
  };

  return (
    <article className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col">

      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Vehicle + poster */}
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">
              {ride.vehicleType ? `${VEHICLE_ICONS[ride.vehicleType]} ` : ""}
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {isMyRide ? "You" : ride.postedBy?.name}
              </span>
            </p>
            {/* Route type */}
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug">
              {ride.routeType === "current" ? "🛣️ Current Route" :
               ride.routeType === "alternate" ? "🔀 Alternate Route" : "📍 Custom Route"}
            </h3>
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {isMyRide && (
              <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-700/50">
                My Ride
              </span>
            )}
            {hasJoined && !isMyRide && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-700/50">
                ✓ Requested
              </span>
            )}
            {isFull && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold">Full</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Route stops ── */}
      <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex flex-wrap gap-1 items-center">
          {ride.routeLabel?.split(" → ").map((stop, i, arr) => (
            <span key={i} className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 text-xs font-medium">
                {stop}
              </span>
              {i < arr.length - 1 && <span className="text-slate-300 dark:text-slate-600 text-xs">→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ── Schedule & details ── */}
      <div className="px-5 py-3 flex flex-col gap-3 flex-1">

        {/* Days row */}
        <div className="flex flex-wrap gap-1">
          {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((day) => (
            <span key={day}
              className={`px-2 py-0.5 rounded text-xs font-semibold
                ${activeDays.includes(day)
                  ? "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300"
                  : "bg-slate-100 dark:bg-slate-700/50 text-slate-300 dark:text-slate-600"}`}>
              {DAY_SHORT[day]}
            </span>
          ))}
        </div>

        {/* Time + seats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            ⏱ {fmt12(ride.departureTime)}
            {ride.returnTime ? ` – ${fmt12(ride.returnTime)}` : ""}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-xs">
            👥 {ride.seats} seat{ride.seats !== 1 ? "s" : ""} · {joinCount} req.
          </span>
        </div>

        {/* Pickup */}
        {ride.pickupPoint && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            📍 Boards at <span className="font-medium text-slate-700 dark:text-slate-300">{ride.pickupPoint}</span>
            {ride.dropPoint ? <> · exits at <span className="font-medium text-slate-700 dark:text-slate-300">{ride.dropPoint}</span></> : ""}
          </div>
        )}

        {/* Budget */}
        {budget && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            💰 {budget}<span className="text-slate-400"> /person/day</span>
          </div>
        )}

        {/* Description */}
        {ride.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 italic">
            "{ride.description}"
          </p>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-700/60">

        {/* Inline error */}
        {errorMsg && (
          <div className="mb-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 text-xs text-red-700 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {errorMsg}
          </div>
        )}

        {/* Pickup input when joining */}
        {showJoinBox && (
          <div className="mb-3 space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              📍 Your pickup point on this route (optional)
            </label>
            <input type="text"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="e.g. Canal Road"
              value={pickupInput}
              onChange={(e) => setPickupInput(e.target.value)}
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => doJoin(pickupInput)}
                className="flex-1 py-2 rounded-lg bg-teal-600 dark:bg-teal-500 text-white text-sm font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors">
                Confirm Request
              </button>
              <button type="button" onClick={() => setShowJoinBox(false)}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {!showJoinBox && (
          isMyRide ? (
            <button type="button" onClick={handleDelete} disabled={deleteLoading}
              className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50
                ${confirmDelete
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-600"}`}>
              {deleteLoading ? "Deleting…" : confirmDelete ? "Tap again to confirm delete" : "Delete Ride"}
            </button>
          ) : (
            <button type="button" onClick={hasJoined ? doJoin : handleJoinClick}
              disabled={joinLoading || (isFull && !hasJoined)}
              className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                ${hasJoined
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 hover:bg-blue-100"
                  : isFull
                  ? "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-teal-600 dark:bg-teal-500 text-white hover:bg-teal-700 dark:hover:bg-teal-600"}`}>
              {joinLoading ? "Updating…"
                : hasJoined ? "Withdraw Request"
                : isFull ? "No Seats Available"
                : "Request to Join"}
            </button>
          )
        )}
      </div>
    </article>
  );
}
