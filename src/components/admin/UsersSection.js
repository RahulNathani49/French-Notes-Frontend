import React, { useState } from "react";
import { handleRemoveUser, handleResetUserLogs } from "../../utils/adminHandlers";

const UsersSection = ({ users, setUsers, fetchLogs, setLogs, setError, setLoading }) => {
    // Add a state for the filter input
    const [filterText, setFilterText] = useState("");

    // Filter the users array based on the filterText
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(filterText.toLowerCase()) ||
        user.email.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="py-5">
            <h3 className="mb-3">Manage Users</h3>
            {/* Add the filter input field */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Filter by username or email..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
            />

            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="table-light">
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Render the filtered users */}
                    {filteredUsers.length ? filteredUsers.map(u => (
                        <tr key={u._id}>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-danger" onClick={() => handleRemoveUser(u._id, setUsers)}>Remove</button>
                                    <button className="btn btn-sm btn-warning" onClick={() => handleResetUserLogs(u._id, () => fetchLogs(setLogs, setError, setLoading))}>Reset Logs</button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="4" className="text-center">No users found</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersSection;