import { Link } from "react-router-dom";
import { useSession } from "../lib/auth-client";

const quickActions = [
  {
    title: "Create a Ride",
    description: "Share your journey and find travel companions.",
    icon: "🚗",
    link: "/create-ride",
  },
  {
    title: "Browse Rides",
    description: "Find available rides from your organization.",
    icon: "🔍",
    link: "/organisation-rides",
  },
  {
    title: "My Rides",
    description: "View and manage your posted rides.",
    icon: "📋",
    link: "/my-rides",
  },
];

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-3xl mb-4">
            🧳
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Ready to plan your next adventure with trusted colleagues?
          </p>
        </header>

        <section>
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-6 text-center">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.link}
                className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all hover:scale-105 block"
              >
                <span className="text-2xl mb-2 block">{action.icon}</span>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{action.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{action.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}