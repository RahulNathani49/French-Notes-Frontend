import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import Layout from "../components/Layout";
import UsersSection from "../components/admin/UsersSection";
import LoginLogsSection from "../components/admin/LoginLogsSection";
import ManageContentSection from "../components/admin/ManageContentSection";
import AddContentSection from "../components/admin/AddContentSection";
import IdeasSection from "../components/admin/IdeasSection";

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
    handleDeleteContent
} from "../utils/adminHandlers";
import {fetchIdeas, handleDeleteIdea,handleUpdateIdea} from "../utils/ideaHandlers";
import {FaChevronDown} from "react-icons/fa";

function AdminDashboard() {
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
    const [contentError, setContentError] = useState("");
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", type: "", text: "", imageUrl: "", imageFile: null, audioFile: null });
    const [activeSection, setActiveSection] = useState("users");
    const [ideas, setIdeas] = useState([]);
    const [editingIdea, setEditingIdea] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();

    const redirectToLogin = (msg = "Please login as admin") => {
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
        fetchIdeas(setIdeas, setError, setLoading, redirectToLogin);
    }, []);

    const displayedLogs = logs.filter((log) => {
        if (filter === "pending") return log.status === "pending";
        if (filter === "approved") return log.status === "approved";
        if (filter === "denied") return log.status === "denied";
        return true;
    });

    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (window.innerWidth < 992) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <Layout>
            <div className="container-fluid">
                {/* Mobile Menu Toggle Button */}
                <div className="d-lg-none my-3">
                    <button className="btn btn-dark" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} /> Admin Menu
                    </button>
                </div>

                <div className="row">
                    {/* Sidebar */}
                    <aside className={`col-12 col-md-3 col-lg-2 bg-light p-3 border-end admin-sidebar-drawer ${isSidebarOpen ? 'open' : ''}`}>
                        <div className="d-flex justify-content-end d-lg-none">
                            <button className="btn-close py-3" onClick={() => setIsSidebarOpen(false)}></button>
                        </div>
                        <div className="d-grid gap-2">
                            {["users", "login", "manage","ideas", "add"].map((section) => (
                                <button
                                    key={section}
                                    className={`btn ${activeSection === section ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => handleSectionChange(section)}
                                >
                                    {section === "users" ? "Manage Users" : section === "login" ? "Manage Login Requests" : section === "ideas" ? "Manage Ideas" : section === "manage" ? "Manage Content" : "Add Content"   }
                                </button>
                            ))}
                            <button className="btn btn-danger" onClick={() => handleLogout(navigate)}>Logout</button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="col-12 col-md-9 col-lg-10 p-4">
                        {error && <p className="text-danger">{error}</p>}
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
                        {activeSection === "ideas" && (
                            <IdeasSection
                                ideas={ideas}
                                setIdeas={setIdeas}
                                editingIdea={editingIdea}
                                setEditingIdea={setEditingIdea}
                                handleUpdateIdea={handleUpdateIdea}
                                handleDeleteIdea={handleDeleteIdea}
                            />
                        )}
                    </main>
                </div>
            </div>
        </Layout>
    );
}

export default AdminDashboard;