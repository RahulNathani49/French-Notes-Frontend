import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import "./index.css"; // import your central CSS file

import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import IdeasPage from "./pages/IdeasPage";
import StudentRegister from "./pages/StudentRegister";
import StudentProfile from "./pages/StudentProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/student-register" element={<StudentRegister />} />
                <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/ideas" element={<IdeasPage />} /> {/* This is the missing route */}

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>

            {/* ✅ ToastContainer placed outside Routes so it works globally */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </Router>
    );
}

export default App;
