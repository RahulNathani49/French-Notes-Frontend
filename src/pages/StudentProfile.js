import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

function StudentProfile() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("studentToken");
                if (!token) {
                    setError("Unauthorized. Please login again.");
                    return;
                }

                const res = await api.get("/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res?.data?.role === "student") {
                    setProfile(res.data);
                } else {
                    setError("Access denied. Only students can view this page.");
                }
            } catch (err) {
                setError(err?.response?.data?.error || "Failed to load profile.");
            }
        };

        fetchProfile();
    }, []);

    return (
        <Layout>

            <div className="container mt-4">
                <h2 className="fw-bold text-primary mb-4">Student Profile</h2>

                {error && <p className="text-danger">{error}</p>}

                {profile ? (
                    <div className="card shadow-sm p-4 w-100">
                        <h4 className="mb-3"> Welcome {profile.name}</h4>
                        <p>
                            <strong>Username:</strong> {profile.username}
                        </p>
                        <p>
                            <strong>Email:</strong> {profile.email}
                        </p>
                    </div>
                ) : (
                    !error && <p>Loading profile...</p>
                )}
            </div>
        </Layout>
    );
}

export default StudentProfile;
