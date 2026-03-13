import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const ROUTES = [
  {
    id: "current",
    label: "Current Route",
    stops: ["Aman Vihar","Canal Road","Dilaram Chowk","Kalidas Road","Cantt","Kualagarh Route","Bidholi"],
  },
  {
    id: "alternate",
    label: "Alternate Route",
    stops: ["Aman Vihar","Canal Road","Dilaram Chowk","Kalidas Road","Cantt","Premnagar","Bidholi"],
  },
  { id: "custom", label: "Custom Route", stops: [] },
];

const VEHICLE_TYPES = [
  { id: "car",   label: "Car",   icon: "🚗" },
  { id: "bike",  label: "Bike",  icon: "🏍️" },
  { id: "auto",  label: "Auto",  icon: "🛺" },
  { id: "bus",   label: "Bus",   icon: "🚌" },
  { id: "cab",   label: "Cab",   icon: "🚕" },
  { id: "other", label: "Other", icon: "🚐" },
];

// Common time options for a college commute
const TIME_OPTIONS = [
  "06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00",
  "12:00","13:00","14:00","15:00","16:00","16:30","17:00","17:30","18:00","18:30","19:00",
];

function fmt12(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2,"0")} ${ampm}`;
}

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm";

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
      {children}
    </p>
  );
}

export default function CreateRide() {
  const navigate = useNavigate();

  const [routeType, setRouteType]           = useState("current");
  const [customRouteLabel, setCustomRoute]  = useState("");
  const [days, setDays]                     = useState(["Tuesday","Wednesday","Thursday","Friday","Saturday"]);
  const [departureTime, setDepartureTime]   = useState("08:00");
  const [returnTime, setReturnTime]         = useState("16:00");
  const [pickupPoint, setPickupPoint]       = useState("");
  const [dropPoint, setDropPoint]           = useState("");
  const [seats, setSeats]                   = useState("1");
  const [budgetMin, setBudgetMin]           = useState("");
  const [budgetMax, setBudgetMax]           = useState("");
  const [vehicleType, setVehicleType]       = useState("");
  const [description, setDescription]       = useState("");
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");

  const toggleDay = (day) =>
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (days.length === 0) { setError("Please select at least one day."); return; }
    if (routeType === "custom" && !customRouteLabel.trim()) {
      setError("Please describe your custom route."); return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/rides", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routeType,
          customRouteLabel: routeType === "custom" ? customRouteLabel : undefined,
          days,
          departureTime,
          returnTime: returnTime || undefined,
          pickupPoint: pickupPoint.trim() || undefined,
          dropPoint: dropPoint.trim() || undefined,
          seats: Number(seats),
          budgetMin: budgetMin || undefined,
          budgetMax: budgetMax || undefined,
          vehicleType: vehicleType || undefined,
          description: description.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 403 && data.code === "ORG_NOT_VERIFIED") {
        setError("You must verify your organisation before posting a ride.");
        return;
      }
      if (!res.ok) { setError(data.message || "Failed to create ride."); return; }
      navigate("/organisation-rides", { replace: true });
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const selectedRoute = ROUTES.find((r) => r.id === routeType);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <Link to="/organisation-rides"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Rides
        </Link>

        <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-3xl mb-3">🚗</div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Post a Ride</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Share your commute with UPES colleagues.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 text-sm text-red-700 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            {/* ── ROUTE ── */}
            <div>
              <SectionLabel>Route</SectionLabel>
              <div className="space-y-3">
                {ROUTES.map((r) => (
                  <label key={r.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${routeType === r.id
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}>
                    <input type="radio" name="route" value={r.id}
                      checked={routeType === r.id}
                      onChange={() => setRouteType(r.id)}
                      className="mt-1 accent-teal-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${routeType === r.id ? "text-teal-700 dark:text-teal-300" : "text-slate-700 dark:text-slate-200"}`}>
                        {r.label}
                      </p>
                      {r.stops.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {r.stops.map((stop, i) => (
                            <span key={stop} className="flex items-center gap-1">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">
                                {stop}
                              </span>
                              {i < r.stops.length - 1 && (
                                <span className="text-slate-300 dark:text-slate-600 text-xs">→</span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Custom route input */}
              {routeType === "custom" && (
                <div className="mt-3">
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={2}
                    placeholder="Describe your route (e.g. Rajpur Road → Clock Tower → ISBT → Bidholi)"
                    value={customRouteLabel}
                    onChange={(e) => setCustomRoute(e.target.value)}
                    maxLength={200}
                  />
                </div>
              )}
            </div>

            {/* ── DAYS ── */}
            <div>
              <SectionLabel>Days of Travel</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all
                      ${days.includes(day)
                        ? "bg-teal-600 dark:bg-teal-500 text-white border-teal-600 dark:border-teal-500 shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-500"}`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              {days.length === 0 && (
                <p className="text-xs text-red-500 mt-1.5">Select at least one day.</p>
              )}
            </div>

            {/* ── TIME ── */}
            <div>
              <SectionLabel>Time Slot</SectionLabel>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                    🕗 Departure (going)
                  </label>
                  <select value={departureTime} onChange={(e) => setDepartureTime(e.target.value)}
                    className={inputClass} required>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{fmt12(t)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                    🕓 Return (coming back) <span className="text-slate-400">(optional)</span>
                  </label>
                  <select value={returnTime} onChange={(e) => setReturnTime(e.target.value)}
                    className={inputClass}>
                    <option value="">Not fixed</option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{fmt12(t)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time summary pill */}
              {departureTime && (
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50 text-sm text-teal-700 dark:text-teal-300 font-medium">
                  ⏱ {fmt12(departureTime)}{returnTime ? ` – ${fmt12(returnTime)}` : " (one way / return not fixed)"}
                </div>
              )}
            </div>

            {/* ── PICKUP / DROP ── */}
            <div>
              <SectionLabel>Your Stop on the Route</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                    📍 Your Pickup Point
                  </label>
                  <input type="text" className={inputClass}
                    placeholder="e.g. Aman Vihar"
                    value={pickupPoint} onChange={(e) => setPickupPoint(e.target.value)}
                    maxLength={80} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                    🏁 Your Drop Point <span className="text-slate-400">(optional)</span>
                  </label>
                  <input type="text" className={inputClass}
                    placeholder="e.g. Bidholi Gate"
                    value={dropPoint} onChange={(e) => setDropPoint(e.target.value)}
                    maxLength={80} />
                </div>
              </div>
            </div>

            {/* ── VEHICLE & SEATS ── */}
            <div>
              <SectionLabel>Vehicle & Seats</SectionLabel>
              <div className="flex flex-wrap gap-2 mb-4">
                {VEHICLE_TYPES.map((v) => (
                  <button key={v.id} type="button"
                    onClick={() => setVehicleType(vehicleType === v.id ? "" : v.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all
                      ${vehicleType === v.id
                        ? "bg-teal-600 dark:bg-teal-500 text-white border-teal-600 dark:border-teal-500 shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-teal-400"}`}>
                    <span>{v.icon}</span> {v.label}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                  👥 Seats Available (how many companions are you looking for?)
                </label>
                <div className="flex items-center gap-3">
                  {[1,2,3,4,5,6].map((n) => (
                    <button key={n} type="button"
                      onClick={() => setSeats(String(n))}
                      className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all
                        ${seats === String(n)
                          ? "bg-teal-600 dark:bg-teal-500 text-white border-teal-600 dark:border-teal-500"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-teal-400"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── COST SHARING ── */}
            <div>
              <SectionLabel>Cost Sharing (₹ per person/day) — Optional</SectionLabel>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Min</label>
                  <input type="number" className={inputClass} placeholder="e.g. 30"
                    min={0} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Max</label>
                  <input type="number" className={inputClass} placeholder="e.g. 80"
                    min={0} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
                </div>
              </div>
            </div>

            {/* ── NOTE ── */}
            <div>
              <SectionLabel>Additional Note — Optional</SectionLabel>
              <textarea className={`${inputClass} resize-none`} rows={3}
                placeholder="e.g. Flexible on pickup point. Split cost daily. WhatsApp group will be created."
                maxLength={500} value={description}
                onChange={(e) => setDescription(e.target.value)} />
              <p className="text-xs text-slate-400 dark:text-slate-500 text-right mt-0.5">{description.length}/500</p>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || days.length === 0}
              className="w-full py-3 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
              {loading ? "Posting…" : "Post Ride"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
