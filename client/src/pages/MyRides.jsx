import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DAY_SHORT = { Monday:"Mon",Tuesday:"Tue",Wednesday:"Wed",Thursday:"Thu",Friday:"Fri",Saturday:"Sat" };
const ALL_DAYS  = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function fmt12(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
}

function JoinRequestBadge({ request }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600/50">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none">
          {request.name.split(" ").map((n)=>n[0]).join("").toUpperCase().slice(0,2)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{request.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{request.workEmail}</p>
          {request.pickupPoint && (
            <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5">📍 {request.pickupPoint}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MyRideItem({ ride, onDelete }) {
  const [expanded, setExpanded]         = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const joinCount = ride.joinRequests?.length ?? 0;

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
    setDeleteLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rides/${ride._id}`||`http://localhost:5001/api/rides/${ride._id}`, { method:"DELETE", credentials:"include" });
      if (res.ok) { onDelete(ride._id); }
      else { const d = await res.json(); alert(d.message || "Failed to delete ride"); }
    } catch { alert("Network error."); }
    finally { setDeleteLoading(false); setConfirmDelete(false); }
  };

  return (
    <article className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4">
        {/* Route */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">
              {ride.routeType === "current" ? "🛣️ Current Route" : ride.routeType === "alternate" ? "🔀 Alternate Route" : "📍 Custom Route"}
            </p>
            <div className="flex flex-wrap gap-1 items-center">
              {ride.routeLabel?.split(" → ").map((stop, i, arr) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">{stop}</span>
                  {i < arr.length - 1 && <span className="text-slate-300 dark:text-slate-600 text-xs">→</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {joinCount > 0 && (
              <button type="button" onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100 transition-colors">
                👥 {joinCount} Request{joinCount !== 1 ? "s" : ""}
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            {joinCount === 0 && <span className="text-xs text-slate-400">No requests</span>}
            <button type="button" onClick={handleDelete} disabled={deleteLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50
                ${confirmDelete ? "bg-red-600 text-white" : "border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"}`}>
              {deleteLoading ? "…" : confirmDelete ? "Confirm?" : "Delete"}
            </button>
          </div>
        </div>

        {/* Days */}
        <div className="flex flex-wrap gap-1 mb-2">
          {ALL_DAYS.map((day) => (
            <span key={day}
              className={`px-2 py-0.5 rounded text-xs font-semibold
                ${ride.days?.includes(day) ? "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300" : "bg-slate-100 dark:bg-slate-700/50 text-slate-300 dark:text-slate-600"}`}>
              {DAY_SHORT[day]}
            </span>
          ))}
        </div>

        {/* Time + seats */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span>⏱ {fmt12(ride.departureTime)}{ride.returnTime ? ` – ${fmt12(ride.returnTime)}` : ""}</span>
          <span>👥 {ride.seats} seat{ride.seats !== 1 ? "s" : ""}</span>
          {ride.pickupPoint && <span>📍 {ride.pickupPoint}</span>}
        </div>
      </div>

      {/* Join requests */}
      {expanded && joinCount > 0 && (
        <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700/60 pt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Join Requests ({joinCount})
          </p>
          {ride.joinRequests.map((req, i) => (
            <JoinRequestBadge key={req.userId ?? i} request={req} />
          ))}
        </div>
      )}
    </article>
  );
}

export default function MyRides() {
  const [rides, setRides]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.VITE_API_URL}/api/rides/mine`||"http://localhost:5001/api/rides/mine", { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) setError(data.message || "Failed to load rides");
        else setRides(data.rides || []);
      })
      .catch(() => { if (!cancelled) setError("Network error."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleDelete = (id) => setRides((prev) => prev.filter((r) => r._id !== id));

  if (loading) return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 dark:border-teal-400" />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Rides</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Rides you've posted — see who wants to join.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/organisation-rides" className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 transition-colors">All Rides</Link>
            <Link to="/create-ride" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 dark:bg-teal-500 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Post a Ride
            </Link>
          </div>
        </div>

        {error && <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 text-sm text-red-700 dark:text-red-400">{error}</div>}

        {!error && rides.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🚗</div>
            <p className="text-slate-600 dark:text-slate-400 font-medium mb-1">You haven't posted any rides yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Share your commute with colleagues!</p>
            <Link to="/create-ride" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 transition-colors">Post Your First Ride</Link>
          </div>
        )}

        {rides.length > 0 && (
          <div className="space-y-4">
            {rides.map((ride) => <MyRideItem key={ride._id} ride={ride} onDelete={handleDelete} />)}
          </div>
        )}
      </div>
    </div>
  );
}
