import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ORGANISATIONS = [
  {
    id: "upes",
    name: "University of Petroleum and Energy Studies (UPES)",
    location: "Dehradun, Uttarakhand",
    icon: "🎓",
  },
];

export default function VerifyOrganisation({ external = false }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shown on /verify-organisation/external (confirmation page)
  // Mark org as verified in localStorage as soon as this screen is shown
  useEffect(() => {
    if (external) {
      localStorage.setItem("org_verified", "true");
    }
  }, [external]);

  if (external) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-3xl mx-auto mb-4">
            ✅
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Organisation Selected
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            You've selected <span className="font-semibold text-teal-600 dark:text-teal-400">UPES</span>. Click below to browse available rides.
          </p>
          <button
            type="button"
            onClick={() => navigate("/organisation-rides", { replace: true })}
            className="w-full py-3 rounded-lg bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
          >
            Continue to Rides →
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!selected) return;
    setIsSubmitting(true);
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/org/get-verifier`||'http://localhost:5001/api/org/get-verifier', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json', // MUST have this for Express json() middleware
  },
  body: JSON.stringify({
    orgID: selectedOrg.id
  }),
  credentials: "include" // Correct: keeps your 'auth' session cookies
});

    const result = await res.json();
    console.log(result, selectedOrg)
    if (res.ok){

      window.location.href = result.url
    }
    
  };

  const selectedOrg = ORGANISATIONS.find((o) => o.id === selected);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-3xl mb-3">
              🏫
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Select Your Organisation
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Choose your organisation to access verified rides.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dropdown */}
            <div>
              <label
                htmlFor="org-select"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Organisation
              </label>
              <div className="relative">
                <select
                  id="org-select"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  required
                  className="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition cursor-pointer"
                >
                  <option value="" disabled>
                    -- Select an organisation --
                  </option>
                  {ORGANISATIONS.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                {/* Custom chevron */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Selected org preview card */}
            {selectedOrg && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50">
                <span className="text-2xl">{selectedOrg.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">
                    {selectedOrg.name}
                  </p>
                  <p className="text-xs text-teal-600 dark:text-teal-400">
                    {selectedOrg.location}
                  </p>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!selected || isSubmitting}
              className="w-full py-3 rounded-lg bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Confirming…" : "Confirm Organisation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
