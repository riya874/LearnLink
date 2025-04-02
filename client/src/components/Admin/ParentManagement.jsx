import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const ParentManagement = () => {
    const [parents, setParents] = useState([]);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchParents();
    }, []);

    const fetchParents = async () => {
        try {
            const response = await client.get("/admin/parents", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setParents(response.data);
        } catch (error) {
            console.error("Error fetching parents", error);
        }
    };

    const deleteParent = async (id) => {
        try {
            await client.delete(`/admin/parents/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setParents(parents.filter((parent) => parent._id !== id));
            toast.success("Parent deleted successfully!");
        } catch (error) {
            console.error("Error deleting parent", error);
            toast.error("Error deleting parent!");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">Parent Management</h2>

            {/* Parent List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Parent List</h3>
                {parents.length > 0 ? (
                    <div className="space-y-4">
                        {parents.map((parent) => (
                            <div
                                key={parent._id}
                                className="p-4 border rounded-lg bg-white shadow-md flex justify-between items-center"
                            >
                                <div className="flex items-center">
                                    {/* Check if userId and profilePhoto are available */}
                                    <img
                                        src={parent.userId?.profilePhoto || "https://via.placeholder.com/150"} // Fallback image if profilePhoto is not available
                                        alt={`${parent.userId?.username || "Unknown"}'s profile`}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        {/* Check if username is available */}
                                        <span className="text-lg font-semibold">
                                            {parent.userId?.username || "Unknown User"}
                                        </span>
                                        {/* Check if email is available */}
                                        <p className="text-sm text-gray-600">
                                            {parent.userId?.email || "Email not available"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => deleteParent(parent._id)}
                                        className="text-red-500 hover:text-red-600 transition"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No parents found.</p>
                )}
            </div>
        </div>
    );
};

export default ParentManagement;
