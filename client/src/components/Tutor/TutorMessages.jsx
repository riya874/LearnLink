import { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { useSelector } from "react-redux";
import client from "../../lib/axios";
import { selectUser } from "../../redux/features/auth/authSlice";

const TutorMessages = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const user = useSelector(selectUser);
    const token = localStorage.getItem("authToken");
    const tutorId = localStorage.getItem("tutorId");

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await client.get(`/session/tutor/${tutorId}`); // Fetch tutor's sessions
                setChats(response.data.sessions);
                console.log(response.data.sessions)
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

        if (user) fetchChats();
    }, [user]);

    const fetchMessages = async (sessionId) => {
        try {
            const response = await client.get(`/messages/session/${sessionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async () => {
        if (message.trim() !== "" && selectedChat) {
            try {
                await client.post("/messages/send", {
                    receiverId: selectedChat.parentDetails.user._id, // Parent is the receiver
                    sessionId: selectedChat._id,
                    message,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setMessages((prevMessages) => [...prevMessages, { senderId: { _id: user._id }, message }]);
                setMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/3 bg-gray-100 p-4 border-r">
                <h2 className="text-xl font-semibold mb-4">Messages</h2>
                <div>
                    {chats.map((chat) => (
                        <div
                            key={chat._id}
                            className={`p-3 flex items-center gap-3 cursor-pointer ${selectedChat?._id === chat._id ? "bg-gray-300" : "hover:bg-gray-200"
                                }`}
                            onClick={() => {
                                setSelectedChat(chat);
                                fetchMessages(chat._id);
                            }}
                        >
                            <img src={chat.parentDetails.user.profilePhoto || ""} className="w-10 h-10 rounded-3xl" />
                            <span className="text-lg font-medium">{chat.parentDetails.user.username}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="w-2/3 flex flex-col">
                {selectedChat ? (
                    <>
                        <div className="p-4 bg-blue-500 text-white text-lg font-semibold flex items-center gap-3">
                            <img src={selectedChat.parentDetails.user.profilePhoto} className="w-10 h-10 rounded-3xl" /> {selectedChat.parentDetails.user.username}
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            {messages.map((msg, index) => {
                                const isSentByUser = msg.senderId._id === user._id; // Check correct sender
                                return (
                                    <div
                                        key={index}
                                        className={`mb-2 ${isSentByUser ? "text-right" : "text-left"}`}
                                    >
                                        <span
                                            className={`p-2 rounded-lg inline-block ${isSentByUser ? "bg-blue-500 text-white" : "bg-gray-300"
                                                }`}
                                        >
                                            {msg.message}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-4 border-t flex items-center">
                            <input
                                type="text"
                                className="flex-1 p-2 border rounded-lg"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button
                                className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
                                onClick={sendMessage}
                            >
                                <FiSend size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorMessages;
