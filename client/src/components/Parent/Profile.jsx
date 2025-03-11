// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { selectUser, login } from "../../redux/features/auth/authSlice";
// import { FaUser, FaEnvelope, FaPhone, FaCamera, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaMapPin, FaChild, FaBook, FaLanguage, FaVenusMars, FaMapMarkedAlt, FaGraduationCap, FaChalkboardTeacher, FaSchool, FaBookOpen, FaChalkboard } from "react-icons/fa";
// import client from "../../lib/axios";
// import { toast } from "react-hot-toast";
// import { profile, selectChildren, selectParentInfo } from "../../redux/features/parent/parentSlice";

// const ParentProfile = () => {
//     const user = useSelector(selectUser);
//     const parent = useSelector(selectParentInfo);
//     const dispatch = useDispatch();

//     const [isEditing, setIsEditing] = useState(false);
//     const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");
//     const [loading, setLoading] = useState(false);
//     const token = localStorage.getItem("authToken");
//     const [updatedData, setUpdatedData] = useState({
//         phone: user?.phone || "",
//         address: user?.address || "",
//         pincode: user?.pincode || "",
//     });

//     // Additional Parent Info
//     const [isEditingParent, setIsEditingParent] = useState(false);
//     const [parentInfo, setParentInfo] = useState({
//         children: {
//             name: parent?.children.name || "",
//             school: parent?.children.school || "",
//             grade: parent?.children.grade || ""
//         },
//         preferences: {
//             subjects: parent?.preferences.subjects || [],
//             teachingStyle: parent?.preferences.teachingStyle || "",
//             languagePreference: parent?.preferences.languagePreference || "",
//             tutorGender: parent?.preferences.tutorGender || ""
//         }
//     });

//     useEffect(() => {
//         client.get(`/parent/${user._id}`)
//             .then(response => setParentInfo(response.data.parent))
//             .catch(error => console.error("Error fetching parent details:", error));
//     }, [user]);

//     const handleChange = (e) => {
//         setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
//     };

//     const handleParentChange = (e) => {
//         const { name, value } = e.target;

//         if (["name", "grade", "school"].includes(name)) {
//             // If the input belongs to "children"
//             setParentInfo((prev) => ({
//                 ...prev,
//                 children: {
//                     ...prev.children,
//                     [name]: value
//                 }
//             }));
//         } else {
//             // If the input belongs to "preferences"
//             setParentInfo((prev) => ({
//                 ...prev,
//                 preferences: {
//                     ...prev.preferences,
//                     [name]: value
//                 }
//             }));
//         }
//     };

//     const handleProfileUpload = async (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setLoading(true);
//             const formData = new FormData();
//             formData.append("file", file);
//             formData.append("upload_preset", "tutor_upload"); // Use your Cloudinary upload preset

//             try {
//                 const res = await fetch(`https://api.cloudinary.com/v1_1/dd5fonyup/image/upload`, {
//                     method: "POST",
//                     body: formData,
//                 });

//                 const data = await res.json(); // Convert response to JSON

//                 if (!data.secure_url) throw new Error("Upload failed");

//                 setProfilePhoto(data.secure_url);

//                 // Save the profile photo URL in the backend
//                 const updateResponse = await client.put(
//                     "/auth/update",
//                     { profilePhoto: data.secure_url }, // Data payload (body)
//                     { headers: { Authorization: `Bearer ${token}` } } // Config (headers)
//                 );

//                 // Update Redux state
//                 dispatch(login({ ...user, profilePhoto: data.secure_url }));

//             } catch (error) {
//                 console.error("Error uploading profile photo:", error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };


//     const handleUpdate = async () => {
//         try {
//             const response = await client.put("/auth/update", updatedData, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             dispatch(login(response.data.user));
//             toast.success("Profile updated successfully!");
//             setIsEditing(false);
//         } catch (error) {
//             toast.error("Error updating profile");
//         }
//     };

//     const handleParentUpdate = async () => {
//         try {
//             const response = await client.post("/parent/profile", parentInfo, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setParentInfo(response.data);
//             dispatch(profile(response.data.parent));
//             toast.success("Profile updated successfully!");
//             setIsEditingParent(false);
//         } catch (error) {
//             toast.error("Error updating parent info");
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-semibold mb-6">Welcome {user?.username}!!</h2>

//             {/* Profile Section */}
//             <div className="flex flex-col md:flex-row items-center gap-6">
//                 <div className="relative w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center bg-gray-200 overflow-hidden">
//                     {profilePhoto ? (
//                         <img src={profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
//                     ) : (
//                         <FaUser className="text-gray-500 text-6xl" />
//                     )}
//                     <label className="absolute bottom-2 right-2 bg-gray-800 text-white p-1 rounded-full cursor-pointer">
//                         <FaCamera />
//                         <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
//                     </label>
//                 </div>
//                 <div className="text-left w-full">
//                     {isEditing ? (
//                         <div>
//                             <label>Phone</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaPhone />
//                                 <input type="text" name="phone" value={updatedData.phone} onChange={handleChange} className="w-full border p-1 mb-2" />
//                             </div>
//                             <label>Address</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaMapMarkedAlt />
//                                 <input type="text" name="address" value={updatedData.address} onChange={handleChange} className="w-full border p-1 mb-2" />
//                             </div>
//                             <label>Pincode</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaMapPin />
//                                 <input type="text" name="pincode" value={updatedData.pincode} onChange={handleChange} className="w-full border p-1 mb-2" />
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <button onClick={handleUpdate} className="bg-green-500 text-white p-2 rounded flex items-center gap-2"><FaSave /> Save</button>
//                                 <button onClick={() => setIsEditing(false)} className="bg-red-500 text-white p-2 rounded flex items-center gap-2"><FaTimes /> Cancel</button>
//                             </div>
//                         </div>
//                     ) : (
//                         <div>
//                             <p className="text-gray-600 flex items-center gap-2"><FaEnvelope /> {user?.email}</p>
//                             <p className="text-gray-600 flex items-center gap-2"><FaPhone /> {updatedData.phone || "Not provided"}</p>
//                             <p className="text-gray-600 flex items-center gap-2"><FaMapMarkerAlt /> {updatedData.address || "Not provided"}</p>
//                             <p className="text-gray-600 flex items-center gap-2"><FaMapPin /> {updatedData.pincode || "Not provided"}</p>
//                             <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white p-2 rounded flex items-center gap-2"><FaEdit /> Edit</button>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Additional Parent Info */}
//             {user?.role === "parent" && (
//                 <div className="mt-6 border-t pt-6">
//                     <h3 className="text-xl font-semibold mb-4">Children & Preferences</h3>
//                     {isEditingParent ? (
//                         <div>
//                             <label>Children's Name</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaUser />
//                                 <input type="text" name="name" value={parentInfo.children?.name || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Children's Grade</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaChalkboardTeacher />
//                                 <input type="text" name="grade" value={parentInfo.children?.grade || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Children's School</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaSchool />
//                                 <input type="text" name="school" value={parentInfo.children?.school || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Subject Preferences</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaBookOpen />
//                                 <input type="text" name="subjects" value={parentInfo.preferences?.subjects || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Teaching Style</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaChalkboard />
//                                 <input type="text" name="teachingStyle" value={parentInfo.preferences?.teachingStyle || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Language Preference</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaLanguage />
//                                 <input type="text" name="languagePreference" value={parentInfo.preferences?.languagePreference || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Preferred Tutor Gender</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaVenusMars />
//                                 <input type="text" name="tutorGender" value={parentInfo.preferences?.tutorGender || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 <button onClick={handleParentUpdate} className="bg-green-500 text-white p-2 rounded flex items-center gap-2">
//                                     <FaSave /> Save
//                                 </button>
//                                 <button onClick={() => setIsEditingParent(false)} className="bg-red-500 text-white p-2 rounded flex items-center gap-2 ml-2">
//                                     <FaTimes /> Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     ) : (
//                         <div>
//                             <p className="flex items-center gap-2">
//                                 <FaUser /> Children's Name: {parentInfo.children?.name || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaChalkboardTeacher /> Children's Grade: {parentInfo.children?.grade || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaSchool /> Children's School: {parentInfo.children?.school || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaBookOpen /> Preferred Subjects: {parentInfo.preferences?.subjects || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaChalkboard /> Teaching Style: {parentInfo.preferences?.teachingStyle || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaLanguage /> Language Preferences: {parentInfo.preferences?.languagePreference || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaVenusMars /> Tutor Gender: {parentInfo.preferences?.tutorGender || "N/A"}
//                             </p>

//                             <button onClick={() => setIsEditingParent(true)} className="bg-blue-500 text-white p-2 rounded flex items-center gap-2 mb-4">
//                                 <FaEdit /> Edit Additional Info
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ParentProfile;











// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { selectUser, login } from "../../redux/features/auth/authSlice";
// import { FaUser, FaEnvelope, FaPhone, FaCamera, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaMapPin, FaChild, FaBook, FaLanguage, FaVenusMars, FaMapMarkedAlt, FaGraduationCap, FaChalkboardTeacher, FaSchool, FaBookOpen, FaChalkboard } from "react-icons/fa";
// import client from "../../lib/axios";
// import { toast } from "react-hot-toast";
// import { profile, selectChildren, selectParentInfo } from "../../redux/features/parent/parentSlice";

// const ParentProfile = () => {
//     const user = useSelector(selectUser);
//     const parent = useSelector(selectParentInfo);
//     const dispatch = useDispatch();

//     const [isEditing, setIsEditing] = useState(false);
//     const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");
//     const [loading, setLoading] = useState(false);
//     const token = localStorage.getItem("authToken");
//     const [updatedData, setUpdatedData] = useState({
//         phone: user?.phone || "",
//         address: user?.address || "",
//         pincode: user?.pincode || "",
//     });

//     // Additional Parent Info
//     const [isEditingParent, setIsEditingParent] = useState(false);
//     const [parentInfo, setParentInfo] = useState({
//         children: {
//             name: parent?.children.name || "",
//             school: parent?.children.school || "",
//             grade: parent?.children.grade || ""
//         },
//         preferences: {
//             subjects: parent?.preferences.subjects || [],
//             teachingStyle: parent?.preferences.teachingStyle || "",
//             languagePreference: parent?.preferences.languagePreference || "",
//             tutorGender: parent?.preferences.tutorGender || ""
//         }
//     });

//     useEffect(() => {
//         client.get(`/parent/${user._id}`)
//             .then(response => setParentInfo(response.data.parent))
//             .catch(error => console.error("Error fetching parent details:", error));
//     }, [user]);

//     const handleChange = (e) => {
//         setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
//     };

//     const handleParentChange = (e) => {
//         const { name, value } = e.target;

//         if (["name", "grade", "school"].includes(name)) {
//             // If the input belongs to "children"
//             setParentInfo((prev) => ({
//                 ...prev,
//                 children: {
//                     ...prev.children,
//                     [name]: value
//                 }
//             }));
//         } else {
//             // If the input belongs to "preferences"
//             setParentInfo((prev) => ({
//                 ...prev,
//                 preferences: {
//                     ...prev.preferences,
//                     [name]: value
//                 }
//             }));
//         }
//     };

//     const handleProfileUpload = async (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setLoading(true);
//             const formData = new FormData();
//             formData.append("file", file);
//             formData.append("upload_preset", "tutor_upload"); // Use your Cloudinary upload preset

//             try {
//                 const res = await fetch(`https://api.cloudinary.com/v1_1/dd5fonyup/image/upload`, {
//                     method: "POST",
//                     body: formData,
//                 });

//                 const data = await res.json(); // Convert response to JSON

//                 if (!data.secure_url) throw new Error("Upload failed");

//                 setProfilePhoto(data.secure_url);

//                 // Save the profile photo URL in the backend
//                 const updateResponse = await client.put(
//                     "/auth/update",
//                     { profilePhoto: data.secure_url }, // Data payload (body)
//                     { headers: { Authorization: `Bearer ${token}` } } // Config (headers)
//                 );

//                 // Update Redux state
//                 dispatch(login({ ...user, profilePhoto: data.secure_url }));

//             } catch (error) {
//                 console.error("Error uploading profile photo:", error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault(); // Prevent default form submission
//         try {
//             const response = await client.put("/auth/update", updatedData, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             dispatch(login(response.data.user));
//             toast.success("Profile updated successfully!");
//             setIsEditing(false);
//         } catch (error) {
//             toast.error("Error updating profile");
//         }
//     };

//     const handleParentUpdate = async (e) => {
//         e.preventDefault(); // Prevent default form submission
//         try {
//             const response = await client.post("/parent/profile", parentInfo, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setParentInfo(response.data);
//             dispatch(profile(response.data.parent));
//             toast.success("Profile updated successfully!");
//             setIsEditingParent(false);
//         } catch (error) {
//             toast.error("Error updating parent info");
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-semibold mb-6">Welcome {user?.username}!!</h2>

//             {/* Profile Section */}
//             <div className="flex flex-col md:flex-row items-center gap-6">
//                 <div className="relative w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center bg-gray-200 overflow-hidden">
//                     {profilePhoto ? (
//                         <img src={profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
//                     ) : (
//                         <FaUser className="text-gray-500 text-6xl" />
//                     )}
//                     <label className="absolute bottom-2 right-2 bg-gray-800 text-white p-1 rounded-full cursor-pointer">
//                         <FaCamera />
//                         <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
//                     </label>
//                 </div>
//                 <div className="text-left w-full">
//                     {isEditing ? (
//                         <form onSubmit={handleUpdate}>
//                             <label>Phone</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaPhone />
//                                 <input type="text" name="phone" value={updatedData.phone} onChange={handleChange} className="w-full border p-1 mb-2" />
//                             </div>
//                             <label>Address</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaMapMarkedAlt />
//                                 <input type="text" name="address" value={updatedData.address} onChange={handleChange} className="w-full border p-1 mb-2" />
//                             </div>
//                             <label>Pincode</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaMapPin />
//                                 <input type="text" name="pincode" value={updatedData.pincode} onChange={handleChange} className="w-full border p-1 mb-2" />
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <button type="submit" className="bg-green-500 text-white p-2 rounded flex items-center gap-2"><FaSave /> Save</button>
//                                 <button onClick={() => setIsEditing(false)} className="bg-red-500 text-white p-2 rounded flex items-center gap-2"><FaTimes /> Cancel</button>
//                             </div>
//                         </form>
//                     ) : (
//                         <div>
//                             <p className="text-gray-600 flex items-center gap-2"><FaEnvelope /> {user?.email}</p>
//                             <p className="text-gray-600 flex items-center gap-2"><FaPhone /> {updatedData.phone || "Not provided"}</p>
//                             <p className="text-gray-600 flex items-center gap-2"><FaMapMarkerAlt /> {updatedData.address || "Not provided"}</p>
//                             <p className="text-gray-600 flex items-center gap-2"><FaMapPin /> {updatedData.pincode || "Not provided"}</p>
//                             <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white p-2 rounded flex items-center gap-2"><FaEdit /> Edit</button>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Additional Parent Info */}
//             {user?.role === "parent" && (
//                 <div className="mt-6 border-t pt-6">
//                     <h3 className="text-xl font-semibold mb-4">Children & Preferences</h3>
//                     {isEditingParent ? (
//                         <form onSubmit={handleParentUpdate}>
//                             <label>Children's Name</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaUser />
//                                 <input type="text" name="name" value={parentInfo.children?.name || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Children's Grade</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaChalkboardTeacher />
//                                 <input type="text" name="grade" value={parentInfo.children?.grade || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Children's School</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaSchool />
//                                 <input type="text" name="school" value={parentInfo.children?.school || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Subject Preferences</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaBookOpen />
//                                 <input type="text" name="subjects" value={parentInfo.preferences?.subjects || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Teaching Style</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaChalkboard />
//                                 <input type="text" name="teachingStyle" value={parentInfo.preferences?.teachingStyle || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Language Preference</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaLanguage />
//                                 <input type="text" name="languagePreference" value={parentInfo.preferences?.languagePreference || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <label>Preferred Tutor Gender</label>
//                             <div className="flex items-center gap-2 border p-1 w-full mb-2">
//                                 <FaVenusMars />
//                                 <input type="text" name="tutorGender" value={parentInfo.preferences?.tutorGender || ""} onChange={handleParentChange} className="border p-1 w-full" />
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 <button type="submit" className="bg-green-500 text-white p-2 rounded flex items-center gap-2">
//                                     <FaSave /> Save
//                                 </button>
//                                 <button onClick={() => setIsEditingParent(false)} className="bg-red-500 text-white p-2 rounded flex items-center gap-2 ml-2">
//                                     <FaTimes /> Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     ) : (
//                         <div>
//                             <p className="flex items-center gap-2">
//                                 <FaUser /> Children's Name: {parentInfo.children?.name || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaChalkboardTeacher /> Children's Grade: {parentInfo.children?.grade || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaSchool /> Children's School: {parentInfo.children?.school || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaBookOpen /> Preferred Subjects: {parentInfo.preferences?.subjects || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaChalkboard /> Teaching Style: {parentInfo.preferences?.teachingStyle || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaLanguage /> Language Preferences: {parentInfo.preferences?.languagePreference || "N/A"}
//                             </p>
//                             <p className="flex items-center gap-2">
//                                 <FaVenusMars /> Tutor Gender: {parentInfo.preferences?.tutorGender || "N/A"}
//                             </p>

//                             <button onClick={() => setIsEditingParent(true)} className="bg-blue-500 text-white p-2 rounded flex items-center gap-2 mb-4">
//                                 <FaEdit /> Edit Additional Info
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ParentProfile;















import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login } from "../../redux/features/auth/authSlice";
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaMapPin, FaChild, FaBook, FaLanguage, FaVenusMars, FaMapMarkedAlt, FaGraduationCap, FaChalkboardTeacher, FaSchool, FaBookOpen, FaChalkboard } from "react-icons/fa";
import client from "../../lib/axios";
import { toast } from "react-hot-toast";
import { profile, selectChildren, selectParentInfo } from "../../redux/features/parent/parentSlice";
import { useNavigate } from "react-router-dom";


const ParentProfile = () => {
    const user = useSelector(selectUser);
    const parent = useSelector(selectParentInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingParent, setIsEditingParent] = useState(false); // Declare and initialize isEditingParent
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("authToken");

    // Temporary state for editing
    const [updatedData, setUpdatedData] = useState({
        phone: user?.phone || "",
        address: user?.address || "",
        pincode: user?.pincode || "",
    });

    // Temporary state for parent info editing
    const [parentInfo, setParentInfo] = useState({
        children: {
            name: parent?.children.name || "",
            school: parent?.children.school || "",
            grade: parent?.children.grade || ""
        },
        preferences: {
            subjects: parent?.preferences.subjects || [],
            teachingStyle: parent?.preferences.teachingStyle || "",
            languagePreference: parent?.preferences.languagePreference || "",
            tutorGender: parent?.preferences.tutorGender || ""
        }
    });

    // Store original data for resetting on cancel
    const [originalData, setOriginalData] = useState({ ...updatedData });
    const [originalParentInfo, setOriginalParentInfo] = useState({ ...parentInfo });

    useEffect(() => {
        client.get(`/parent/${user._id}`)
            .then(response => {
                setParentInfo(response.data.parent);
                setOriginalParentInfo(response.data.parent); // Store original parent info
            })
            .catch(error => console.error("Error fetching parent details:", error));
    }, [user]);

    const handleChange = (e) => {
        setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
    };

    const handleParentChange = (e) => {
        const { name, value } = e.target;

        if (["name", "grade", "school"].includes(name)) {
            // If the input belongs to "children"
            setParentInfo((prev) => ({
                ...prev,
                children: {
                    ...prev.children,
                    [name]: value
                }
            }));
        } else {
            // If the input belongs to "preferences"
            setParentInfo((prev) => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    [name]: value
                }
            }));
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

    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await client.put("/auth/update", updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(login(response.data.user));
            navigate("/parentdashboard")
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            setOriginalData({ ...updatedData }); // Update original data after saving
        } catch (error) {
            toast.error("Error updating profile");
        }
    };

    const handleParentUpdate = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await client.post("/parent/profile", parentInfo, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setParentInfo(response.data);
            dispatch(profile(response.data.parent));
            toast.success("Profile updated successfully!");
            setIsEditingParent(false);
            setOriginalParentInfo({ ...parentInfo }); // Update original parent info after saving
        } catch (error) {
            toast.error("Error updating parent info");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setUpdatedData({ ...originalData }); // Reset to original data
    };

    const handleParentCancel = () => {
        setIsEditingParent(false);
        setParentInfo({ ...originalParentInfo }); // Reset to original parent info
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
                    <label className="absolute bottom-2 right-2 bg-gray-800 text-white p-1 rounded-full cursor-pointer">
                        <FaCamera />
                        <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" />
                    </label>
                </div>
                <div className="text-left w-full">
                    {isEditing ? (
                        <form onSubmit={handleUpdate}>
                            <label>Phone</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaPhone />
                                <input type="text" name="phone" value={updatedData.phone} onChange={handleChange} className="w-full border p-1 mb-2" />
                            </div>
                            <label>Address</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaMapMarkedAlt />
                                <input type="text" name="address" value={updatedData.address} onChange={handleChange} className="w-full border p-1 mb-2" />
                            </div>
                            <label>Pincode</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaMapPin />
                                <input type="text" name="pincode" value={updatedData.pincode} onChange={handleChange} className="w-full border p-1 mb-2" />
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="submit" className="bg-green-500 text-white p-2 rounded flex items-center gap-2"><FaSave /> Save</button>
                                <button type="button" onClick={handleCancel} className="bg-red-500 text-white p-2 rounded flex items-center gap-2"><FaTimes /> Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <p className="text-gray-600 flex items-center gap-2"><FaEnvelope /> {user?.email}</p>
                            <p className="text-gray-600 flex items-center gap-2"><FaPhone /> {updatedData.phone || "Not provided"}</p>
                            <p className="text-gray-600 flex items-center gap-2"><FaMapMarkerAlt /> {updatedData.address || "Not provided"}</p>
                            <p className="text-gray-600 flex items-center gap-2"><FaMapPin /> {updatedData.pincode || "Not provided"}</p>
                            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white p-2 rounded flex items-center gap-2"><FaEdit /> Edit</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Additional Parent Info */}
            {user?.role === "parent" && (
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Children & Preferences</h3>
                    {isEditingParent ? (
                        <form onSubmit={handleParentUpdate}>
                            <label>Children's Name</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaUser />
                                <input type="text" name="name" value={parentInfo.children?.name || ""} onChange={handleParentChange} className="border p-1 w-full" />
                            </div>

                            <label>Children's Grade</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaChalkboardTeacher />
                                <input type="text" name="grade" value={parentInfo.children?.grade || ""} onChange={handleParentChange} className="border p-1 w-full" />
                            </div>

                            <label>Children's School</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaSchool />
                                <input type="text" name="school" value={parentInfo.children?.school || ""} onChange={handleParentChange} className="border p-1 w-full" />
                            </div>

                            <label>Subject Preferences</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaBookOpen />
                                <input type="text" name="subjects" value={parentInfo.preferences?.subjects || ""} onChange={handleParentChange} className="border p-1 w-full" />
                            </div>

                            <label>Teaching Style</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaChalkboard />
                                <input type="text" name="teachingStyle" value={parentInfo.preferences?.teachingStyle || ""} onChange={handleParentChange} className="border p-1 w-full" />
                            </div>

                            <label>Language Preference</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaLanguage />
                                <input type="text" name="languagePreference" value={parentInfo.preferences?.languagePreference || ""} onChange={handleParentChange} className="border p-1 w-full" />
                            </div>

                            <label>Preferred Tutor Gender</label>
                            <div className="flex items-center gap-2 border p-1 w-full mb-2">
                                <FaVenusMars />
                                <input type="text" name="tutorGender" value={parentInfo.preferences?.tutorGender || ""} onChange={handleParentChange} className="border p-1 w-full" />
                            </div>

                            <div className="flex items-center gap-2">
                                <button type="submit" className="bg-green-500 text-white p-2 rounded flex items-center gap-2">
                                    <FaSave /> Save
                                </button>
                                <button type="button" onClick={handleParentCancel} className="bg-red-500 text-white p-2 rounded flex items-center gap-2 ml-2">
                                    <FaTimes /> Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <p className="flex items-center gap-2">
                                <FaUser /> Children's Name: {parentInfo.children?.name || "N/A"}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaChalkboardTeacher /> Children's Grade: {parentInfo.children?.grade || "N/A"}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaSchool /> Children's School: {parentInfo.children?.school || "N/A"}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaBookOpen /> Preferred Subjects: {parentInfo.preferences?.subjects || "N/A"}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaChalkboard /> Teaching Style: {parentInfo.preferences?.teachingStyle || "N/A"}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaLanguage /> Language Preferences: {parentInfo.preferences?.languagePreference || "N/A"}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaVenusMars /> Tutor Gender: {parentInfo.preferences?.tutorGender || "N/A"}
                            </p>

                            <button onClick={() => setIsEditingParent(true)} className="bg-blue-500 text-white p-2 rounded flex items-center gap-2 mb-4">
                                <FaEdit /> Edit Additional Info
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ParentProfile;