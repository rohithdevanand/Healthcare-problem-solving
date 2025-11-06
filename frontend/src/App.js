import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";

// Patient Pages
import PatientLogin from "./pages/patient/PatientLogin";
import PatientSignIn from "./pages/patient/PatientSignIn";
import PatientDashboard from "./pages/patient/PatientDashboard";
import AiConsult from "./pages/patient/AiConsult";
import BookAppointment from "./pages/patient/BookAppointment";
import MyBookings from "./pages/patient/MyBookings";
import Resources from "./pages/patient/Resources";

// Hospital Pages
import HospitalLogin from "./pages/hospital/HospitalLogin";
import HospitalSignIn from "./pages/hospital/HospitalSignIn";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import DoctorManagement from "./pages/hospital/DoctorManagement";
import AppointmentRequests from "./pages/hospital/AppointmentRequests";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage />}
        />
        
        {/* Redirect /dashboard to the correct user dashboard */}
        <Route
          path="/dashboard"
          element={<DashboardRedirect />}
        />

        {/* Patient Auth */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/signin" element={<PatientSignIn />} />

        {/* Hospital Auth */}
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/signin" element={<HospitalSignIn />} />

        {/* Patient Protected Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute userType="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/ai-consult"
          element={
            <ProtectedRoute userType="patient">
              <AiConsult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/book-appointment"
          element={
            <ProtectedRoute userType="patient">
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/my-bookings"
          element={
            <ProtectedRoute userType="patient">
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/resources"
          element={
            <ProtectedRoute userType="patient">
              <Resources />
            </ProtectedRoute>
          }
        />

        {/* Hospital Protected Routes - Nested Layout */}
        <Route
          path="/hospital/dashboard"
          element={
            <ProtectedRoute userType="hospital">
              <HospitalDashboard />
            </ProtectedRoute>
          }
        >
          {/* Default child route for dashboard */}
          <Route index element={<AppointmentRequests />} /> 
          <Route path="appointments" element={<AppointmentRequests />} />
          <Route path="doctors" element={<DoctorManagement />} />
        </Route>
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

// Helper component to redirect from /dashboard
const DashboardRedirect = () => {
  const { userType, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userType === 'patient') {
    return <Navigate to="/patient/dashboard" replace />;
  } else if (userType === 'hospital') {
    return <Navigate to="/hospital/dashboard" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default App;