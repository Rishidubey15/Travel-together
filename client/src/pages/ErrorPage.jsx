import { useSearchParams, Link, useNavigate } from "react-router-dom";

// Error definitions for known codes
const ERROR_DEFINITIONS = {
  400: { title: "Bad Request",           message: "The request could not be understood by the server." },
  401: { title: "Unauthorized",          message: "You need to be logged in to access this page." },
  403: { title: "Access Forbidden",      message: "You don't have permission to view this page." },
  404: { title: "Page Not Found",        message: "The page you're looking for doesn't exist or has been moved." },
  408: { title: "Request Timeout",       message: "The server took too long to respond. Please try again." },
  429: { title: "Too Many Requests",     message: "You've made too many requests. Please slow down and try again." },
  500: { title: "Internal Server Error", message: "Something went wrong on our end. We're working on it." },
  502: { title: "Bad Gateway",           message: "The server received an invalid response. Please try again later." },
  503: { title: "Service Unavailable",   message: "The service is temporarily unavailable. Please try again later." },
};

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read from query params: ?code=404&message=Custom+msg&type=Custom+Title
  const rawCode    = searchParams.get("code")    || "Error";
  const rawMessage = searchParams.get("message") || null;
  const rawType    = searchParams.get("type")    || null;

  const numericCode = parseInt(rawCode, 10);
  const definition  = ERROR_DEFINITIONS[numericCode] || null;

  const errorCode    = rawCode;
  const errorTitle   = rawType    || definition?.title   || "Unexpected Error";
  const errorMessage = rawMessage || definition?.message || "An unexpected error occurred.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-200/30 dark:bg-teal-900/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-cyan-200/30 dark:bg-cyan-900/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg text-center">

        {/* Big error code */}
        <div className="mb-4 select-none">
          <span className="text-[7rem] sm:text-[9rem] font-black leading-none bg-gradient-to-br from-teal-400 to-cyan-500 dark:from-teal-500 dark:to-cyan-400 bg-clip-text text-transparent">
            {errorCode}
          </span>
        </div>

        {/* Warning icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
          {errorTitle}
        </h1>

        {/* Message */}
        <p className="text-slate-500 dark:text-slate-400 text-base mb-6 max-w-sm mx-auto leading-relaxed">
          {errorMessage}
        </p>

        {/* Query params detail card */}
        <div className="mb-6 mx-auto max-w-sm rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 text-left space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Error Details
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-mono">?code</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{errorCode}</span>
          </div>
          <div className="w-full h-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-mono">?type</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">{errorTitle}</span>
          </div>
          <div className="w-full h-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-start justify-between text-sm gap-4">
            <span className="text-slate-500 dark:text-slate-400 font-mono flex-shrink-0">?message</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 text-right">{errorMessage}</span>
          </div>
        </div>

        

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Go to Home
          </Link>
          
        </div>
      </div>
    </div>
  );
}
