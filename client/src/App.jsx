import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "./lib/auth-client";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import VerifyOrganisation from "./pages/VerifyOrganisation";
import OrganisationRides from "./pages/OrganisationRides";
import Profile from "./pages/Profile";

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify-organisation"
          element={
            <ProtectedRoute>
              <Navbar />
              <VerifyOrganisation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify-organisation/external"
          element={
            <ProtectedRoute>
              <Navbar />
              <VerifyOrganisation external />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organisation-rides"
          element={
            <ProtectedRoute>
              <Navbar />
              <OrganisationRides />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navbar />
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
