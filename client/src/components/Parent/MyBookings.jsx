import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/auth/authSlice";

const MyBookings = () => {
    const [sessions, setSessions] = useState([]);
    const [parentInfo, setParentInfo] = useState(null);
    const user = useSelector(selectUser);
    console.log("User",user._id)

    useEffect(() => {
        if (user?._id) {
            client.get(`/parent/${user._id}`)
                .then(response => {
                    setParentInfo(response.data.parent);
                })
                .catch(error => console.error("Error fetching parent details:", error));
        }
    }, [user?._id]);  // Fetch parent info when user ID is available

    useEffect(() => {
        if (parentInfo?._id) {
            fetchSessions(parentInfo._id);
        }
    }, [parentInfo?._id]);  // Fetch sessions only after parentInfo._id is set

    const fetchSessions = async (parentId) => {
        try {
            const res = await client.get(`/session/parent/${parentId}`);
            setSessions(res.data.sessions || []);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
            {sessions.length === 0 ? (
                <p>No bookings yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sessions.map((session) => (
                        <div key={session._id} className="border p-4 rounded-lg shadow-lg bg-white">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={session.tutorId?.userId?.profilePhoto || "/default-avatar.png"}
                                    alt={session.tutorId?.userId?.username}
                                    className="w-16 h-16 rounded-full"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{session.tutorId?.userId?.username}</h3>
                                    <p className="text-sm text-gray-500">{session.subject}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {session.time}</p>
                                <p><strong>Status:</strong> {session.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
