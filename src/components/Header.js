import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import {
    FaHome,
    FaUserGraduate,
    FaSignInAlt,
    FaChalkboardTeacher,
    FaUserShield,
    FaTools,
    FaBars,
    FaUserCircle,
    FaTimes, FaLightbulb, FaSignOutAlt,
} from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";


function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false); // New state
    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem("adminToken");
        const studentToken = localStorage.getItem("studentToken"); // Get student token

        if (adminToken) {
            const role = localStorage.getItem("adminRole");
            setIsAdmin(role === "admin");
        } else {
            setIsAdmin(false);
        }

        // Check if student token exists
        setIsStudentLoggedIn(!!studentToken);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentRole");
        navigate("/student-login?msg=Logged out", { replace: true });
    };

    return (
        <header className="header">
            <div className="header-container w-100">
                {/* Logo */}
                <h2 className="logo">French Notes</h2>

                {/* Hamburger icon (mobile only) */}
                <button
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle Menu"
                >
                    {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                </button>

                {/* Navigation */}
                <nav className={`nav ${menuOpen ? "open" : ""}`}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>
                        <FaHome /> Home
                    </Link>
                    <Link to="/student-dashboard" onClick={() => setMenuOpen(false)}>
                        <FaChalkboardTeacher /> Student Dashboard
                    </Link>
                    <Link to="/ideas" onClick={() => setMenuOpen(false)}>
                        <FaLightbulb /> Ideas
                    </Link>
                    <Link to="/student-register" onClick={() => setMenuOpen(false)}>
                        <FaUserGraduate /> Student Register
                    </Link>

                    <Link to="/student-login" onClick={() => setMenuOpen(false)}>
                        <FaSignInAlt /> Student Login
                    </Link>

                    <Link to="/admin-login" onClick={() => setMenuOpen(false)}>
                        <FaUserShield /> Admin Login
                    </Link>


                    {/* Conditionally render Admin Dashboard link based on the isAdmin state */}
                    {isAdmin && (
                        <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)}>
                            <FaTools /> Admin Dashboard
                        </Link>
                    )}

                    {!isAdmin && (
                        <Link to="/profile" onClick={() => setMenuOpen(false)}>
                            <FaUserCircle /> Profile
                        </Link>
                    )}

                    {/* Conditionally render Logout button based on the student login state */}
                    {isStudentLoggedIn && (
                        <Link to="/student-login" onClick={handleLogout} className="">
                            <FaSignOutAlt/> Logout
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;