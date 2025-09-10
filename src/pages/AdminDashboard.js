import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import "../index.css";

function AdminDashboard() {
    // =====================
    // Login Logs State
    // =====================
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterType, setFilterType] = useState(""); // state for selected filter
    const [filter, setFilter] = useState("all");

    // =====================
    // Content State
    // =====================
    const [contents, setContents] = useState([]);
    const [contentType, setContentType] = useState("reading");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState(null); // for uploaded image
    const [audioFile, setAudioFile] = useState(null); //for audio upload
    const [message, setMessage] = useState(""); // For success or error messages

    const [contentError, setContentError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        type: "",
        text: "",
        imageUrl: "",
        imageFile: null,
    });

    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("login"); // default section
    // Guard: require Admin token + role
    const redirectToLogin = (msg = "Please admin as student") => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");
        navigate(`/admin-login?msg=${encodeURIComponent(msg)}`, { replace: true });
    };
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        const role = localStorage.getItem("adminRole");
        if (!token || role !== "admin") {
            redirectToLogin("Access denied. Admin login required.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // =====================
    // Logout handler
    // =====================
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");
        navigate("/admin-login?msg=Logged out", { replace: true });
    };

    // =====================
    // Edit handlers
    // =====================
    const handleEditClick = (c) => {
        setEditingId(c._id);
        setEditForm({
            title: c.title,
            type: c.type,
            text: c.text,
            imageUrl: c.imageUrl || "",
            imageFile: null,
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateContent = async () => {
        if (!editingId) return;

        try {
            const token = localStorage.getItem("adminToken");

            const formData = new FormData();
            formData.append("title", editForm.title);
            formData.append("type", editForm.type);
            formData.append("text", editForm.text);
            if (editForm.imageFile) {
                formData.append("image", editForm.imageFile);
            }

            const res = await api.put(`/content/${editingId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setContents((prev) =>
                prev.map((c) => (c._id === editingId ? res.data : c))
            );
            setEditingId(null);
            setEditForm({ title: "", type: "", text: "", imageUrl: "", imageFile: null });
            setMessage("Content updated successfully!"); // show success message

            setContentError("");
        } catch (err) {
            console.error("Update failed:", err);
            setContentError(
                err?.response?.data?.error || "Failed to update content"
            );
        }
    };

    // =====================
    // Fetch Login Logs
    // =====================
    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setError("Please login as admin first.");
                setLoading(false);
                return;
            }
            const res = await api.get("/admin/login-logs", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLogs(res.data.filter((log) => log.userId !== null));
            setError("");
        } catch (err) {
            setError("Failed to fetch logs. Check backend and CORS.");
        } finally {
            setLoading(false);
        }
    };

    // =====================
    // Approve/Deny Logs
    // =====================
    const handleApprove = async (id, status) => {
        try {
            const token = localStorage.getItem("adminToken");
            await api.post(
                `/admin/login-logs/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLogs((prevLogs) =>
                prevLogs.map((log) =>
                    log._id === id ? { ...log, status } : log
                )
            );
        } catch (err) {
            alert("Failed to update log. Check backend.");
        }
    };

    // =====================
    // Fetch Content
    // =====================
    const fetchContent = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await api.get("/content", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContents(res.data);
        } catch (err) {
            setContentError("Failed to fetch content.");
        }
    };

    // =====================
    // Add Content
    // =====================
    const handleAddContent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setContentError("You must be logged in as admin.");
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("type", contentType);
            formData.append("text", text);

            if (file) formData.append("image", file);
            if (audioFile) formData.append("audio", audioFile);


            const res = await api.post("/content", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setContents((prev) => [...prev, res.data]);
            setTitle("");
            setText("");
            setFile(null);
            setContentError("");
            setMessage("Content added successfully!"); // show success message


        } catch (err) {
            console.error("❌ Add content error:", err);
            setContentError(
                err.response?.data?.error || "Failed to add content."
            );
        }
    };

    // =====================
    // Delete Content
    // =====================
    const handleDeleteContent = async (id) => {
        try {
            const token = localStorage.getItem("adminToken");
            await api.delete(`/content/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContents(contents.filter((c) => c._id !== id));
        } catch (err) {
            alert("Failed to delete content.");
        }
    };

    useEffect(() => {
        fetchLogs();
        fetchContent();
    }, []);

    // =====================
    // Filter Logs
    // =====================
    const displayedLogs = logs.filter((log) => {
        if (filter === "pending") return log.status === "pending";
        if (filter === "approved") return log.status === "approved";
        if (filter === "denied") return log.status === "denied";
        return true;
    });

    return (
        <Layout>
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <aside className="col-12 col-md-3 col-lg-2 bg-light p-3 border-end">
                        <h2 className="h5 fw-bold mb-3">Admin Panel</h2>
                        <div className="d-grid gap-2">
                            <button
                                className={`btn ${activeSection === "login" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setActiveSection("login")}
                            >
                                Login Requests
                            </button>
                            <button
                                className={`btn ${activeSection === "manage" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setActiveSection("manage")}
                            >
                                Manage Content
                            </button>
                            <button
                                className={`btn ${activeSection === "add" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setActiveSection("add")}
                            >
                                Add Content
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="col-12 col-md-9 col-lg-10 p-4">
                        {error && <p className="text-danger">{error}</p>}

                        {/* Login Requests Section */}
                        {activeSection === "login" && (
                            <div>
                                <h3 className="mb-3">Login Requests</h3>
                                <div className="mb-3 d-flex flex-wrap gap-2">
                                    {["all", "pending", "approved", "denied"].map((f) => (
                                        <button
                                            key={f}
                                            className={`btn ${filter === f ? "btn-primary" : "btn-outline-primary"}`}
                                            onClick={() => setFilter(f)}
                                        >
                                            {f.charAt(0).toUpperCase() + f.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead className="table-light">
                                        <tr>
                                            <th>Student Username</th>
                                            <th>Email</th>
                                            <th>Device ID</th>
                                            <th>Device Info</th>
                                            <th>Status</th>
                                            <th>Requested At</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {displayedLogs.length > 0 ? (
                                            displayedLogs.map((log) => (
                                                <tr key={log._id}>
                                                    <td>{log.userId?.username || log.username}</td>
                                                    <td>{log.userId?.email || "N/A"}</td>
                                                    <td>{log.deviceId}</td>
                                                    <td>{log.deviceInfo}</td>
                                                    <td>{log.status}</td>
                                                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => handleApprove(log._id, "approved")}
                                                                disabled={log.status === "approved"}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleApprove(log._id, "denied")}
                                                                disabled={log.status === "denied"}
                                                            >
                                                                Deny
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center">No requests found</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Manage Content Section */}
                        {activeSection === "manage" && (
                            <div>
                                <h3 className="mb-3">Manage Content</h3>
                                {contentError && <p className="text-danger">{contentError}</p>}

                                <div className="mb-3">
                                    <label className="form-label">Filter by Type:</label>
                                    <select
                                        className="form-select w-auto d-inline-block"
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                    >
                                        <option value="">All</option>
                                        <option value="writing">Writing</option>
                                        <option value="speaking">Speaking</option>
                                        <option value="listening">Listening</option>
                                        <option value="reading">Reading</option>
                                    </select>
                                </div>

                                {editingId && (
                                    <div className="card p-3 mb-3">
                                        <h4>Edit Content</h4>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-control mb-2"
                                            value={editForm.title}
                                            onChange={handleEditChange}
                                            placeholder="Title"
                                        />
                                        <select
                                            name="type"
                                            className="form-select mb-2"
                                            value={editForm.type}
                                            onChange={handleEditChange}
                                        >
                                            <option value="reading">Reading</option>
                                            <option value="writing">Writing</option>
                                            <option value="listening">Listening</option>
                                            <option value="speaking">Speaking</option>
                                        </select>
                                        <textarea
                                            name="text"
                                            className="form-control mb-2"
                                            value={editForm.text}
                                            onChange={handleEditChange}
                                            rows="4"
                                        />
                                        <label className="form-label">Upload Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="form-control mb-2"
                                            onChange={(e) =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    imageFile: e.target.files[0],
                                                }))
                                            }
                                        />
                                        <label className="form-label">Upload Audio</label>
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            className="form-control mb-3"
                                            onChange={(e) =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    audioFile: e.target.files[0],
                                                }))
                                            }
                                        />
                                        {message && <p className="text-success">{message}</p>}
                                        <div className="d-flex gap-2">
                                            <button type="button" className="btn btn-primary" onClick={handleUpdateContent}>
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="table-light">
                                        <tr>
                                            <th>Type</th>
                                            <th>Title</th>
                                            <th>Image</th>
                                            <th>Audio</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {contents
                                            .filter((c) => !filterType || c.type === filterType)
                                            .map((c) => (
                                                <tr key={c._id}>
                                                    <td>{c.type}</td>
                                                    <td>{c.title}</td>
                                                    <td>
                                                        {c.imageUrl && (
                                                            <img
                                                                src={c.imageUrl}
                                                                alt={c.title}
                                                                className="img-fluid rounded"
                                                                style={{ maxWidth: "150px" }}
                                                            />
                                                        )}
                                                    </td>
                                                    <td>
                                                        {c.audioUrl && (
                                                            <audio controls className="w-100 mt-2">
                                                                <source src={c.audioUrl} type="audio/mpeg" />
                                                                Your browser does not support the audio element.
                                                            </audio>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => handleEditClick(c)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDeleteContent(c._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Add Content Section */}
                        {activeSection === "add" && (
                            <div>
                                <h3 className="mb-3">Add Content</h3>
                                <form onSubmit={handleAddContent} className="card p-3 my-5 w-100">
                                    <div className="mb-3">
                                        <label className="form-label">Type:</label>
                                        <select
                                            className="form-select"
                                            value={contentType}
                                            onChange={(e) => setContentType(e.target.value)}
                                        >
                                            <option value="reading">Reading</option>
                                            <option value="writing">Writing</option>
                                            <option value="listening">Listening</option>
                                            <option value="speaking">Speaking</option>
                                        </select>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        className="form-control mb-2"
                                        placeholder="Content text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        required
                                        rows="4"
                                    />
                                    <label className="form-label">Upload Image:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control mb-2"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <label className="form-label">Upload Audio:</label>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        className="form-control mb-3"
                                        onChange={(e) => setAudioFile(e.target.files[0])}
                                    />
                                    {message && <p className="text-success">{message}</p>}
                                    <button type="submit" className="btn btn-success">
                                        Add Content
                                    </button>
                                </form>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </Layout>
    );
}

export default AdminDashboard;
