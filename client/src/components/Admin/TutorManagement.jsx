import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const TutorManagement = () => {
    const [tutors, setTutors] = useState([]);
    const [newTutor, setNewTutor] = useState({ name: "", email: "", subject: "" });
    const [editingTutor, setEditingTutor] = useState(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchTutors();
    }, []);

    const fetchTutors = async () => {
        try {
            const response = await client.get("/admin/tutors", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTutors(response.data);
        } catch (error) {
            console.error("Error fetching tutors", error);
        }
    };

    const createTutor = async () => {
        try {
            const response = await client.post("/admin/tutors", newTutor, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTutors([...tutors, response.data]);
            setNewTutor({ name: "", email: "", subject: "" });
            toast.success("Tutor added successfully!");
        } catch (error) {
            console.error("Error adding tutor", error);
            toast.error("Error adding tutor!");
        }
    };

    const updateTutor = async (id, updatedTutor) => {
        try {
            const response = await client.put(`/admin/tutors/${id}`, updatedTutor, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTutors(tutors.map((tutor) => (tutor._id === id ? response.data : tutor)));
            setEditingTutor(null);
            toast.success("Tutor updated successfully!");
        } catch (error) {
            console.error("Error updating tutor", error);
            toast.error("Error updating tutor!");
        }
    };

    const deleteTutor = async (id) => {
        try {
            await client.delete(`/admin/tutors/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTutors(tutors.filter((tutor) => tutor._id !== id));
            toast.success("Tutor deleted successfully!");
        } catch (error) {
            console.error("Error deleting tutor", error);
            toast.error("Error deleting tutor!");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">Tutor Management</h2>

        
            <div>
                <h3 className="text-xl font-semibold mb-4">Tutor List</h3>
                {tutors.length > 0 ? (
                    <div className="space-y-4">
                        {tutors.map((tutor) => (
                            <div key={tutor._id} className="p-4 border rounded-lg bg-white shadow-md flex justify-between items-center">
                                <div className="flex items-center">
                                    <img
                                        src={tutor.userId?.profilePhoto || "https://via.placeholder.com/150"} // Fallback if profile photo is missing
                                        alt={`${tutor.userId?.username || "Unknown"}'s profile`}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <span className="text-lg font-semibold">
                                            {tutor.userId?.username || "Unknown User"}
                                        </span>
                                        <p className="text-sm text-gray-600">{tutor.userId?.email || "Email not available"}</p>

                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => deleteTutor(tutor._id)}
                                        className="text-red-500 hover:text-red-600 transition"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No tutors found.</p>
                )}
            </div>
        </div>
    );
};

export default TutorManagement;
