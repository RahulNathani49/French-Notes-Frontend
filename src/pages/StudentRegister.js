import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function StudentRegister() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/student-register", {
                username,
                password,
                name,
                email
            });
            setMessage("✅ Student registered successfully. You can now log in.");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/student-login");
            }, 2000);
        } catch (err) {
            setMessage(err.response?.data?.error || "❌ Registration failed");
        }
    };

    return (
        <Layout>


        <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
            <h2>Student Registration</h2>
            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Name: </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Register</button>
            </form>

            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>
        </Layout>
    );
}

export default StudentRegister;
