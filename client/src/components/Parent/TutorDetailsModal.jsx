import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBook, FaStar, FaLanguage, FaMapPin, FaMapMarkedAlt, FaTimes } from 'react-icons/fa';
import client from "../../lib/axios"; // Assuming client is set up to handle API requests
import { selectParentInfo } from '../../redux/features/parent/parentSlice';
import toast from "react-hot-toast"
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/auth/authSlice';
const StarRating = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0); // For hover effect
    const starRef = useRef(null);

    // Function to handle mouse enter and drag events to update hoverRating
    const handleMouseEnter = (index) => {
        setHoverRating(index + 1);
    };

    const handleMouseLeave = () => {
        setHoverRating(0); // Reset hover when mouse leaves
    };

    const handleClick = (index) => {
        setRating(index + 1); // Set the rating based on the clicked star
    };

    const handleDrag = (e) => {
        const { top, height } = starRef.current.getBoundingClientRect();
        const mousePosition = e.clientY - top; // Get mouse position relative to the stars container
        const newRating = Math.max(0, Math.min(Math.floor((mousePosition / height) * 5), 5)); // Calculate the rating based on drag position
        setHoverRating(newRating); // Update hover rating during dragging
    };

    return (
        <div
            ref={starRef}
            className="flex items-center cursor-pointer"
            onMouseMove={handleDrag} // Allows dragging to fill stars
            onMouseLeave={handleMouseLeave}
        >
            {[...Array(5)].map((_, index) => (
                <FaStar
                    key={index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onClick={() => handleClick(index)}
                    className={`text-xl transition-all duration-200 ${hoverRating > index || rating > index ? 'text-yellow-500' : 'text-gray-400'}`}
                />
            ))}
        </div>
    );
};

const TutorDetailsModal = ({ tutor, closeModal }) => {
    const user = useSelector(selectUser);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(1); // The rating state
    const [comment, setComment] = useState("");
    const [ParentInfo, setParentInfo] = useState();
    // Fetch reviews when the modal opens
    useEffect(() => {
        if (tutor) {
            fetchReviews(tutor._id);
        }
    }, [tutor]);
    useEffect(() => {
        client.get(`/parent/${user._id}`)
            .then(response => {
                setParentInfo(response.data.parent); // Store original parent info
            })
            .catch(error => console.error("Error fetching parent details:", error));
    }, [user]);

    const fetchReviews = async (tutorId) => {
        try {
            const response = await client.get(`/review/${tutorId}`);
            setReviews(response.data.reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
    
        // Check if parent has already reviewed this tutor
        const existingReview = reviews.find((review) => review.parentId?._id === ParentInfo._id);
        if (existingReview) {
            toast.error("You have already reviewed this tutor!");
            return;
        }
    
        const newReview = {
            rating,
            comment,
            parentId: ParentInfo._id,
            tutorId: tutor._id,
        };
    
        try {
            await client.post("/review/tutor/", newReview);
            toast.success("Thanks for submitting your review!!");
            fetchReviews(tutor._id); // Fetch updated reviews
            setComment("");
            setRating(1);
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit review. Try again later!");
        }
    };
    

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
            <div className="bg-white p-6 rounded-lg w-full max-w-3xl relative max-h-screen overflow-y-auto">
                <button onClick={closeModal} className="absolute top-2 right-2 text-xl text-gray-500">
                    <FaTimes />
                </button>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center bg-gray-200 overflow-hidden">
                        {tutor.userId?.profilePhoto ? (
                            <img src={tutor.userId?.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <FaUser className="text-gray-500 text-6xl" />
                        )}
                    </div>
                    <div className="text-left w-full">
                        <h2 className="flex items-center gap-2 font-semibold">{tutor.userId?.username || 'Unknown'}</h2>
                        <div className="border-t pt-6">
                            <p className="flex items-center gap-2"><FaEnvelope /> {tutor.userId?.email || "N/A"}</p>
                            <p className="flex items-center gap-2"><FaPhone /> {tutor.userId?.phone || "N/A"}</p>
                            <p className="flex items-center gap-2"><FaMapPin /> {tutor.userId?.address || "N/A"}</p>
                        </div>
                        <div className="mt-6 border-t pt-6">
                            <h3 className="text-xl font-semibold mb-4">Additional Info</h3>
                            <p className="flex items-center gap-2"><FaGraduationCap /> Qualifications: {tutor.qualifications || "N/A"}</p>
                            <p className="flex items-center gap-2"><FaBook /> Subjects: {tutor.subjects?.join(", ") || "N/A"}</p>
                            <p className="flex items-center gap-2"><FaBook /> Grades: {tutor.grades?.join(", ") || "N/A"}</p>
                            <p className="flex items-center gap-2"><FaLanguage /> Languages: {tutor.languages?.join(", ") || "N/A"}</p>
                            <p className="flex items-center gap-2"><FaStar /> Experience: {tutor.experience || "N/A"} years</p>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review._id} className="border-b py-4 flex items-start gap-4">
                                {/* Parent Profile Photo and Username */}
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    {review.parentId?.userId?.profilePhoto ? (
                                        <img
                                            src={review.parentId.userId.profilePhoto}
                                            alt="Parent Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUser className="text-gray-500 text-3xl" />
                                    )}
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-semibold">{review.parentId?.userId?.username || 'Unknown Parent'}</h4>
                                        <div className="flex items-center gap-1">
                                            {/* Display rating */}
                                            {[...Array(5)].map((_, index) => (
                                                <FaStar
                                                    key={index}
                                                    className={`text-xl ${review.rating > index ? 'text-yellow-500' : 'text-gray-300'}`}
                                                />
                                            ))}
                                            <span className="ml-2">{review.rating} / 5</span>
                                        </div>
                                    </div>
                                    <p className="text-sm mt-2">{review.comment}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>

                {/* Add Review Form */}
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Add a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                        <div className="flex items-center gap-2">
                            {/* Implementing the new star rating component */}
                            <StarRating rating={rating} setRating={setRating} />
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review..."
                            rows="4"
                            className="border p-2 mt-2 w-full rounded"
                        />
                        <button
                            type="submit"
                            className="mt-4 bg-blue-500 text-white py-2 px-6 rounded"
                        >
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TutorDetailsModal;
