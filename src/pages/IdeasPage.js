import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchIdeas, handleSubmitIdea, handleDeleteIdea } from "../utils/ideaHandlers";

function IdeasPage() {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ideaForm, setIdeaForm] = useState({ title: '', body: '', file: null });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const redirectToLogin = (msg = "Please login to access this page") => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentRole");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");
        navigate(`/student-login?msg=${encodeURIComponent(msg)}`, { replace: true });
    };

    const handleFormSubmit = (e) => {
        handleSubmitIdea(e, ideaForm, setSubmitting, setIdeaForm, () => fetchIdeas(setIdeas, setError, setLoading, redirectToLogin));
    };



    useEffect(() => {
        fetchIdeas(setIdeas, setError, setLoading, redirectToLogin);
    }, []);

    // The renderFile function is now corrected to not include Bootstrap card classes
    const renderFile = (filePath) => {
        if (!filePath) return null; // Return null if no file to avoid rendering anything

        const extension = filePath.split('.').pop().toLowerCase();

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
        const audioExtensions = ['mp3', 'wav', 'ogg'];
        const videoExtensions = ['mp4', 'mov', 'avi', 'webm'];

        if (imageExtensions.includes(extension)) {
            return (
                <img
                    src={filePath}
                    alt="Idea file"
                    className="img-fluid"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
            );
        } else if (audioExtensions.includes(extension)) {
            return (
                <audio controls className="w-100">
                    <source src={filePath} type={`audio/${extension}`} />
                    Your browser does not support the audio element.
                </audio>
            );
        } else if (videoExtensions.includes(extension)) {
            return (
                <video controls className="w-100" style={{ maxHeight: '200px' }}>
                    <source src={filePath} type={`video/${extension}`} />
                    Your browser does not support the video tag.
                </video>
            );
        } else {
            return (
                <a href={filePath} target="_blank" rel="noopener noreferrer">
                    Download {extension.toUpperCase()} File
                </a>
            );
        }
    };

    return (
        <Layout>
            <div className="container py-4 my-5 py-5">
                <div className="row mb-5">
                    <div className="col-12">
                        <h2 className="mb-4">Submitted Ideas</h2>
                        {loading && <div className="alert alert-info">Loading ideas...</div>}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {!loading && !error && (
                            <div className="row g-4">
                                {ideas.length > 0 ? (
                                    ideas.map(idea => (
                                        <div key={idea._id} className="col-lg-4 col-md-6 col-sm-12">
                                            <div className="card h-100 shadow-sm w-100">
                                                {/* Render the file outside of the main card-body if it's an image or video */}


                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title">{idea.title}</h5>
                                                    <p className="card-text" style={{whiteSpace: "pre-wrap"}} > {idea.body}</p>
                                                    <div className="mt-auto">
                                                       <small className="text-muted d-block">Submitted by: {idea.submittedBy?.name || "Admin"}</small>

                                                        <small className="text-muted d-block">Submitted at: {new Date(idea.createdAt).toLocaleString()}</small>
                                                    </div>
                                                    {/* Render the file inside the card-body for audio and other types */}
                                                    {(idea.filePath && !['jpg', 'jpeg', 'png', 'gif', 'svg', 'mp4', 'mov', 'avi', 'webm'].includes(idea.filePath.split('.').pop().toLowerCase())) && renderFile(idea.filePath)}
                                                    {(idea.filePath && ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(idea.filePath.split('.').pop().toLowerCase())) && renderFile(idea.filePath)}
                                                    {(idea.filePath && ['mp4', 'mov', 'avi', 'webm'].includes(idea.filePath.split('.').pop().toLowerCase())) && renderFile(idea.filePath)}
                                                </div>


                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12">
                                        <div className="alert alert-info text-center">
                                            No ideas have been submitted yet.
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="card shadow-sm p-4 w-100">
                            <h3 className="card-title mb-4">Submit a New Idea</h3>
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="ideaTitle" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ideaTitle"
                                        value={ideaForm.title}
                                        onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ideaBody" className="form-label">Main Body</label>
                                    <textarea
                                        className="form-control"
                                        id="ideaBody"
                                        rows="4"
                                        value={ideaForm.body}
                                        onChange={(e) => setIdeaForm({ ...ideaForm, body: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ideaFile" className="form-label">Attach File</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="ideaFile"
                                        onChange={(e) => setIdeaForm({ ...ideaForm, file: e.target.files[0] })}
                                    />
                                    <div className="form-text">Any file type is allowed.</div>
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        {submitting ? 'Submitting...' : 'Submit Idea'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default IdeasPage;