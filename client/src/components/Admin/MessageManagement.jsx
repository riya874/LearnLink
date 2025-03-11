import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const MessageManagement = () => {
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await client.get("/admin/messages", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const deleteMessage = async (id) => {
        try {
            await client.delete(`/admin/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(messages.filter((message) => message._id !== id));
            toast.success("Message deleted successfully");
        } catch (error) {
            console.error("Error deleting message", error);
            toast.error("Error deleting message!");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">Message Management</h2>

            {/* Message List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Messages</h3>
                {messages.length > 0 ? (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message._id} className="p-4 border rounded-lg bg-white shadow-md flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold">Sender: {message.senderId?.username || "Unknown"}</p>
                                    <p className="text-sm text-gray-600">Receiver: {message.receiverId?.username || "Unknown"}</p>
                                    <p className="text-sm text-gray-600">Message: {message.message}</p>
                                    <p className="text-xs text-gray-500">
                                        {message.timestamp ? new Date(message.timestamp).toLocaleString() : "N/A"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => deleteMessage(message._id)}
                                    className="text-red-500 hover:text-red-600 transition"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No messages found.</p>
                )}
            </div>
        </div>
    );
};

export default MessageManagement;
