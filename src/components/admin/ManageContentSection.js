import React, { useState } from "react";
import { handleEditClick, handleEditChange, handleUpdateContent, handleDeleteContent } from "../../utils/adminHandlers";

const ManageContentSection = ({ contents, setContents, contentError, filterType, setFilterType, editingId, setEditingId, editForm, setEditForm, setContentError }) => {
    // New state for the search filter
    const [searchTerm, setSearchTerm] = useState("");

    const filteredContents = contents.filter(c => {
        const matchesType = !filterType || c.type === filterType;
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.text.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="py-5">
            <h3 className="mb-3">Manage Content</h3>
            {contentError && <p className="text-danger">{contentError}</p>}

            <div className="mb-3 d-flex flex-column flex-md-row gap-2">
                <div className="flex-grow-1">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title or text..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <select className="form-select w-auto" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="writing">Writing</option>
                        <option value="speaking">Speaking</option>
                        <option value="listening">Listening</option>
                        <option value="reading">Reading</option>
                    </select>
                </div>
            </div>

            {/* Edit Form */}
            {editingId && (
                <div className="card p-3 mb-3">
                    <h4>Edit Content</h4>
                    <input type="text" name="title" className="form-control mb-2" value={editForm.title} onChange={(e) => handleEditChange(e, setEditForm)} placeholder="Title" />
                    <select name="type" className="form-select mb-2" value={editForm.type} onChange={(e) => handleEditChange(e, setEditForm)}>
                        <option value="reading">Reading</option>
                        <option value="writing">Writing</option>
                        <option value="listening">Listening</option>
                        <option value="speaking">Speaking</option>
                    </select>
                    <textarea name="text" className="form-control mb-2" value={editForm.text} onChange={(e) => handleEditChange(e, setEditForm)} rows="4" />
                    <label className="form-label">Upload Image</label>
                    <input type="file" accept="image/*" className="form-control mb-2" onChange={(e) => setEditForm(prev => ({ ...prev, imageFile: e.target.files[0] }))} />
                    <label className="form-label">Upload Audio</label>
                    <input type="file" accept="audio/*" className="form-control mb-3" onChange={(e) => setEditForm(prev => ({ ...prev, audioFile: e.target.files[0] }))} />
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-primary" onClick={() => handleUpdateContent(editingId, editForm, setContents, setEditingId, setEditForm, setContentError)}>Save</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
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
                    {filteredContents.length > 0 ? (
                        filteredContents.map(c => (
                            <tr key={c._id}>
                                <td>{c.type}</td>
                                <td>{c.title}</td>
                                <td>{c.imageUrl && <img src={c.imageUrl} alt={c.title} className="img-fluid rounded" style={{ maxWidth: "150px" }} />}</td>
                                <td>{c.audioUrl && <audio controls className="w-100 mt-2"><source src={c.audioUrl} type="audio/mpeg" />Your browser does not support the audio element.</audio>}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(c, setEditingId, setEditForm)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteContent(c._id, setContents, contents)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted py-4">No content found matching the filters.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageContentSection;