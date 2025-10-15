import React, { useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [resetPassword, setResetPassword] = useState(false);
    const [recoverUsername, setRecoverUsername] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure at least one option is selected
        if (!resetPassword && !recoverUsername) {
            setMessage("Please select at least one option (Reset Password or Recover Username)");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await api.post("/auth/student-forgot-password", {
                email,
                resetPassword,
                recoverUsername
            });
            setMessage(res.data.message || "Email sent successfully. Check your inbox and spam folder.");
        } catch (err) {
            setMessage(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mt-5">
                <h2>Forgot Username or Password</h2>
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

                    <div className="mb-3">
                        <label className="form-label">Select what you want to reset/recover:</label>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="resetPassword"
                                checked={resetPassword}
                                onChange={(e) => setResetPassword(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="resetPassword">
                                Reset Password
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="recoverUsername"
                                checked={recoverUsername}
                                onChange={(e) => setRecoverUsername(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="recoverUsername">
                                Recover Username
                            </label>
                        </div>
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Email"}
                    </button>
                </form>

                {message && <p className="mt-3">{message}</p>}
            </div>
        </Layout>
    );
}

export default ForgotPassword;
