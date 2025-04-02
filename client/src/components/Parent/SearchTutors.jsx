import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/auth/authSlice";
import client from "../../lib/axios";
import TutorDetailsModal from "./TutorDetailsModal";
import { toast } from "react-hot-toast";

const SearchTutors = () => {
    const user = useSelector(selectUser);
    const [tutors, setTutors] = useState([]);
    const [filters, setFilters] = useState({ 
        subject: "", 
        grade: [], 
        language: "", 
        address: "" 
      });
    const [selectedTutor, setSelectedTutor] = useState(null); // State for selected tutor
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility


    const gradeOptions = [
        "1st", "2nd", "3rd", "4th", "5th",
        "6th", "7th", "8th", "9th", "10th "
    ];

    useEffect(() => {
        fetchTutors();
    }, [filters]);


    // const fetchTutors = async () => {
    //     try {
    //                 // Create a copy of filters
    //     const queryParams = {...filters};
        
    //     // Handle address filtering
    //     if (queryParams.address) {
    //         // Tell backend to search both address and pincode fields
    //         queryParams.addressSearch = queryParams.address;
    //         delete queryParams.address; // Remove the original address filter
    //     }

    //         // Remove empty fields from filters before sending
    //         const activeFilters = Object.fromEntries(
    //             Object.entries(filters).filter(([_, value]) => 
    //                 Array.isArray(value) ? value.length > 0 : value.trim() !== ""
    //             )
    //         );
    
    //         const response = await client.get("/tutor", { params: activeFilters });
    //         setTutors(response.data.tutors);
    //     } catch (error) {
    //         console.error("Error fetching tutors:", error);
    //     }
    // };
    const fetchTutors = async () => {
        try {
            // Create a clean filters object
            const queryParams = {
                subject: filters.subject.trim(),
                language: filters.language.trim(),
                //address: filters.address.trim(),
                grade: filters.grade // This is already an array
            };
            if (filters.address.trim()) {
                queryParams.address = filters.address.trim(); // Send as separate parameter
            }
    
            // Remove empty fields
            const activeFilters = Object.fromEntries(
                Object.entries(queryParams).filter(([_, value]) => 
                    Array.isArray(value) ? value.length > 0 : value !== ""
                )
            );
    
            // For debugging - log what we're sending
            console.log("Sending filters:", activeFilters);
    
            const response = await client.get("/tutor", { params: activeFilters });
            
            // For debugging - log what we received
            console.log("Received tutors:", response.data.tutors);
            
            setTutors(response.data.tutors);
        } catch (error) {
            console.error("Error fetching tutors:", error);
            // Add user feedback
            toast.error("Failed to search tutors. Please try again.");
        }
    };
    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "grade") {
            if (checked) {
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    [name]: [...prevFilters[name], value]
                }));
            } else {
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    [name]: prevFilters[name].filter((grade) => grade !== value)
                }));
            }
        } else {
            setFilters({ ...filters, [name]: value });
        }
    };

    const handleCardClick = (tutor) => {
        setSelectedTutor(tutor);
        setIsModalOpen(true); // Open the modal when a tutor card is clicked
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTutor(null);
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
                {/* <input
                    type="text"
                    name="languages"
                    placeholder="Search by language..."
                    value={filters.languages}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />  */}
                <input
  type="text"
  name="language"  // Changed from 'languages'
  placeholder="Search by language..."
  value={filters.language}
  onChange={handleChange}
  className="p-2 border rounded"
/>

                
                <input
                    type="text"
                    name="address"
                    placeholder="Search by address..."
                    value={filters.address}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
            </div>

            {/* Grade Filter (Checkboxes) */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold">Select Grades</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gradeOptions.map((grade) => (
                        <div key={grade} className="flex items-center">
                            <input
                                type="checkbox"
                                id={grade}
                                name="grade"
                                value={grade}
                                checked={filters.grade.includes(grade)}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label htmlFor={grade} className="text-sm">{grade}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tutor List */}
            <div className="space-y-4">
                {tutors.length > 0 ? (
                    tutors.map((tutor) => (
                        <div
                            key={tutor._id}
                            className="p-4 border rounded-lg bg-white shadow-md flex items-center space-x-4 cursor-pointer"
                            onClick={() => handleCardClick(tutor)} // Open modal on card click
                        >
                            <img
                                src={tutor.userId?.profilePhoto || "/default-avatar.png"}
                                alt="Tutor Profile"
                                className="w-16 h-16 rounded-full object-cover border"
                            />
                            <div>
                                <p className="text-lg font-semibold">{tutor.userId?.username}</p>
                                <p className="text-sm text-gray-600">Subjects: {tutor.subjects?.join(", ")}</p>
                                <p className="text-sm text-gray-600">Grades: {tutor.grades?.join(", ") || "N/A"}</p>
                                <p className="text-sm text-gray-600">Languages: {tutor.languages?.join(", ") || "N/A"}</p>
                                <p className="text-sm text-gray-600">
  Address: {tutor.userId?.address || "N/A"} {tutor.userId?.pincode ? `, ${tutor.userId.pincode}` : ""}
</p>
                                {/* <p className="text-sm text-gray-600">Address: {tutor.userId?.address || "N/A"}</p> */}
                            
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tutors found.</p>
                )}
            </div>

            {/* Modal for tutor details */}
            {isModalOpen && <TutorDetailsModal tutor={selectedTutor} closeModal={closeModal} />}
        </div>
    );
};

export default SearchTutors;

