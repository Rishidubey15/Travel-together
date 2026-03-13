import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../lib/auth-client";

function Field({ label, value, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {label}
      </label>
      <div className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-sm font-medium min-h-[44px] flex items-center">
        {value || (
          <span className="text-slate-400 dark:text-slate-500 font-normal">
            {placeholder}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const { data: session, isPending: sessionPending } = useSession();
  const [copied, setCopied] = useState(false);

  // Data from /api/me
  const [apiData, setApiData]   = useState(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError]   = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
      })
      .then((data) => { setApiData(data); setApiLoading(false); })
      .catch((err) => { setApiError(err.message); setApiLoading(false); });
  }, []);

  if (sessionPending || apiLoading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 dark:border-teal-400" />
      </div>
    );
  }

  // ── User fields from API ──────────────────────────────────────────────────
  const user        = apiData?.user || session?.user || {};
  const orgDetails  = apiData?.orgDetails || null;

  const userName  = user.name  || "";
  const userEmail = user.email || "";
  const userId    = user.id    || "";
  const createdAt = user.createdAt ? new Date(user.createdAt) : null;

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinedDate = createdAt
    ? createdAt.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : "—";

  const memberSince = createdAt
    ? (() => {
        const diff   = Date.now() - createdAt.getTime();
        const days   = Math.floor(diff / 86400000);
        if (days < 1)  return "Today";
        if (days === 1) return "1 day ago";
        if (days < 30)  return `${days} days ago`;
        const months = Math.floor(days / 30);
        if (months === 1)  return "1 month ago";
        if (months < 12)   return `${months} months ago`;
        return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? "s" : ""} ago`;
      })()
    : "—";

  // ── Org fields ─────────────────────────────────────────────────────────────
  const isOrgVerified = !!orgDetails;
  const orgName       = orgDetails?.derivedCompanyName  || "";
  const orgDomain     = orgDetails?.companyDomain       || "";
  const orgCategory   = orgDetails?.assignedCategory    || "";
  const orgJobTitle   = orgDetails?.jobTitle            || "";
  const orgWorkEmail  = orgDetails?.workEmail           || "";

  // Full display name for the org
  const orgDisplayNames = {
    upes: "University of Petroleum and Energy Studies",
  };
  const orgFullName = orgDisplayNames[orgDetails?.allotedCompanyId] || orgName;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(userEmail).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900">

      {/* Hero banner */}
      <div className="h-32 sm:h-40 bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 dark:from-teal-700 dark:via-teal-600 dark:to-cyan-700 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-6 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute top-4 left-1/3 w-20 h-20 rounded-full bg-white/5" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Avatar + name */}
        <div className="relative -mt-12 sm:-mt-14 mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-xl ring-4 ring-white dark:ring-slate-900 select-none flex-shrink-0">
              {initials || "?"}
            </div>
            <div className="pb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {userName || "Unknown User"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Member since {joinedDate}
              </p>
            </div>
          </div>
        </div>

        {/* API error banner */}
        {apiError && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 text-sm text-red-700 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Could not load latest profile data: {apiError}. Showing session data.
          </div>
        )}

        {/* Profile Info card */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profile Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name"    value={userName}   placeholder="Not set" />
            <Field label="User ID"      value={userId ? `${userId}` : ""} placeholder="Not set" />
            <Field label="Member Since" value={memberSince} />
          </div>
        </div>

        {/* Email card */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">My Email Address</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{userEmail}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Primary email · {memberSince}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                title="Copy email"
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-300 dark:hover:border-teal-600 hover:text-teal-700 dark:hover:text-teal-300 transition-all"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Organisation card */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Organisation</h2>
          </div>

          <div className="p-6">
            {isOrgVerified ? (
              /* ── Verified: show real org details from API ── */
              <div className="space-y-4">
                {/* Org header row */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/40">
                  <span className="text-3xl select-none">🎓</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{orgFullName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{orgName} · {orgDomain}</p>
                  </div>
                  <span className="ml-auto flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-700/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>

                {/* Org detail fields grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Work Email"  value={orgWorkEmail}  placeholder="—" />
                  <Field label="Job Title"   value={orgJobTitle}   placeholder="—" />
                  <Field label="Assigned Category"    value={orgCategory}   placeholder="—" />
                  <Field label="Domain"      value={orgDomain}     placeholder="—" />
                </div>
              </div>
            ) : (
              /* ── Not verified ── */
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/40">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Organisation not verified</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-0.5">
                      Verify your organisation email to access rides and trusted travel companions.
                    </p>
                  </div>
                </div>
                <Link
                  to="/verify-organisation"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 dark:bg-teal-500 text-white text-sm font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                  Verify Now
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
