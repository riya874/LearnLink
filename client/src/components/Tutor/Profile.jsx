import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login } from "../../redux/features/auth/authSlice";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaLanguage, FaBook, FaStar, FaEdit, FaSave, FaTimes, FaMapPin, FaFileUpload, FaCamera, FaMapMarkedAlt } from "react-icons/fa";
import client from "../../lib/axios";
import { toast } from "react-hot-toast"
import { profile, selectSubject, selectTutorInfo } from "../../redux/features/tutor/tutorSlice";

const Profile = () => {
    const user = useSelector(selectUser);
    const tutor = useSelector(selectTutorInfo);
    const dispatch = useDispatch();

    // State for profile updates
    const [isEditing, setIsEditing] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("authToken");
    const [updatedData, setUpdatedData] = useState({
        phone: user?.phone || "",
        address: user?.address || "",
        pincode: user?.pincode || "",
    });

    // Additional Tutor Info
    const [isEditingTutor, setIsEditingTutor] = useState(false);
    const [tutorInfo, setTutorInfo] = useState({
        qualifications: tutor?.qualifications || "",
        subjects: tutor?.subjects || [],
        grades: tutor?.grades || [],
        experience: tutor?.experience || 0,
        languages: tutor?.languages || [],
        gender: tutor?.gender || "",
        teachingMethodology: tutor?.teachingMethodology || "",
        certifications: tutor?.certifications || "",
    });

    useEffect(() => {
        if (user?.role === "tutor") {
            client.get(`/tutor/${user._id}`)
                .then(response => setTutorInfo(response.data.tutor))
                .catch(error => console.error("Error fetching tutor details:", error));
        }
    }, [user]);
    localStorage.setItem("tutorId", tutorInfo._id)
    const handleChange = (e) => {
        setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
    };

    const handleTutorChange = (e) => {
        setTutorInfo({ ...tutorInfo, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "your_cloudinary_preset");
            try {
                const res = await client.post("https://api.cloudinary.com/v1_1/your_cloud_name/upload", formData);
                setTutorInfo({ ...tutorInfo, certifications: res.data.secure_url });
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };
    const handleProfileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "tutor_upload"); // Use your Cloudinary upload preset

            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/dd5fonyup/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json(); // Convert response to JSON

                if (!data.secure_url) throw new Error("Upload failed");

                setProfilePhoto(data.secure_url);

                // Save the profile photo URL in the backend
                const updateResponse = await client.put(
                    "/auth/update",
                    { profilePhoto: data.secure_url }, // Data payload (body)
                    { headers: { Authorization: `Bearer ${token}` } } // Config (headers)
                );

                // Update Redux state
                dispatch(login({ ...user, profilePhoto: data.secure_url }));

            } catch (error) {
                console.error("Error uploading profile photo:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await client.put("/auth/update", updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(login(response.data.user));
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error("Error updating profile:", error);
        }
    };

    const handleTutorUpdate = async () => {
        try {
            const response = await client.post("/tutor/profile", tutorInfo, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTutorInfo(response.data);
            dispatch(profile(response.data.tutor));
            toast.success("Profile updated successfully!");
            setIsEditingTutor(false);
        } catch (error) {
            toast.error("Error updating tutor info:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Welcome {user?.username}!!</h2>

            {/* Profile Section */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center bg-gray-200 overflow-hidden">
                    {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <FaUser className="text-gray-500 text-6xl" />
                    )}

                    {/* Upload Button */}
                    <label className="absolute bottom-2 right-2 bg-gray-800 text-white p-1 rounded-full cursor-pointer">
                        <FaCamera />
                        <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
                    </label>
                </div>

                <div className="text-left w-full">
                    {isEditing ? (
                        <div>
                            <label>Phone</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaPhone />
                                <input type="text" name="phone" value={updatedData.phone} onChange={handleChange} className="w-full" />
                            </div>
                            <label>Address</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaMapMarkedAlt />
                                <input type="text" name="address" value={updatedData.address} onChange={handleChange} className="w-full" />
                            </div>
                            <label>Pincode</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaMapPin />
                                <input type="text" name="pincode" value={updatedData.pincode} onChange={handleChange} className="w-full" />
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleUpdate} className="bg-green-500 text-white p-2 rounded flex items-center gap-2">
                                    <FaSave /> Save
                                </button>
                                <button onClick={() => setIsEditing(false)} className="bg-red-500 text-white p-2 rounded flex items-center gap-2">
                                    <FaTimes /> Cancel
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div>
                            {/* <p className="text-lg font-semibold flex items-center gap-2"><FaUser /> {user?.username}</p> */}
                            <p className="text-gray-600 flex items-center gap-2"><FaEnvelope /> {user?.email}</p>
                            <p className="text-gray-600 flex items-center gap-2"><FaPhone /> {updatedData.phone || "Not provided"}</p>
                            <p className="text-gray-600 flex items-center gap-2"><FaMapMarkerAlt /> {updatedData.address || "Not provided"}</p>
                            <p className="text-gray-600 flex items-center gap-2"><FaMapPin /> {updatedData.pincode || "Not provided"}</p>
                            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white p-2 rounded flex items-center gap-2">
                                <FaEdit /> Edit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Additional Tutor Info */}
            {user?.role === "tutor" && (
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Additional Info</h3>
                    {isEditingTutor ? (
                        <div>
                            <label>Qualifications</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaGraduationCap />
                                <input type="text" name="qualifications" value={tutorInfo.qualifications} onChange={handleTutorChange} className="border p-1 w-full mb-2" />
                            </div>

                            <label>Subjects</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaBook />
                                <input type="text" name="subjects" value={tutorInfo.subjects} onChange={handleTutorChange} className="border p-1 w-full mb-2" />
                            </div>

                            <label>Grades</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaBook />
                                <input type="text" name="grades" value={tutorInfo.grades} onChange={handleTutorChange} className="border p-1 w-full mb-2" />
                            </div>

                            <label>Experience</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaStar />
                                <input type="number" name="experience" value={tutorInfo.experience} onChange={handleTutorChange} className="border p-1 w-full mb-2" />
                            </div>

                            <label>Languages</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaLanguage />
                                <input type="text" name="languages" value={tutorInfo.languages} onChange={handleTutorChange} className="border p-1 w-full mb-2" />
                            </div>

                            <label>Gender</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaUser />
                                <input type="text" name="gender" value={tutorInfo.gender} onChange={handleTutorChange} className="border p-1 w-full mb-2" />
                            </div>

                            <label>Teaching Methodology</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaBook />
                                <input type="text" name="teachingMethodology" value={tutorInfo.teachingMethodology} onChange={handleTutorChange} className="border p-1 w-full mb-2" />
                            </div>

                            <label>Certifications</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaGraduationCap />
                                <input type="file" onChange={handleFileUpload} className="border p-1 w-full mb-2" />
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={handleTutorUpdate} className="bg-green-500 text-white p-2 rounded flex items-center gap-2">
                                    <FaSave /> Save
                                </button>
                                <button onClick={() => setIsEditingTutor(false)} className="bg-red-500 text-white p-2 rounded flex items-center gap-2 ml-2">
                                    <FaTimes /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="flex items-center gap-2"><FaGraduationCap /> Qualifications: {tutorInfo.qualifications}</p>
                            <p className="flex items-center gap-2"><FaBook /> Subjects: {tutorInfo.subjects?.join(", ") || "N/A"}</p>
                            <p className="flex items-center gap-2"><FaBook /> Grades: {tutorInfo.grades?.join(", ") || "N/A"}</p>
                            <p className="flex items-center gap-2"><FaLanguage /> Languages: {tutorInfo.languages?.join(", ") || "N/A"}</p>
                            <p className="flex items-center gap-2"><FaStar /> Experience: {tutorInfo.experience} years</p>
                            <p className="flex items-center gap-2"><FaUser /> Gender: {tutorInfo.gender}</p>
                            <p className="flex items-center gap-2"><FaBook /> Teaching Methodology: {tutorInfo.teachingMethodology}</p>
                            <p className="flex items-center gap-2"><FaStar /> Rating: {tutorInfo.rating}/5</p>
                            <button onClick={() => setIsEditingTutor(true)} className="bg-blue-500 text-white p-2 rounded flex items-center gap-2 mb-4">
                                <FaEdit /> Edit Additional Info
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
