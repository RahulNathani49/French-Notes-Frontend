import React, { useRef, useState } from "react";
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

    // NEW: mode toggle -> "rich" or "html"
    const [inputMode, setInputMode] = useState("rich");

    const handleDivInput = () => {
        setText(editableDivRef.current.innerHTML);
    };

    const handleHtmlTextarea = (e) => {
        setText(e.target.value);
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
                {/* TYPE SELECT */}
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
                        <option value="exam-based">Exam-Based</option>
                    </select>
                </div>

                {/* TITLE */}
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                {/* --- NEW RADIO TOGGLE --- */}
                <label className="form-label fw-bold">Input Mode:</label>
                <div className="d-flex gap-3 mb-3">
                    <label>
                        <input
                            type="radio"
                            value="rich"
                            checked={inputMode === "rich"}
                            onChange={() => setInputMode("rich")}
                        />{" "}
                        Rich Text Editor
                    </label>

                    <label>
                        <input
                            type="radio"
                            value="html"
                            checked={inputMode === "html"}
                            onChange={() => setInputMode("html")}
                        />{" "}
                        Raw HTML Code
                    </label>
                </div>

                {/* RECONDITIONALLY RENDER INPUT */}
                {inputMode === "rich" ? (
                    <div
                        ref={editableDivRef}
                        contentEditable
                        spellCheck={false}
                        autoCorrect="off"
                        className="form-control mb-3"
                        style={{
                            minHeight: "150px",
                            border: "1px solid #ced4da",
                            borderRadius: ".25rem",
                            padding: "8px",
                            overflowY: "auto",
                        }}
                        onInput={handleDivInput}
                        dangerouslySetInnerHTML={{ __html: text }}
                    ></div>
                ) : (
                    <textarea
                        className="form-control mb-3"
                        style={{ minHeight: "150px" }}
                        value={text}
                        onChange={handleHtmlTextarea}
                        placeholder="Paste or write HTML code here..."
                    ></textarea>
                )}

                {/* IMAGE UPLOAD */}
                <label className="form-label">Upload Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                {/* AUDIO UPLOAD */}
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
