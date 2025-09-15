import api from "../api/axios";
import { toast } from "react-toastify";

// =====================
// Fetch Ideas
// =====================
export const fetchIdeas = async (setIdeas, setError, setLoading, redirectToLogin) => {
    const token = localStorage.getItem("studentToken") || localStorage.getItem("adminToken");
    if (!token) {
        redirectToLogin("Access denied. Please login.");
        return;
    }

    try {
        setLoading(true);
        const res = await api.get("/ideas", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setIdeas(res.data);
        setError("");
    } catch (err) {
        console.error("Failed to fetch ideas:", err);
        const status = err.response?.status;
        if (status === 401 || status === 403) {
            redirectToLogin("Session expired. Please login again.");
        } else {
            setError("Failed to load ideas. Please try again later.");
        }
    } finally {
        setLoading(false);
    }
};

// =====================
// Submit New Idea
// =====================
export const handleSubmitIdea = async (
    e,
    ideaForm,
    setSubmitting,
    setIdeaForm,
    fetchIdeas
) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("studentToken") || localStorage.getItem("adminToken");

    if (!token) {
        toast.error("Please log in to submit an idea.");
        setSubmitting(false);
        return;
    }

    const formData = new FormData();
    formData.append("title", ideaForm.title);
    formData.append("body", ideaForm.body);
    if (ideaForm.file) {
        formData.append("file", ideaForm.file);
    }

    try {
        await api.post("/ideas/submit", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success("Your idea has been submitted successfully!");
        setIdeaForm({ title: '', body: '', file: null });
        fetchIdeas();
    } catch (err) {
        console.error("Submit idea error:", err);
        toast.error("Failed to submit idea. Please try again.");
    } finally {
        setSubmitting(false);
    }
};

// =====================
// Delete Idea (Admin Only)
// =====================
export const handleDeleteIdea = async (id, ideas, setIdeas) => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");

    if (!token || role !== "admin") {
        toast.error("You do not have permission to delete ideas.");
        return;
    }

    try {
        await api.delete(`/ideas/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Idea deleted successfully!");
        setIdeas(ideas.filter(idea => idea._id !== id));
    } catch (err) {
        console.error("Failed to delete idea:", err);
        toast.error("Failed to delete idea.");
    }
};