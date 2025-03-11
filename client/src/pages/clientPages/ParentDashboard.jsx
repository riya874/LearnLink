import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaUser, FaSearch, FaCalendarAlt, FaEnvelopeOpenText, FaCommentDots, FaBars, FaSignOutAlt } from "react-icons/fa";
import Profile from "../../components/Parent/Profile";
import SearchTutors from "../../components/Parent/SearchTutors";
import MyBookings from "../../components/Parent/MyBookings";
import Messages from "../../components/Parent/Messages";
import Feedback from "../../components/Parent/Feedback";
import { selectUser, logout } from "../../redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ParentDashboard = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const menuItems = [
        { key: "profile", label: "Profile", icon: <FaUser /> },
        { key: "searchTutors", label: "Search Tutors", icon: <FaSearch /> },
        { key: "myBookings", label: "My Bookings", icon: <FaCalendarAlt /> },
        { key: "messages", label: "Messages", icon: <FaEnvelopeOpenText /> },
        { key: "feedback", label: "Feedback", icon: <FaCommentDots /> },
    ];

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className={`bg-gray-100 border-r w-64 p-4 space-y-4 transition-all ${isSidebarOpen ? "block" : "hidden"} md:block`}>
                <h2 className="text-2xl font-semibold text-center">Parent Dashboard</h2>
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            className={`flex items-center space-x-2 p-2 rounded w-full transition ${activeTab === item.key ? "bg-blue-600 text-white" : "hover:bg-blue-100"
                                }`}
                        >
                            {item.icon} <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 p-2 rounded w-full transition bg-red-600 text-white mt-6 hover:bg-red-700"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Toggle Button for Mobile View */}
                <button className="md:hidden p-2 bg-gray-200 rounded-full" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FaBars size={24} />
                </button>

                {/* Dynamic Content Based on Active Tab */}
                <div className="mt-4">
                    {activeTab === "profile" && <Profile />}
                    {activeTab === "searchTutors" && <SearchTutors />}
                    {activeTab === "myBookings" && <MyBookings />}
                    {activeTab === "messages" && <Messages />}
                    {activeTab === "feedback" && <Feedback />}
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
