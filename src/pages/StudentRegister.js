import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

function StudentRegister() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const handleRegister = async (e) => {
        e.preventDefault();
        // Trim inputs to remove leading/trailing spaces
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        // Validation
        if (!trimmedUsername || !trimmedPassword || !trimmedName || !trimmedEmail) {
            toast.error("All fields are required");
            return;
        }

        if (trimmedUsername.length < 8) {
            toast.error("Username must be at least 8 characters");
            return;
        }
        if (trimmedPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (/\s/.test(trimmedUsername)) {
            toast.error("Username cannot contain spaces");
            return;
        }
        if (/\s/.test(trimmedPassword)) {
            toast.error("Password cannot contain spaces");
            return;
        }

        setIsLoading(true);

        try {
            const res = await api.post("/auth/student-register", {
                username: trimmedUsername,
                password: trimmedPassword,
                name: trimmedName,
                email: trimmedEmail,
            });
            toast.success("Student registered successfully");


            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/student-login");
            }, 2000);
        } catch (err) {
            toast.error(err.response?.data?.error || "❌ Registration failed");

        }
        finally {
            setIsLoading(false);
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

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </button>
            </form>

            {message && <p style={{marginTop: "10px"}}>{message}</p>}
        </div>
        </Layout>
    );
}

export default StudentRegister;
