import { Link } from "react-router-dom";

const services = [
  {
    title: "Travel buddy discovery",
    description: "Find like-minded travellers from your organisation.",
    icon: "👥",
  },
  {
    title: "Organisation based ride sharing",
    description: "Share rides with colleagues you can trust.",
    icon: "🚗",
  },
  {
    title: "Safe verified travellers",
    description: "Travel with people verified within your organisation.",
    icon: "✓",
  },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-3xl mb-4">
            🧳
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
            Travel Together
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Find trusted travel companions from your organisation.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center">
            What we offer
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {services.map((s) => (
              <li
                key={s.title}
                className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm"
              >
                <span className="text-2xl mb-2 block">{s.icon}</span>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{s.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="text-center">
          <Link
            to="/verify-organisation"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 shadow-md hover:shadow-lg transition-all"
          >
            Verify Organisation to View Rides
          </Link>
        </div>
      </div>
    </div>
  );
}
