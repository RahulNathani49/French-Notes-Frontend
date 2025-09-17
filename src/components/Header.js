import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css"; // import your central CSS file
import {
    FaHome,
    FaUserGraduate,
    FaSignInAlt,
    FaChalkboardTeacher,
    FaUserShield,
    FaTools,
    FaBars,
    FaUserCircle,
    FaTimes, FaLightbulb,
} from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

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
                    <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)}>
                        <FaTools /> Admin Dashboard
                    </Link>

                    <Link to="/profile" onClick={() => setMenuOpen(false)}>
                         <FaUserCircle /> Profile
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
