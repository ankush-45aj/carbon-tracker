import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const auth = localStorage.getItem("isAuth");

  if (auth) {
    return children;
  }

  return <Navigate to="/login" />;

}