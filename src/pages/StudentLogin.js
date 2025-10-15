import React, { useState, useEffect } from "react";
import {useNavigate, useLocation, Link} from "react-router-dom";
import api from "../api/axios";
import "../index.css";
import Layout from "../components/Layout";

// helper to generate UUID (for deviceId)
function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function StudentLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [deviceId, setDeviceId] = useState("");
    const [deviceInfo, setDeviceInfo] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // check if deviceId already exists in localStorage
        let storedId = localStorage.getItem("studentDeviceId");
        if (!storedId) {
            storedId = generateUUID();
            localStorage.setItem("studentDeviceId", storedId);
        }
        setDeviceId(storedId);

        // capture browser/device info
        setDeviceInfo(navigator.userAgent);

        // Check if redirected with a message (e.g., after logout/session expired)
        const params = new URLSearchParams(location.search);
        const msg = params.get("msg");
        if (msg) setMessage(msg);

        // If already logged in as student → go straight to dashboard
        const token = localStorage.getItem("studentToken");
        const role = localStorage.getItem("studentRole");
        if (token && role === "student") {
            navigate("/student-dashboard", { replace: true });
        }
    }, [location, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); // start loading

        try {
            const res = await api.post("/auth/student-login", {
                username,
                password,
                deviceId,
                deviceInfo,
            });

            const token = res?.data?.token;
            const errorMsg = res?.data?.error || res?.data?.message;

            if (token) {
                localStorage.setItem("studentToken", token);
                localStorage.setItem("studentRole", "student");
                navigate("/student-dashboard");
            } else {
                setMessage(errorMsg || "Login failed. Please try again.");
            }
        } catch (err) {
            const serverError =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "Login failed. Please try again.";
            setMessage(serverError);
        }
        finally {
            setIsLoading(false); // stop loading
        }
    };


    return (
        <Layout>
            <div style={{padding: "20px", maxWidth: "400px", margin: "50px auto"}}>
                <h2>Student Login</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit" style={{margin: "10px 0"}} disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                    <p className="mt-3">
                        <Link to="/forgot-password">Forgot Username?</Link>
                    </p>
                    <p className="mt-3">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </p>


                </form>
                {message && <p style={{color: "crimson"}}>{message}</p>}
            </div>
        </Layout>
    );
}

export default StudentLogin;
