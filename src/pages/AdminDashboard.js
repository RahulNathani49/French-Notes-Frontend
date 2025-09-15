// src/components/admin/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Import your new components
import Layout from "../components/Layout";
import UsersSection from "../components/admin/UsersSection";
import LoginLogsSection from "../components/admin/LoginLogsSection";
import ManageContentSection from "../components/admin/ManageContentSection";
import AddContentSection from "../components/admin/AddContentSection";

// Keep all the handler functions and state management in one place.
// Pass these down as props to the children components.
import {
    handleLogout,
    fetchUsers,
    handleRemoveUser,
    handleResetUserLogs,
    fetchLogs,
    handleApprove,
    fetchContent,
    handleAddContent,
    handleEditClick,
    handleEditChange,
    handleUpdateContent,
    handleDeleteContent,
} from "../utils/adminHandlers";

function AdminDashboard() {
    // States
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [filterType, setFilterType] = useState("");
    const [contents, setContents] = useState([]);
    const [contentType, setContentType] = useState("reading");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [message, setMessage] = useState("");
    const [contentError, setContentError] = useState("");
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", type: "", text: "", imageUrl: "", imageFile: null, audioFile: null });
    const [activeSection, setActiveSection] = useState("users");

    const navigate = useNavigate();

    // Admin Guard & Effects (these remain here)
    const redirectToLogin = (msg = "Please admin as student") => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");
        navigate(`/admin-login?msg=${encodeURIComponent(msg)}`, { replace: true });
    };

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        const role = localStorage.getItem("adminRole");
        if (!token || role !== "admin") redirectToLogin("Access denied. Admin login required.");
    }, []);

    useEffect(() => {
        fetchUsers(setUsers);
        fetchLogs(setLogs, setError, setLoading);
        fetchContent(setContents);
    }, []);

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
                            {["users", "login", "manage", "add"].map((section) => (
                                <button
                                    key={section}
                                    className={`btn ${activeSection === section ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setActiveSection(section)}
                                >
                                    {section === "users" ? "Manage Users" : section === "login" ? "Login Requests" : section === "manage" ? "Manage Content" : "Add Content"}
                                </button>
                            ))}
                            <button className="btn btn-danger" onClick={() => handleLogout(navigate)}>Logout</button>
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="col-12 col-md-9 col-lg-10 p-4">
                        {error && <p className="text-danger">{error}</p>}

                        {/* Render the correct component based on activeSection state */}
                        {activeSection === "users" && (
                            <UsersSection users={users} setUsers={setUsers} fetchLogs={fetchLogs} setLogs={setLogs} setError={setError} setLoading={setLoading} handleRemoveUser={handleRemoveUser} handleResetUserLogs={handleResetUserLogs} />
                        )}
                        {activeSection === "login" && (
                            <LoginLogsSection displayedLogs={displayedLogs} filter={filter} setFilter={setFilter} handleApprove={handleApprove} setLogs={setLogs} />
                        )}
                        {activeSection === "manage" && (
                            <ManageContentSection
                                contents={contents}
                                setContents={setContents}
                                contentError={contentError}
                                filterType={filterType}
                                setFilterType={setFilterType}
                                editingId={editingId}
                                setEditingId={setEditingId}
                                editForm={editForm}
                                setEditForm={setEditForm}
                                handleEditClick={handleEditClick}
                                handleEditChange={handleEditChange}
                                handleUpdateContent={handleUpdateContent}
                                handleDeleteContent={handleDeleteContent}
                                setContentError={setContentError}
                            />
                        )}
                        {activeSection === "add" && (
                            <AddContentSection
                                contentType={contentType}
                                setContentType={setContentType}
                                title={title}
                                setTitle={setTitle}
                                text={text}
                                setText={setText}
                                file={file}
                                setFile={setFile}
                                audioFile={audioFile}
                                setAudioFile={setAudioFile}
                                handleAddContent={handleAddContent}
                                setContents={setContents}
                                setContentError={setContentError}
                            />
                        )}
                    </main>
                </div>
            </div>
        </Layout>
    );
}

export default AdminDashboard;