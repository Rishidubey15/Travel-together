import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyOrganisation({ external = false }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shown on /verify-organisation/external (dummy redirect page)
  if (external) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 max-w-md w-full text-center">
          <p className="text-slate-700 dark:text-slate-300 text-lg">
            Redirecting to organisation verification service...
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            (Simulated – no backend verification)
          </p>
          <button
            type="button"
            onClick={() => navigate("/organisation-rides", { replace: true })}
            className="mt-6 px-6 py-2.5 rounded-lg bg-teal-600 dark:bg-teal-500 text-white font-medium hover:bg-teal-700 dark:hover:bg-teal-600"
          >
            Continue to Rides
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // No backend verification – redirect to dummy external page
    navigate("/verify-organisation/external", { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
            Verify Your Organisation
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-center text-sm mb-6">
            To access organisation rides you must verify your work email.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="org-email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Organisation Email
              </label>
              <input
                id="org-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                placeholder="you@company.com"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-teal-600 dark:bg-teal-500 text-white font-medium hover:bg-teal-700 dark:hover:bg-teal-600 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Verifying…" : "Verify with Organisation Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
