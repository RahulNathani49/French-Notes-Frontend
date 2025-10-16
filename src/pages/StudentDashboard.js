import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import "../studentdashboard.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { marked } from "marked";



function StudentDashboard() {
    const [content, setContent] = useState([]);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("writing");
    const [activeContent, setActiveContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();

    // Helper: send user to login
    const redirectToLogin = (msg = "Please login as student") => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentRole");
        navigate(`/student-login?msg=${encodeURIComponent(msg)}`, { replace: true });
    };

    // Guard: require student token + role
    useEffect(() => {
        const token = localStorage.getItem("studentToken");
        const role = localStorage.getItem("studentRole");
        if (!token || role !== "student") {
            redirectToLogin("Access denied. Student login required.");
        }
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
                params: { type: activeTab },
            });

            if (Array.isArray(res.data)) {
                setContent(res.data);
                if (res.data.length > 0) {
                    setActiveContent(res.data[0]);
                } else {
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
    }, [activeTab]);

    // Handles content selection and sidebar closing
    const handleContentClick = (item) => {
        setActiveContent(item);
        if (window.innerWidth < 992) {
            setIsSidebarOpen(false);
        }
    };

    // Handles tab change and sidebar closing
    const handleTabChange = (tab) => {
        setActiveTab(tab);

    };

    return (
        <Layout>
            <div className="container-fluid py-4">
                {/* Mobile Menu Toggle Button */}
                <div className="d-lg-none my-3 d-flex justify-content-between">
                    <button className="btn btn-dark" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} /> Choose Notes
                    </button>
                </div>

                {/* Loading & Message */}
                {loading && <div className="alert alert-info">Loading content...</div>}
                {message && !loading && (
                    <div className="alert alert-warning">{message}</div>
                )}

                {/* Content Area */}
                <div className="row">
                    <h3 className="fw-bold text-capitalize my-3">{activeTab} Section</h3>

                    {/* Sidebar Container */}
                    <div className={`col-lg-2 sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
                        <div className="card shadow-sm w-100 h-100">
                            <div className="card-header fw-bold d-flex justify-content-between align-items-center">
                                Categories
                                <button
                                    className="btn-close d-lg-none"
                                    onClick={() => setIsSidebarOpen(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            {/* Navigation links within the sidebar */}
                            <div className="list-group list-group-flush mb-4">
                                {["writing", "speaking", "listening", "reading"].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`list-group-item my-1 list-group-item-action text-capitalize ${activeTab === tab ? "active" : ""}`}
                                        onClick={() => handleTabChange(tab)}
                                        disabled={loading}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="card-header fw-bold d-flex justify-content-between align-items-center">
                                Available {activeTab} notes
                            </div>
                            <div className="list-group list-group-flush overflow-auto">
                                {content.length === 0 && (
                                    <p className="text-muted m-3">No items available</p>
                                )}
                                {content.map((item) => (
                                    <button
                                        key={item._id}
                                        className={`list-group-item my-1 list-group-item-action ${
                                            activeContent?._id === item._id ? "active" : ""
                                        }`}
                                        onClick={() => handleContentClick(item)}
                                    >
                                        {item.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Viewer */}
                    <div className="col-lg-10 col-xs-12 content-viewer">
                        <div className="card shadow-sm p-4 w-100">
                            {activeContent ? (
                                <>
                                    <h3 className="fw-bold text-dark mb-3">
                                        {activeContent.title}
                                    </h3>
                                    <div
                                        className="text-dark"
                                        dangerouslySetInnerHTML={{__html: activeContent.text}}
                                    ></div>
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
                                <p className="text-muted">Select a topic to continue</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default StudentDashboard;