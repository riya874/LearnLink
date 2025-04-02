import React, { useEffect, useState } from "react";
import { FaStar, FaUser, FaEnvelope } from "react-icons/fa";
import client from "../../lib/axios"; // Assuming client is set up for API requests
import toast from "react-hot-toast"; // For toast notifications

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        // Fetch all feedbacks on component mount
        const fetchFeedbacks = async () => {
            try {
                const response = await client.get("/feedback/all"); // Assuming the route is set up
                console.log(response.data)
                setFeedbacks(response.data); // Set feedbacks data
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
                toast.error("Failed to fetch feedbacks.");
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold mb-6">Feedback Management</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedbacks.length > 0 ? (
                        feedbacks.map((feedback) => (
                            <div
                                key={feedback._id}
                                className="bg-white shadow-lg rounded-lg overflow-hidden"
                            >
                                <div className="flex items-center p-4 border-b">
                                    {/* User's profile photo and username */}
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        {feedback.parentId.userId.profilePhoto ? (
                                            <img
                                                src={feedback.parentId.userId.profilePhoto}
                                                alt="User Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="w-full h-full text-gray-500" />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-semibold text-lg">{feedback.parentId.userId.username}</p>
                                        <p className="text-sm text-gray-500">
                                            <FaEnvelope className="inline-block mr-1" />
                                            {feedback.parentId.userId.email}
                                        </p>
                                    </div>
                                </div>
                                {/* Feedback details */}
                                <div className="p-4">
                                    <div className="flex items-center mb-3">
                                        {/* Rating */}
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, index) => (
                                                <FaStar
                                                    key={index}
                                                    className={`text-lg ${feedback.rating > index ? "text-yellow-500" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-500">{feedback.rating} / 5</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{feedback.feedback}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-lg text-gray-500 col-span-full">
                            No feedback available.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackManagement;
