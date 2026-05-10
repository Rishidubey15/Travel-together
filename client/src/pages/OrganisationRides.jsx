import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../lib/auth-client";
import RideCard from "../components/RideCard";

const ORG_NAMES = { upes: "University of Petroleum and Energy Studies (UPES)" };
const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export default function OrganisationRides() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [rides, setRides]     = useState([]);
  const [orgId, setOrgId]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Filters
  const [search, setSearch]       = useState("");
  const [dayFilter, setDayFilter] = useState(""); 
  const [routeFilter, setRouteFilter] = useState(""); 

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/rides`||"http://localhost:5001/api/rides", { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 403 && data.code === "ORG_NOT_VERIFIED") setError("NOT_VERIFIED");
        else if (!res.ok) setError(data.message || "Failed to load rides");
        else { setRides(data.rides || []); setOrgId(data.orgId || null); }
      })
      .catch(() => { if (!cancelled) setError("Network error. Is the server running?"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleJoinToggle = (updatedRide) =>
    setRides((prev) => prev.map((r) => (r._id === updatedRide._id ? updatedRide : r)));

  const handleDelete = (deletedId) =>
    setRides((prev) => prev.filter((r) => r._id !== deletedId));

  const displayRides = useMemo(() => {
    let filtered = rides;
    const q = search.trim().toLowerCase();
    if (q) filtered = filtered.filter((r) =>
      r.routeLabel?.toLowerCase().includes(q) ||
      r.postedBy?.name?.toLowerCase().includes(q) ||
      r.pickupPoint?.toLowerCase().includes(q)
    );
    if (dayFilter) filtered = filtered.filter((r) => r.days?.includes(dayFilter));
    if (routeFilter) filtered = filtered.filter((r) => r.routeType === routeFilter);
    return filtered;
  }, [rides, search, dayFilter, routeFilter]);

  if (loading) return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 dark:border-teal-400" />
    </div>
  );

  if (error === "NOT_VERIFIED") return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-3xl mx-auto mb-4">🏫</div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Organisation not verified</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Verify your organisation to view and post rides.</p>
        <Link to="/verify-organisation"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 transition-colors">
          Verify Organisation →
        </Link>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl border border-red-200 dark:border-red-700/50 p-8 max-w-md w-full text-center">
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Organisation Rides</h1>
            {orgId && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
                {ORG_NAMES[orgId] || orgId}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/my-rides"
              className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
              My Rides
            </Link>
            <Link to="/create-ride"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 dark:bg-teal-500 text-white text-sm font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Post a Ride
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input type="text" placeholder="Search route or name…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm" />
          </div>

          {/* Route filter */}
          <select value={routeFilter} onChange={(e) => setRouteFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer">
            <option value="">All Routes</option>
            <option value="current">🛣️ Current Route</option>
            <option value="alternate">🔀 Alternate Route</option>
            <option value="custom">📍 Custom Route</option>
          </select>

          {/* Day filter */}
          <select value={dayFilter} onChange={(e) => setDayFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer">
            <option value="">All Days</option>
            {ALL_DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {displayRides.length === 0 ? "No rides found" : `${displayRides.length} ride${displayRides.length !== 1 ? "s" : ""} available`}
        </p>

        {displayRides.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🛣️</div>
            <p className="text-slate-600 dark:text-slate-400 font-medium mb-1">
              {search || dayFilter || routeFilter ? "No rides match your filters" : "No rides yet for your organisation"}
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">
              {search || dayFilter || routeFilter ? "Try adjusting your filters." : "Be the first to share your commute!"}
            </p>
            {!search && !dayFilter && !routeFilter && (
              <Link to="/create-ride"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 transition-colors">
                Post a Ride
              </Link>
            )}
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayRides.map((ride) => (
              <li key={ride._id}>
                <RideCard ride={ride} currentUserId={currentUserId}
                  onJoinToggle={handleJoinToggle} onDelete={handleDelete} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
