import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/auth/student-reset-password/${token}`, { password });
            setMessage(res.data.message);
            setTimeout(() => navigate("/student-login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.error || "Reset failed");
        }
    };

    return (
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
                <button className="btn btn-success w-100" type="submit">Reset Password</button>
            </form>
            {message && <p className="mt-3 text-info">{message}</p>}
        </div>
    );
}

export default ResetPassword;
