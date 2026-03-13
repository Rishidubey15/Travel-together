import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "./lib/auth-client";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import VerifyOrganisation from "./pages/VerifyOrganisation";
import OrganisationRides from "./pages/OrganisationRides";
import CreateRide from "./pages/CreateRide";
import MyRides from "./pages/MyRides";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";

function ProtectedRoute({ children }) {
  const { data: session, isPending } = useSession();
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 dark:border-teal-400" />
      </div>
    );
  }
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { data: session, isPending } = useSession();
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 dark:border-teal-400" />
      </div>
    );
  }
  if (session) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function WithNav({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"  element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute><WithNav><Home /></WithNav></ProtectedRoute>
        } />
        <Route path="/verify-organisation" element={
          <ProtectedRoute><WithNav><VerifyOrganisation /></WithNav></ProtectedRoute>
        } />
        <Route path="/verify-organisation/external" element={
          <ProtectedRoute><WithNav><VerifyOrganisation external /></WithNav></ProtectedRoute>
        } />

        {/* Ride routes */}
        <Route path="/organisation-rides" element={
          <ProtectedRoute><WithNav><OrganisationRides /></WithNav></ProtectedRoute>
        } />
        <Route path="/create-ride" element={
          <ProtectedRoute><WithNav><CreateRide /></WithNav></ProtectedRoute>
        } />
        <Route path="/my-rides" element={
          <ProtectedRoute><WithNav><MyRides /></WithNav></ProtectedRoute>
        } />

        {/* Profile */}
        <Route path="/profile" element={
          <ProtectedRoute><WithNav><Profile /></WithNav></ProtectedRoute>
        } />

        {/* Error page */}
        <Route path="/error" element={<ErrorPage />} />

        {/* 404 catch-all */}
        <Route
          path="*"
          element={
            <Navigate
              to="/error?code=404&type=Page+Not+Found&message=The+page+you%27re+looking+for+doesn%27t+exist+or+has+been+moved."
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
