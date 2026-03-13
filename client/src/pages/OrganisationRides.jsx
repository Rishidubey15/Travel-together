import RideCard from "../components/RideCard";

const MOCK_RIDES = [
  {
    id: "1",
    destination: "Delhi → Manali",
    travelDate: "15 Apr 2025",
    budget: "₹3,000 – ₹5,000",
    postedBy: "Priya S.",
  },
  {
    id: "2",
    destination: "Bangalore → Goa",
    travelDate: "22 Apr 2025",
    budget: "₹2,500 – ₹4,000",
    postedBy: "Rahul K.",
  },
  {
    id: "3",
    destination: "Mumbai → Udaipur",
    travelDate: "10 May 2025",
    budget: "₹4,000 – ₹6,000",
    postedBy: "Anita M.",
  },
];

export default function OrganisationRides() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
          Organisation Rides
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Rides shared by members from your organisation (mock data).
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_RIDES.map((ride) => (
            <li key={ride.id}>
              <RideCard ride={ride} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
