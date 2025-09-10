import React from "react";
import { Navigate } from "react-router-dom";

// role: "student" or "admin"
function PrivateRoute({ children, role }) {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) return <Navigate to="/" />; // not logged in
    if (role && userRole !== role) return <Navigate to="/" />; // wrong role

    return children;
}

export default PrivateRoute;
