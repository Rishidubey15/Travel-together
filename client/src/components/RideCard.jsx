export default function RideCard({ ride }) {
  const { destination, travelDate, budget, postedBy } = ride;

  return (
    <article className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">{destination}</h3>
        <dl className="flex flex-col gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <dt className="text-slate-500 dark:text-slate-400">Travel Date</dt>
            <dd>{travelDate}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500 dark:text-slate-400">Budget</dt>
            <dd>{budget}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500 dark:text-slate-400">Posted by</dt>
            <dd className="font-medium text-slate-700 dark:text-slate-300">{postedBy}</dd>
          </div>
        </dl>
        <button
          type="button"
          className="mt-2 w-full py-2.5 rounded-lg bg-teal-600 dark:bg-teal-500 text-white font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
        >
          Request to Join
        </button>
      </div>
    </article>
  );
}
