import React from "react";
import { Navigate, Route } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}
function ProtectedAuthRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export { ProtectedRoute, ProtectedAuthRoute };
