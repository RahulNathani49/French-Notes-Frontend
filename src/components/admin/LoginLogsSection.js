import React, { useState } from "react";
import { handleApprove } from "../../utils/adminHandlers";

const LoginLogsSection = ({ displayedLogs, filter, setFilter, setLogs }) => {
    // Add state to hold the value of the search input field
    const [searchText, setSearchText] = useState("");

    // Filter the displayedLogs based on the search input
    const filteredLogs = displayedLogs.filter(log => {
        const searchLower = searchText.toLowerCase();
        // Check if the search text is included in any of the relevant fields
        return (
            (log.userId?.username || log.username).toLowerCase().includes(searchLower) ||
            (log.userId?.email || "N/A").toLowerCase().includes(searchLower) ||
            log.deviceId.toLowerCase().includes(searchLower) ||
            log.deviceInfo.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="py-5">
            <h3 className="mb-3">Login Requests</h3>
            {/* Filter buttons */}
            <div className="mb-3 d-flex flex-wrap gap-2">
                {["all", "pending", "approved", "denied"].map(f => (
                    <button key={f} className={`btn ${filter === f ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* New search input for filtering */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by username, email, or device info..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-light">
                    <tr>
                        <th>Student Username</th>
                        <th>Email</th>
                        <th>Device ID</th>
                        <th>Device Info</th>
                        <th>Status</th>
                        <th>Requested At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Render the filtered logs */}
                    {filteredLogs.length ? filteredLogs.map(log => (
                        <tr key={log._id}>
                            <td>{log.userId?.username || log.username}</td>
                            <td>{log.userId?.email || "N/A"}</td>
                            <td>{log.deviceId}</td>
                            <td>{log.deviceInfo}</td>
                            <td>{log.status}</td>
                            <td>{new Date(log.createdAt).toLocaleString()}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-success btn-sm" onClick={() => handleApprove(log._id, "approved", setLogs)} disabled={log.status === "approved"}>Approve</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleApprove(log._id, "denied", setLogs)} disabled={log.status === "denied"}>Deny</button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="7" className="text-center">No requests found</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LoginLogsSection;