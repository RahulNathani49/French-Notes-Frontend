import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import {toast} from "react-toastify";

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedPassword = password.trim();
        if (!trimmedPassword ) {
            toast.error("Password required");
            return;
        }
        if (trimmedPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (/\s/.test(trimmedPassword)) {
            toast.error("Password cannot contain spaces");
            return;
        }
        setIsLoading(true);

        try {
            const res = await api.post(`/auth/student-reset-password/${token}`, { password: trimmedPassword });
            setMessage(res.data.message);
            setTimeout(() => navigate("/student-login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.error || "Reset failed");
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mt-5">
                <h3>Reset Password</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control mb-3"
                        required
                    />
                    <button className="btn btn-success w-100" type="submit" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Reset Password"}
                    </button>
                </form>
                {message && <p className="mt-3 text-info">{message}</p>}
            </div>

        </Layout>
    );
}

export default ResetPassword;
