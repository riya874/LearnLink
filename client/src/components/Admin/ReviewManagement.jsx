import React, { useEffect, useState } from "react";
import client from "../../lib/axios";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await client.get("/admin/reviews", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews", error);
        }
    };

    const deleteReview = async (id) => {
        try {
            await client.delete(`/admin/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(reviews.filter((review) => review._id !== id));
            toast.success("Review deleted successfully");
        } catch (error) {
            console.error("Error deleting review", error);
            toast.error("Error deleting review!");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">Review Management</h2>

            {/* Review List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="p-4 border rounded-lg bg-white shadow-md flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold">Reviewer: {review.user?.name || "Unknown"}</p>
                                    <p className="text-sm text-gray-600">Tutor: {review.tutor?.name || "Unknown"}</p>
                                    <p className="text-sm text-gray-600">Rating: ⭐ {review.rating}</p>
                                    <p className="text-sm text-gray-600">Comment: {review.comment}</p>
                                    <p className="text-xs text-gray-500">
                                        {review.createdAt ? new Date(review.createdAt).toLocaleString() : "N/A"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => deleteReview(review._id)}
                                    className="text-red-500 hover:text-red-600 transition"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No reviews found.</p>
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;
