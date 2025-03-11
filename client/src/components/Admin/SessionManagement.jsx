import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await client.get("/admin/sessions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSessions(response.data);

        } catch (error) {
            console.error("Error fetching sessions", error);
        }
    };

    const updateSessionStatus = async (id, status) => {
        try {
            const response = await client.put(`/admin/sessions/${id}/status`,
                { status },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSessions(sessions.map((session) =>
                session._id === id ? { ...session, status: response.data.status } : session
            ));
            toast.success(`Session status updated to ${status}`);
        } catch (error) {
            console.error("Error updating session status", error);
            toast.error("Error updating session!");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">Session Management</h2>

            {/* Session List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Session List</h3>
                {sessions.length > 0 ? (
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session._id} className="p-4 border rounded-lg bg-white shadow-md flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold">Tutor: {session.tutorId?.userId || "N/A"}</p>
                                    <p className="text-sm text-gray-600">Parent: {session.parentId?.userId || "N/A"}</p>
                                    <p className="text-sm text-gray-600">Subject: {session.subject || "N/A"}</p>
                                    <p className="text-sm text-gray-600">Date: {session.date ? new Date(session.date).toLocaleDateString() : "N/A"}</p>
                                    <p className={`text-sm font-semibold ${session.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                                        Status: {session.status || "Pending"}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => updateSessionStatus(session._id, "completed")}
                                        className="text-green-500 hover:text-green-600 transition"
                                    >
                                        <FaCheckCircle />
                                    </button>
                                    <button
                                        onClick={() => updateSessionStatus(session._id, "canceled")}
                                        className="text-red-500 hover:text-red-600 transition"
                                    >
                                        <FaTimesCircle />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No sessions found.</p>
                )}
            </div>
        </div>
    );
};

export default SessionManagement;
