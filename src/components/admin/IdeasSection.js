import React, { useState, useEffect } from 'react'; // Import useEffect
import { toast } from 'react-toastify';

const IdeaEditForm = ({ idea, ideaForm, onFormChange, onFileChange, onFormSubmit, onCancel }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Idea</h2>
            <form onSubmit={onFormSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={ideaForm.title}
                        onChange={onFormChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-2">Body</label>
                    <textarea
                        id="body"
                        name="body"
                        value={ideaForm.body}
                        onChange={onFormChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="5"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">Change File
                        (optional)</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={onFileChange}
                        className="w-full text-gray-700"
                    />
                    {idea.filePath && (
                        <p className="mt-2 text-sm text-gray-500">Current File: <a href={idea.filePath} target="_blank"
                                                                                   rel="noopener noreferrer"
                                                                                   className="text-blue-600 hover:underline">View
                            File</a></p>
                    )}
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2"
                    >
                        Update Idea
                    </button>
                </div>
            </form>
        </div>
    );
};
// src/components/admin/IdeasSection.js


const IdeasSection = ({ideas, setIdeas, editingIdea, setEditingIdea, handleUpdateIdea, handleDeleteIdea}) => {
    const [ideaForm, setIdeaForm] = useState({title: "", body: "", file: null});
    // Remove the loading state and useEffect hook

    const handleEditClick = (idea) => {
        setEditingIdea(idea);
        setIdeaForm({title: idea.title, body: idea.body, file: null});
    };

    const handleFormChange = (e) => {
        const {name, value} = e.target;
        setIdeaForm(prev => ({...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setIdeaForm(prev => ({ ...prev, file: e.target.files[0] }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleUpdateIdea(editingIdea._id, ideaForm, ideas, setIdeas, setEditingIdea);
    };

    const handleCancelEdit = () => {
        setEditingIdea(null);
        setIdeaForm({ title: "", body: "", file: null });
    };

    const handleDeleteClick = (ideaId) => {
        if (window.confirm("Are you sure you want to delete this idea? This action cannot be undone.")) {
            handleDeleteIdea(ideaId, ideas, setIdeas);
        }
    };

    // Remove the if (loading) check

    return (
        <div className="container mt-4">
            <h1 className="text-2xl font-bold mb-4">Manage Ideas</h1>

            {editingIdea ? (
                <IdeaEditForm
                    idea={editingIdea}
                    ideaForm={ideaForm}
                    onFormChange={handleFormChange}
                    onFileChange={handleFileChange}
                    onFormSubmit={handleFormSubmit}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full leading-normal">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Body</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Submitted By</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">File</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ideas.length > 0 ? (
                            ideas.map((idea) => (
                                <tr key={idea._id} className="hover:bg-gray-100">
                                    <td className="p-3 border-b border-gray-200 bg-white text-sm w-1/4">
                                        <p className="text-gray-900 whitespace-no-wrap">{idea.title}</p>
                                    </td>
                                    <td className="p-3 border-b border-gray-200 bg-white text-sm w-2/5">
                                        <p className="text-gray-900" style={{whiteSpace: "pre-wrap"}}>{idea.body}</p>
                                    </td>
                                    <td className="p-3 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{idea.submittedBy.username}</p>
                                    </td>
                                    <td className="p-3border-b border-gray-200 bg-white text-sm">
                                        {idea.filePath ? (
                                            <a href={idea.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View File</a>
                                        ) : (
                                            <p className="text-gray-400">N/A</p>
                                        )}
                                    </td>
                                    <td className="p-3 border-b border-gray-200 bg-white text-sm text-center">
                                        <button
                                            onClick={() => handleEditClick(idea)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full mr-2 m-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(idea._id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full btn btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    No ideas to display.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default IdeasSection;