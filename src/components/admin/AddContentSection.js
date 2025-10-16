import React, { useRef } from "react";
import { handleAddContent } from "../../utils/adminHandlers";

const AddContentSection = ({
                               contentType,
                               setContentType,
                               title,
                               setTitle,
                               text,
                               setText,
                               file,
                               setFile,
                               audioFile,
                               setAudioFile,
                               setContents,
                               setContentError
                           }) => {
    const editableDivRef = useRef(null);

    const handleDivInput = () => {
        setText(editableDivRef.current.innerHTML); // Save formatted HTML to state
    };

    return (
        <div className="py-5">
            <h3 className="mb-3">Add Content</h3>
            <form
                onSubmit={(e) =>
                    handleAddContent(
                        e,
                        { title, contentType, text, file, audioFile },
                        setContents,
                        setTitle,
                        setText,
                        setFile,
                        setAudioFile,
                        setContentError
                    )
                }
                className="card p-3 my-5 w-100"
            >
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

                <label className="form-label">Content Text (rich text)</label>
                <div
                    ref={editableDivRef}
                    contentEditable
                    spellCheck={false}   // <-- disables red underlines
                    autoCorrect="off"    // <-- disables auto-correct on iOS/Android
                    className="form-control mb-2"
                    style={{
                        minHeight: "150px",
                        border: "1px solid #ced4da",
                        borderRadius: ".25rem",
                        padding: "8px",
                        overflowY: "auto"
                    }}
                    onInput={handleDivInput}
                    dangerouslySetInnerHTML={{ __html: text }} // to show initial content if needed
                ></div>

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

                <button type="submit" className="btn btn-success">
                    Add Content
                </button>
            </form>
        </div>
    );
};

export default AddContentSection;
