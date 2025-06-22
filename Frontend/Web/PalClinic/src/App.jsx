import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import UnderDevelopment from "./Components/UnderDevelopment";
import LoginPage from "./Pages/Auth/LogIn";
import Unauthorized from "./Components/Unauthorized";
import HealthCenterAdminPage from "./Pages/admin/HealthCenter";
import { ToastContainer } from "react-toastify";

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
          path="/clinicModerator"
          element={
            <ProtectedRoute allowedRoles={["clinic_moderator"]}>
              <UnderDevelopment />
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
        {/* Optionally add default or fallback routes */}
      </Routes>
    </Router>
  );
}

export default App;
