import React, { useEffect, useState } from "react";
import ParentBooking from "./Calendar";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/auth/authSlice";
import client from "../../lib/axios";

const SearchTutors = () => {
    const user = useSelector(selectUser);
    const [tutors, setTutors] = useState([]);
    const [filters, setFilters] = useState({ subject: "", grade: "", language: "" });

    useEffect(() => {
        fetchTutors();
    }, [filters]);

    const fetchTutors = async () => {
        try {
            const response = await client.get("/tutor", { params: filters });
            setTutors(response.data.tutors);
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching tutors:", error);
        }
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">Search Tutors</h2>

            {/* Search Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    name="subject"
                    placeholder="Search by subject..."
                    value={filters.subject}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    name="grade"
                    placeholder="Search by grade..."
                    value={filters.grade}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    name="language"
                    placeholder="Search by language..."
                    value={filters.language}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
            </div>

            {/* Tutor List */}
            <div className="space-y-4">
                {tutors.length > 0 ? (
                    tutors.map((tutor) => (
                        <div key={tutor._id} className="p-4 border rounded-lg bg-white shadow-md flex items-center space-x-4">
                            {/* Profile Picture */}
                            <img
                                src={tutor.userId?.profilePhoto || "/default-avatar.png"}
                                alt="Tutor Profile"
                                className="w-16 h-16 rounded-full object-cover border"
                            />

                            {/* Tutor Info */}
                            <div>
                                <p className="text-lg font-semibold">{tutor.userId?.username || "Unknown"}</p>
                                <p className="text-sm text-gray-600">Email: {tutor.userId?.email || "N/A"}</p>
                                <p className="text-sm text-gray-600">Subjects: {tutor.subjects?.join(", ") || "N/A"}</p>
                                <p className="text-sm text-gray-600">Grades: {tutor.grades?.join(", ") || "N/A"}</p>
                                <p className="text-sm text-gray-600">Languages: {tutor.languages?.join(", ") || "N/A"}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tutors found.</p>
                )}
            </div>


            {/* Parent Booking */}
            <ParentBooking parentId={user._id} />
        </div>
    );
};

export default SearchTutors;
