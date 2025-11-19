import api from "../api/axios";
import { toast } from "react-toastify";

import { saveAs } from "file-saver";

// =====================
// Export All Data
// =====================
export const handleExportAllData = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            toast.error("You must be logged in as admin.");
            return;
        }

        // Fetch all data
        const [usersRes, contentsRes, ideasRes, logsRes] = await Promise.all([
            api.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
            api.get("/content", { headers: { Authorization: `Bearer ${token}` } }),
            api.get("/ideas", { headers: { Authorization: `Bearer ${token}` } }),
            api.get("admin/login-logs", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        // Combine all data into one JSON object
        const allData = {
            users: usersRes.data,
            contents: contentsRes.data,
            ideas: ideasRes.data,
            loginlogs: logsRes.data,
        };
// Convert to Blob and save as JSON file
        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json;charset=utf-8" });
        saveAs(blob, "admin_data_export.json");
        // Log it in console


        toast.success("All data fetched successfully");
    } catch (err) {
        console.error("Failed to fetch all data:", err);
        toast.error("❌ Failed to fetch all data");
    }
};
// =====================
// Logout handler
// =====================
export const handleLogout = (navigate) => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    navigate("/admin-login?msg=Logged out", { replace: true });
};

// =====================
// FETCH USERS
// =====================
export const fetchUsers = async (setUsers) => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await api.get("/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);

    } catch (err) {
        toast.error("❌ Failed to fetch users");
    }
};

// =====================
// Remove User
// =====================
export const handleRemoveUser = async (id, setUsers) => {
    if (!window.confirm("Are you sure you want to remove this user permanently?")) return;
    try {
        const token = localStorage.getItem("adminToken");
        await api.delete(`/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUsers((prev) => prev.filter((u) => u._id !== id));
        toast.success("🗑️ User removed successfully");
    } catch (err) {
        toast.error("❌ Failed to remove user");
    }
};

// =====================
// Reset User Logs
// =====================
export const handleResetUserLogs = async (id, fetchLogsCallback) => {
    if (!window.confirm("Are you sure you want to reset all logs for this user?")) return;
    try {
        const token = localStorage.getItem("adminToken");
        await api.post(`/admin/users/${id}/reset-logs`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ User logs reset successfully");
        fetchLogsCallback();
    } catch (err) {
        toast.error("❌ Failed to reset logs");
    }
};

// =====================
// Fetch Login Logs
// =====================
export const fetchLogs = async (setLogs, setError, setLoading) => {
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
        toast.error("❌ Failed to fetch logs. Check backend and CORS.");
    } finally {
        setLoading(false);
    }
};

// =====================
// Approve/Deny Logs
// =====================
export const handleApprove = async (id, status, setLogs) => {
    try {
        const token = localStorage.getItem("adminToken");
        await api.post(`/admin/login-logs/${id}`, { status }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setLogs((prevLogs) => prevLogs.map((log) =>
            log._id === id ? { ...log, status } : log
        ));
        toast.success(`✅ Login ${status} successfully`);
    } catch (err) {
        toast.error("❌ Failed to update login request");
    }
};

// =====================
// Fetch Content
// =====================
export const fetchContent = async (setContents) => {
    try {
        const token = localStorage.getItem("adminToken");
        const res = await api.get("/content", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setContents(res.data);
    } catch (err) {
        toast.error("❌ Failed to fetch content.");
    }
};

// =====================
// Add Content
// =====================
export const handleAddContent = async (
    e,
    { title, contentType, text, file, audioFile },
    setContents,
    setTitle,
    setText,
    setFile,
    setAudioFile,
    setContentError
) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            toast.error("You must be logged in as admin.");
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
        setAudioFile(null);
        setContentError("");
        toast.success("✅ Content added successfully");
    } catch (err) {
        console.error("❌ Add content error:", err);
        toast.error(err.response?.data?.error || "❌ Failed to add content");
    }
};

// =====================
// Edit Content
// =====================
export const handleEditClick = (c, setEditingId, setEditForm) => {
    setEditingId(c._id);
    setEditForm({
        title: c.title,
        type: c.type,
        text: c.text,
        imageUrl: c.imageUrl || "",
        imageFile: null,
        audioFile: null,
    });
};

export const handleEditChange = (e, setEditForm) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
};

// =====================
// Update Content
// =====================
export const handleUpdateContent = async (
    editingId,
    editForm,
    setContents,
    setEditingId,
    setEditForm,
    setContentError
) => {
    if (!editingId) return;

    try {
        const token = localStorage.getItem("adminToken");
        const formData = new FormData();
        formData.append("title", editForm.title);
        formData.append("type", editForm.type);
        formData.append("text", editForm.text);
        if (editForm.imageFile) formData.append("image", editForm.imageFile);
        if (editForm.audioFile) formData.append("audio", editForm.audioFile);

        const res = await api.put(`/content/${editingId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        setContents((prev) => prev.map((c) => (c._id === editingId ? res.data : c)));
        setEditingId(null);
        setEditForm({ title: "", type: "", text: "", imageUrl: "", imageFile: null, audioFile: null });
        toast.success("✅ Content updated successfully");
        setContentError("");
    } catch (err) {
        console.error("Update failed:", err);
        toast.error(err?.response?.data?.error || "❌ Failed to update content");
    }
};

// =====================
// Delete Content
// =====================
export const handleDeleteContent = async (id, setContents, contents) => {
    try {
        const token = localStorage.getItem("adminToken");
        await api.delete(`/content/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setContents(contents.filter((c) => c._id !== id));
        toast.success("🗑️ Content deleted successfully");
    } catch (err) {
        toast.error("❌ Failed to delete content");
    }
};
