import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-hot-toast";
import client from "../../lib/axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/auth/authSlice";

const TFeedback = () => {
    const user = useSelector(selectUser);
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tutorInfo, setTutorInfo] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);
    const [charCount, setCharCount] = useState(0);
    const MAX_CHAR = 200;

    useEffect(() => {
        if (user?._id) {
            client.get(`/tutor/${user._id}`)
                .then(response => setTutorInfo(response.data.tutor))
                .catch(error => console.error("Error fetching tutor details:", error));
        }
    }, [user]);

    const handleRating = (rate) => {
        setRating(rate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!feedback.trim()) {
            toast.error("Please provide feedback.");
            return;
        }

        if (!tutorInfo?._id) {
            toast.error("Tutor information not found.");
            return;
        }

        setIsSubmitting(true);

        try {
            await client.post("/feedback/submit", {
                tutorId: tutorInfo._id,
                feedback,
                rating,
            });

            toast.success("Feedback submitted successfully!");
            setFeedback("");
            setRating(1);
            setCharCount(0);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Submit Feedback</h2>

                {/* Rating Section */}
                <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((rate) => (
                        <div className="relative group" key={rate}>
                            <FaStar
                                className={`cursor-pointer text-2xl transition-all duration-300 ${
                                    (hoverRating || rating) >= rate ? "text-yellow-500" : "text-gray-300"
                                }`}
                                onClick={() => handleRating(rate)}
                                onMouseEnter={() => setHoverRating(rate)}
                                onMouseLeave={() => setHoverRating(null)}
                            />
                            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {rate === 1 ? "Bad" : rate === 2 ? "Average" : rate === 3 ? "Good" : rate === 4 ? "Very Good" : "Excellent"}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Feedback Textarea */}
                <div className="mb-4 relative">
                    <textarea
                        value={feedback}
                        onChange={(e) => {
                            setFeedback(e.target.value);
                            setCharCount(e.target.value.length);
                        }}
                        placeholder="Write your feedback here..."
                        className="w-full p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={Math.min(6, Math.max(3, Math.ceil(feedback.length / 50)))}
                        maxLength={MAX_CHAR}
                    />
                    <span className="text-sm text-gray-500 absolute bottom-2 right-4">
                        {charCount}/{MAX_CHAR}
                    </span>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center transition-all duration-300 hover:bg-blue-700 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                    ) : (
                        "Submit Feedback"
                    )}
                </button>
            </div>
        </div>
    );
};

export default TFeedback;

