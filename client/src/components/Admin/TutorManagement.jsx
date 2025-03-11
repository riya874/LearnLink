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

            {/* Add Tutor Form */}
            {/* <div className="mb-6 p-4 border rounded-lg bg-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Add New Tutor</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newTutor.name}
                        onChange={(e) => setNewTutor({ ...newTutor, name: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newTutor.email}
                        onChange={(e) => setNewTutor({ ...newTutor, email: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="Subject"
                        value={newTutor.subject}
                        onChange={(e) => setNewTutor({ ...newTutor, subject: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                    />
                    <button
                        onClick={createTutor}
                        className="w-full bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition"
                    >
                        <FaPlusCircle />
                        <span>Add Tutor</span>
                    </button>
                </div>
            </div> */}

            {/* Edit Tutor Form */}
            {/* {editingTutor && (
                <div className="mb-6 p-4 border rounded-lg bg-white shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Edit Tutor</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={editingTutor.name}
                            onChange={(e) => setEditingTutor({ ...editingTutor, name: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editingTutor.email}
                            onChange={(e) => setEditingTutor({ ...editingTutor, email: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            value={editingTutor.subject}
                            onChange={(e) => setEditingTutor({ ...editingTutor, subject: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                        />
                        <button
                            onClick={() => updateTutor(editingTutor._id, editingTutor)}
                            className="w-full bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition"
                        >
                            <FaEdit />
                            <span>Update Tutor</span>
                        </button>
                    </div>
                </div>
            )} */}

            {/* Tutor List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Tutor List</h3>
                {tutors.length > 0 ? (
                    <div className="space-y-4">
                        {tutors.map((tutor) => (
                            <div key={tutor._id} className="p-4 border rounded-lg bg-white shadow-md flex justify-between items-center">
                                <div className="flex items-center">
                                    <img
                                        src={tutor.userId.profilePhoto} // Ensure you have the profile photo URL from the backend
                                        alt={`${tutor.username}'s profile`}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <span className="text-lg font-semibold">{tutor.userId.username}</span>
                                        <p className="text-sm text-gray-600">{tutor.userId.email}</p>
                                        <p className="text-sm text-gray-600">{tutor.userId.role}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => deleteUser(tutor._id)}
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
