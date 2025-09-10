import React, { useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout"; // your axios instance

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await api.post("/auth/student-forgot-password", { email });
            setMessage(res.data.message || "Reset link sent to your email.");
        } catch (err) {
            setMessage(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>

        <div className="container mt-5">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Enter your student email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
        </Layout>

    );
}

export default ForgotPassword;
