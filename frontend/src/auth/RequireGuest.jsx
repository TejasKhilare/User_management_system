import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RequireGuest({ children }) {
  const { token } = useContext(AuthContext);

  // If user is already logged in, block login page
  if (token) {
    return <Navigate to="/users" replace />;
  }

  return children;
}
