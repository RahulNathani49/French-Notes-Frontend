import React from "react";
import { handleAddContent } from "../../utils/adminHandlers";

const AddContentSection = ({ contentType, setContentType, title, setTitle, text, setText, file, setFile, audioFile, setAudioFile, setContents, setContentError }) => {
    return (
        <div className="py-5">
            <h3 className="mb-3">Add Content</h3>
            <form onSubmit={(e) => handleAddContent(e, { title, contentType, text, file, audioFile }, setContents, setTitle, setText, setFile, setAudioFile, setContentError)} className="card p-3 my-5 w-100">
                <div className="mb-3">
                    <label className="form-label">Type:</label>
                    <select className="form-select" value={contentType} onChange={(e) => setContentType(e.target.value)}>
                        <option value="reading">Reading</option>
                        <option value="writing">Writing</option>
                        <option value="listening">Listening</option>
                        <option value="speaking">Speaking</option>
                    </select>
                </div>
                <input type="text" className="form-control mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea className="form-control mb-2" placeholder="Content text" value={text} onChange={(e) => setText(e.target.value)} required rows="4" />
                <label className="form-label">Upload Image:</label>
                <input type="file" accept="image/*" className="form-control mb-2" onChange={(e) => setFile(e.target.files[0])} />
                <label className="form-label">Upload Audio:</label>
                <input type="file" accept="audio/*" className="form-control mb-3" onChange={(e) => setAudioFile(e.target.files[0])} />
                <button type="submit" className="btn btn-success">Add Content</button>
            </form>
        </div>
    );
};

export default AddContentSection;