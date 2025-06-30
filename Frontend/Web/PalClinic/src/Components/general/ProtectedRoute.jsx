import { Navigate } from "react-router-dom";
import { getUser } from "../../Config/UserManager";

export default function ProtectedRoute({ allowedRoles, children }) {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
