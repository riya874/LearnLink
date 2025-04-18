import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
    const [editingUser, setEditingUser] = useState(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await client.get("/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    const createUser = async () => {
        try {
            const response = await client.post("/admin/users", newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers([...users, response.data]);
            setNewUser({ username: "", email: "", password: "" });
            toast.success("User created successfully!");
        } catch (error) {
            console.error("Error creating user", error);
            toast.error("Error creating user!");
        }
    };

    // const updateUser = async (id, updatedUser) => {
    //     try {
    //         const response = await client.put(`/admin/users/${id}`, updatedUser, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setUsers(users.map((user) => (user._id === id ? response.data : user)));
    //         setEditingUser(null);
    //         toast.success("User updated successfully!");
    //     } catch (error) {
    //         console.error("Error updating user", error);
    //         toast.error("Error updating user!");
    //     }
    // };

    const deleteUser = async (id) => {
        try {
            await client.delete(`/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter((user) => user._id !== id));
            toast.success("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user", error);
            toast.error("Error deleting user!");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">User Management</h2>

                      <div>
                <h3 className="text-xl font-semibold mb-4">User List</h3>
                {users.length > 0 ? (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div key={user._id} className="p-4 border rounded-lg bg-white shadow-md flex justify-between items-center">
                                <div className="flex items-center">
                                    <img
                                        src={user.profilePhoto} // Ensure you have the profile photo URL from the backend
                                        alt={`${user.username}'s profile`}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <span className="text-lg font-semibold">{user.username}</span>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        <p className="text-sm text-gray-600">{user.role}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className="text-red-500 hover:text-red-600 transition"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
