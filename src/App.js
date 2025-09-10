import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import './index.css'; // import your central CSS file

import StudentLogin from "./pages/StudentLogin";

import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";  // ✅ add this

import StudentRegister from "./pages/StudentRegister";
import StudentProfile from "./pages/StudentProfile"; // ✅ new import
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/student-register" element={<StudentRegister />} /> {/* ✅ new route */}
                <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />   {/* ✅ new route */}

                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
        </Router>
    );
}

export default App;
