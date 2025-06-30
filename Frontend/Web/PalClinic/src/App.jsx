import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/general/ProtectedRoute";
import UnderDevelopment from "./Components/general/UnderDevelopment";
import LoginPage from "./Pages/Auth/LogIn";
import Unauthorized from "./Components/general/Unauthorized";
import HealthCenterAdminPage from "./Pages/admin/HealthCenter";
import ClinicAdminPage from "./Pages/admin/Clinics";
import ClinicMHome from "./Pages/ClinicModerator/Home";
import { ToastContainer } from "react-toastify";
import DoctorManagementPage from "./Pages/ClinicModerator/DoctorManagment";
import AppointmentsManagment from "./Pages/ClinicModerator/AppointmentsManagment";
import DoctorHome from "./Pages/Doctor/Home";
import DoctorPatient from "./Pages/Doctor/Patients";
import DoctorRequest from "./Pages/Doctor/Request";
import PatientProfile from "./Components/Doctor/Patients/PatientProfile";
import ChatPage from "./Components/Chat/ChatPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/admin/healthCenters"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <HealthCenterAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clinics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ClinicAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/statistics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UnderDevelopment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinicModerator/home"
          element={
            <ProtectedRoute allowedRoles={["clinic_moderator"]}>
              <ClinicMHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinicModerator/doctors"
          element={
            <ProtectedRoute allowedRoles={["clinic_moderator"]}>
              <DoctorManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinicModerator/appointments"
          element={
            <ProtectedRoute allowedRoles={["clinic_moderator"]}>
              <AppointmentsManagment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/home"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients/profile/:patientId"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/requests"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorRequest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/healthModerator"
          element={
            <ProtectedRoute allowedRoles={["healthcarecenter_moderator"]}>
              <UnderDevelopment />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
