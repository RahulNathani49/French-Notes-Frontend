import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";

function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Call the admin login route
            const res = await api.post("/auth/admin-login", { username, password });

            // Store admin token + role in localStorage
            localStorage.setItem("adminToken", res.data.token);
            localStorage.setItem("adminRole", res.data.role || "admin");

            // Redirect to admin dashboard
            navigate("/admin-dashboard");
        } catch (err) {
            console.error("Admin login error:", err);
            setError(err.response?.data?.error || "Login failed. Check credentials and try again.");
        }
    };

    return (
        <Layout>
            <div style={{ padding: "50px", textAlign: "center" }}>
                <h2>Admin Login</h2>

                {/* Optional message from redirect (logout, unauthorized, etc.) */}
                {location.search && (
                    <p style={{ color: "orange" }}>
                        {new URLSearchParams(location.search).get("msg")}
                    </p>
                )}

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <br />
                    <button type="submit" style={buttonStyle}>
                        Login
                    </button>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </Layout>
    );
}

const inputStyle = {
    padding: "10px",
    margin: "10px",
    fontSize: "16px",
    width: "250px",
};

const buttonStyle = {
    padding: "10px 20px",
    margin: "10px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
};

export default AdminLogin;
