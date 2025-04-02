import React, { useEffect, useState } from "react";
import client from "../../lib/axios";

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const tutorId = localStorage.getItem("tutorId"); // Retrieve logged-in tutor ID
    console.log(sessions);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await client.get(`/session/tutor/${tutorId}`);
            setSessions(res.data.sessions || []);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    // Cancel a session
    const cancelSession = async (sessionId) => {
        try {
            const res = await client.put(`/session/cancel/${sessionId}`);
            if (res.data.success) {
                // Update the session status in the local state
                setSessions((prevSessions) =>
                    prevSessions.map((session) =>
                        session._id === sessionId ? { ...session, status: "Cancelled" } : session
                    )
                );
            }
        } catch (error) {
            console.error("Error cancelling session:", error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">My Sessions</h2>
            {sessions.length === 0 ? (
                <p>No sessions yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sessions.map((session) => (
                        <div key={session._id} className="border p-4 rounded-lg shadow-lg bg-white">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={session.parentDetails?.user?.profilePhoto || "/default-avatar.png"}
                                    alt={session.parentDetails?.user?.username}
                                    className="w-16 h-16 rounded-full"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{session.parentDetails?.user?.username}</h3>
                                    <p className="text-sm text-gray-500">{session.subject}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {session.time}</p>
                                <p><strong>Status:</strong> {session.status}</p>
                            </div>

                            {/* Cancel Button */}
                            {session.status !== "Cancelled" && (
                                <button
                                    onClick={() => cancelSession(session._id)}
                                    className="mt-4 text-red-500 hover:text-red-700"
                                >
                                    Cancel Session
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Sessions;
