import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import "../studentdashboard.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";


function StudentDashboard() {
    const [content, setContent] = useState([]);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("writing");
    const [activeContent, setActiveContent] = useState(null); // selected content
    const [template, setTemplate] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Helper: send user to login
    const redirectToLogin = (msg = "Please login as student") => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentRole");
        navigate(`/student-login?msg=${encodeURIComponent(msg)}`, { replace: true });
    };

    const handleLogout = () => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentRole");
        navigate("/student-login?msg=Logged out", { replace: true });
    };

    // Guard: require student token + role
    useEffect(() => {
        const token = localStorage.getItem("studentToken");
        const role = localStorage.getItem("studentRole");
        if (!token || role !== "student") {
            redirectToLogin("Access denied. Student login required.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch content by type
    const fetchContent = async () => {
        const token = localStorage.getItem("studentToken");
        const role = localStorage.getItem("studentRole");
        if (!token || role !== "student") {
            redirectToLogin("Please login first.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setContent([]);
            setActiveContent(null);

            const res = await api.get("/content/", {
                headers: { Authorization: `Bearer ${token}` },
                params: { type: activeTab }, // filter by type
            });

            if (Array.isArray(res.data)) {
                setContent(res.data);
                if (res.data.length === 0) {

                    toast.error(`No content found for "${activeTab}".`);
                }
            } else {
                toast.error("Unexpected response from server");

            }
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
                redirectToLogin("Session expired or unauthorized. Please login again.");
                return;
            }
            console.error("Fetch content error:", err);
            setMessage(err?.response?.data?.error || "Failed to load content");
        } finally {
            setLoading(false);
        }
    };

    // Refetch whenever tab changes
    useEffect(() => {
        fetchContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const templates = ["Basic Template", "Intermediate Template", "Advanced Template"];

    return (
        <Layout>
            <div className="container-fluid py-4">
                {/* Header */}
                <div className=" d-flex justify-content-between align-items-center mb-4 flex-wrap py-2">
                    <h2 className="fw-bold text-primary fs-4 fs-md-1 ">French Notes Student Dashboard</h2>
                    <button className="btn btn-danger " onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {/* Tabs */}
                <ul className="nav nav-pills mb-4 justify-content-center flex-wrap d-flex">
                    {["writing", "speaking", "listening", "reading"].map((tab) => (
                        <li className="nav-item mx-1 m-2 " key={tab}>
                            <button
                                className={`nav-link ${activeTab === tab ? "active" : ""} text-capitalize`}
                                onClick={() => !loading && setActiveTab(tab)}
                                disabled={loading}
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                </ul>


                {/* Loading & Message */}
                {loading && <div className="alert alert-info">Loading content...</div>}
                {message && !loading && (
                    <div className="alert alert-warning">{message}</div>
                )}

                {/* Content Area */}
                <div className="row">
                    {/* Sidebar */}
                    <div className="mb-4 col-lg-2 col-xs-12">
                        <div className="card shadow-sm w-100">
                            <div className="card-header fw-bold mb-4">
                                Available {activeTab} Notes
                            </div>
                            <div className="list-group list-group-flush">
                                {content.length === 0 && (
                                    <p className="text-muted m-3">No items available</p>
                                )}
                                {content.map((item) => (
                                    <button
                                        key={item._id}
                                        className={`list-group-item list-group-item-action ${
                                            activeContent?._id === item._id ? "active" : ""
                                        }`}
                                        onClick={() => setActiveContent(item)}
                                    >
                                        {item.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Viewer */}
                    <div className="col-lg-10 col-xs-12">
                        <div className="card shadow-sm p-4 w-100" >
                            {activeContent ? (
                                <>
                                    <h3 className="fw-bold text-dark mb-3">
                                        {activeContent.title}
                                    </h3>
                                    <p style={{whiteSpace: "pre-wrap"}}>{activeContent.text}</p>

                                    {/* Image */}
                                    {activeContent.imageUrl && (
                                        <img
                                            src={activeContent.imageUrl}
                                            alt={activeContent.title}
                                            className="img-fluid mb-3 rounded shadow"
                                            style={{maxWidth: "400px"}}
                                        />
                                    )}

                                    {/* Audio */}
                                    {activeContent.audioUrl && (
                                        <audio controls className="w-100 mt-3">
                                            <source src={activeContent.audioUrl} type="audio/mpeg"/>
                                            Your browser does not support the audio element.
                                        </audio>
                                    )}
                                </>
                            ) : (
                                <p className="text-muted">Select a note from the left sidebar</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );

}

export default StudentDashboard;
