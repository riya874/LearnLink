// import React, { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { login, setLoading, setError } from "../../redux/features/auth/authSlice";
// import client from "../../lib/axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// const AuthModal = ({ isOpen, onClose, isSignup }) => {
//     const modalRef = useRef();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [role, setRole] = useState("parent");
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [email, setEmail] = useState("");
//     const loading = useSelector((state) => state.auth.loading);
//     const error = useSelector((state) => state.auth.error);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (modalRef.current && !modalRef.current.contains(event.target)) {
//                 onClose();
//             }
//         };
//         if (isOpen) {
//             document.addEventListener("mousedown", handleClickOutside);
//         }
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [isOpen, onClose]);

//     // const handleSubmit = async () => {
//     //     dispatch(setLoading(true));
//     //     dispatch(setError(null));

//     //     try {
//     //         if (!username || !password || (isSignup && !email)) {
//     //             toast.error("Please fill in all fields.");
//     //             return;
//     //         }

//     //         let response;
//     //         if (isSignup) {
//     //             response = await client.post("/auth/register", { username, email, password, role });
//     //             localStorage.setItem("authToken", response.data.token);
//     //             navigate("/otp-screen");
//     //         } else {
//     //             response = await client.post("/auth/login", { username, password });
//     //             localStorage.setItem("authToken", response.data.token);
//     //             navigate(
//     //                 role === 'admin' ? "/admindashboard" :
//     //                     role === 'parent' ? "/parentdashboard" :
//     //                         "/tutordashboard"
//     //             );
//     //         }
//     //         dispatch(login(response.data.user));
//     //         toast.success(isSignup ? "Registration successful!" : "Login successful!");
//     //         onClose();
//     //     } catch (error) {
//     //         dispatch(setError(error.response?.data?.message || "Action failed"));
//     //         toast.error("Action failed! " + (error.response?.data?.message || ""));
//     //     } finally {
//     //         dispatch(setLoading(false));
//     //     }
//     // };

//     const handleSubmit = async () => {
//         dispatch(setLoading(true));
//         dispatch(setError(null));
    
//         try {
//             if (!username || !password || (isSignup && !email)) {
//                 toast.error("Please fill in all fields.");
//                 return;
//             }
    
//             let response;
//             if (isSignup) {
//                 response = await client.post("/auth/register", { username, email, password, role });
//                 localStorage.setItem("authToken", response.data.token);
//                 navigate("/otp-screen");
//             } else {
//                 response = await client.post("/auth/login", { username, password });
//                 localStorage.setItem("authToken", response.data.token);
    
//                 // Debugging: Check if role is correctly received
//                 console.log("User Role:", response.data.user.role);
    
//                 const userRole = response.data.user.role; // Get role from response
//                 navigate(
//                     userRole === "admin" ? "/admindashboard" :
//                     userRole === "parent" ? "/parentdashboard" :
//                     "/tutordashboard"
//                 );
//             }
    
//             dispatch(login(response.data.user));
//             toast.success(isSignup ? "Registration successful!" : "Login successful!");
//             onClose();
//         } catch (error) {
//             dispatch(setError(error.response?.data?.message || "Action failed"));
//             toast.error("Action failed! " + (error.response?.data?.message || ""));
//         } finally {
//             dispatch(setLoading(false));
//         }
//     };
    

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div ref={modalRef} className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 relative">
//                 <div className="flex justify-center space-x-4 mb-6">
//                     <button
//                         className={`px-4 py-2 font-semibold ${role === "parent" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} rounded-lg`}
//                         onClick={() => setRole("parent")}
//                     >
//                         {isSignup ? "Parent" : "Login as Parent"}
//                     </button>
//                     <button
//                         className={`px-4 py-2 font-semibold ${role === "tutor" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} rounded-lg`}
//                         onClick={() => setRole("tutor")}
//                     >
//                         {isSignup ? "Tutor" : "Login as Tutor"}
//                     </button>
//                 </div>
//                 {isSignup && (
//                     <div>
//                         <label className="text-gray-700">Email</label>
//                         <input type="email" className="w-full px-4 py-2 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
//                     </div>
//                 )}
//                 <div>
//                     <label className="text-gray-700">Username</label>
//                     <input type="text" className="w-full px-4 py-2 border rounded-lg" value={username} onChange={(e) => setUsername(e.target.value)} />
//                 </div>
//                 <div>
//                     <label className="text-gray-700">Password</label>
//                     <input type="password" className="w-full px-4 py-2 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
//                 </div>
//                 <div className="mt-6">
//                     <button onClick={handleSubmit} className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg">
//                         {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AuthModal;



// import React, { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { login, setLoading, setError } from "../../redux/features/auth/authSlice";
// import client from "../../lib/axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// // const AuthModal = ({ isOpen, onClose, isSignup, setIsSignup }) => {
//     const AuthModal = ({ isOpen, onClose, isSignup, setIsSignup }) => {

//     const modalRef = useRef();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [role, setRole] = useState("parent");
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [email, setEmail] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const loading = useSelector((state) => state.auth.loading);
//     const error = useSelector((state) => state.auth.error);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (modalRef.current && !modalRef.current.contains(event.target)) {
//                 onClose();
//             }
//         };
//         if (isOpen) {
//             document.addEventListener("mousedown", handleClickOutside);
//         }
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [isOpen, onClose]);

//     const handleSubmit = async () => {
//         dispatch(setLoading(true));
//         dispatch(setError(null));

//         try {
//             if (!username || !password || (isSignup && !email)) {
//                 toast.error("Please fill in all fields.");
//                 return;
//             }

//             let response;
//             if (isSignup) {
//                 response = await client.post("/auth/register", { username, email, password, role });
//                 localStorage.setItem("authToken", response.data.token);
//                 navigate("/otp-screen");
//             } else {
//                 response = await client.post("/auth/login", { username, password });
//                 localStorage.setItem("authToken", response.data.token);
//                 const userRole = response.data.user.role;
//                 navigate(
//                     userRole === "admin" ? "/admindashboard" :
//                     userRole === "parent" ? "/parentdashboard" :
//                     "/tutordashboard"
//                 );
//             }

//             dispatch(login(response.data.user));
//             toast.success(isSignup ? "Registration successful!" : "Login successful!");
//             onClose();
//         } catch (error) {
//             dispatch(setError(error.response?.data?.message || "Action failed"));
//             toast.error("Action failed! " + (error.response?.data?.message || ""));
//         } finally {
//             dispatch(setLoading(false));
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50">
//             <div
//                 ref={modalRef}
//                 className="bg-white bg-opacity-90 backdrop-blur-lg shadow-lg rounded-2xl w-full max-w-lg p-8 relative transition-transform transform translate-y-6"
//             >
//                 <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{isSignup ? "Sign Up" : "Login"}</h2>

//                 {/* Role Toggle Button */}
//                 <div className="flex justify-center mb-6">
//                     <div className="relative inline-flex bg-gray-300 rounded-full p-1">
//                         <button
//                             className={`px-6 py-2 rounded-full transition ${
//                                 role === "parent" ? "bg-blue-600 text-white shadow-lg" : "text-gray-700"
//                             }`}
//                             onClick={() => setRole("parent")}
//                         >
//                             Parent
//                         </button>
//                         <button
//                             className={`px-6 py-2 rounded-full transition ${
//                                 role === "tutor" ? "bg-blue-600 text-white shadow-lg" : "text-gray-700"
//                             }`}
//                             onClick={() => setRole("tutor")}
//                         >
//                             Tutor
//                         </button>
//                     </div>
//                 </div>

//                 {isSignup && (
//                     <div className="mb-4">
//                         <label className="text-gray-700">Email</label>
//                         <input
//                             type="email"
//                             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                     </div>
//                 )}

//                 <div className="mb-4">
//                     <label className="text-gray-700">Username</label>
//                     <input
//                         type="text"
//                         className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                     />
//                 </div>

//                 <div className="mb-4 relative">
//                     <label className="text-gray-700">Password</label>
//                     <input
//                         type={showPassword ? "text" : "password"}
//                         className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <span
//                         className="absolute right-3 top-10 cursor-pointer text-gray-600 hover:text-gray-900 transition"
//                         onClick={() => setShowPassword(!showPassword)}
//                     >
//                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </span>
//                 </div>

//                 {/* Gradient Animated Button */}
//                 <div className="mt-6">
//                     <button
//                         onClick={handleSubmit}
//                         className="w-full py-3 px-6 rounded-lg font-semibold text-white shadow-md transition-transform transform active:scale-95"
//                         style={{
//                             background: "linear-gradient(135deg, #6EC6FF, #0080FF)",
//                         }}
//                     >
//                         {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
//                     </button>
//                 </div>

//                 {/* Fix: Toggle Between Login & Signup */}
//                 {/* <div className="mt-4 text-center">
//                     {isSignup ? (
//                         <p className="text-gray-600">
//                             Already a user?{" "}
//                             <button
//                                 className="text-blue-600 font-bold cursor-pointer"
//                                 onClick={() => setIsSignup(false)}
//                             >
//                                 Login here
//                             </button>
//                         </p>
//                     ) : (
//                         <p className="text-gray-600">
//                             New user?{" "}
//                             <button
//                                 className="text-blue-600 font-bold cursor-pointer"
//                                 onClick={() => setIsSignup(true)}
//                             >
//                                 Sign up here
//                             </button>
//                         </p>
//                     )}
//                 </div> */}

//                 {/* Fix: Toggle Between Login & Signup */}
// <div className="mt-4 text-center">
//     {isSignup ? (
//         <p className="text-gray-600">
//             Already a user?{" "}
//             <button
//                 className="text-blue-600 font-bold cursor-pointer"
//                 onClick={() => setIsSignup(false)}
//             >
//                 Login here
//             </button>
//         </p>
//     ) : (
//         <p className="text-gray-600">
//             New user?{" "}
//             <button
//                 className="text-blue-600 font-bold cursor-pointer"
//                 onClick={() => setIsSignup(true)}
//             >
//                 Sign up here
//             </button>
//         </p>
//     )}
// </div>

//             </div>
//         </div>
//     );
// };

// export default AuthModal;

// import React, { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { login, setLoading, setError } from "../../redux/features/auth/authSlice";
// import client from "../../lib/axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const AuthModal = ({ isOpen, onClose, isSignup, setIsSignup }) => {
//     const modalRef = useRef();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [role, setRole] = useState("parent");
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [email, setEmail] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const loading = useSelector((state) => state.auth.loading);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (modalRef.current && !modalRef.current.contains(event.target)) {
//                 onClose();
//             }
//         };
//         if (isOpen) {
//             document.addEventListener("mousedown", handleClickOutside);
//         }
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [isOpen, onClose]);

//     const handleSubmit = async () => {
//         dispatch(setLoading(true));
//         dispatch(setError(null));

//         if (!username || !password || (isSignup && !email)) {
//             toast.error("Please fill in all fields.");
//             dispatch(setLoading(false));
//             return;
//         }

//         try {
//             let response;
//             if (isSignup) {
//                 response = await client.post("/auth/register", { username, email, password, role });
//                 localStorage.setItem("authToken", response.data.token);
//                 navigate("/otp-screen");
//             } else {
//                 response = await client.post("/auth/login", { username, password });
//                 localStorage.setItem("authToken", response.data.token);
//                 const userRole = response.data.user.role;
//                 navigate(userRole === "admin" ? "/admindashboard" : userRole === "parent" ? "/parentdashboard" : "/tutordashboard");
//             }

//             dispatch(login(response.data.user));
//             toast.success(isSignup ? "Registration successful!" : "Login successful!");
//             setTimeout(() => onClose(), 500);
//         } catch (error) {
//             dispatch(setError(error.response?.data?.message || "Action failed"));
//             toast.error("Action failed! " + (error.response?.data?.message || ""));
//         } finally {
//             dispatch(setLoading(false));
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50">
//             <div ref={modalRef} className="bg-white bg-opacity-90 backdrop-blur-lg shadow-lg rounded-2xl w-full max-w-lg p-8 relative">
//                 <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{isSignup ? "Sign Up" : "Login"}</h2>

//                 {isSignup && (
//                     <div className="flex justify-center mb-6">
//                         <div className="relative inline-flex bg-gray-300 rounded-full p-1">
//                             <button className={`px-6 py-2 rounded-full transition ${role === "parent" ? "bg-blue-600 text-white shadow-lg" : "text-gray-700"}`} onClick={() => setRole("parent")}>
//                                 Parent
//                             </button>
//                             <button className={`px-6 py-2 rounded-full transition ${role === "tutor" ? "bg-blue-600 text-white shadow-lg" : "text-gray-700"}`} onClick={() => setRole("tutor")}>
//                                 Tutor
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {isSignup && (
//                     <div className="mb-4">
//                         <label className="text-gray-700">Email</label>
//                         <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition" value={email} onChange={(e) => setEmail(e.target.value)} />
//                     </div>
//                 )}

//                 <div className="mb-4">
//                     <label className="text-gray-700">Username</label>
//                     <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition" value={username} onChange={(e) => setUsername(e.target.value)} />
//                 </div>

//                 <div className="mb-4 relative">
//                     <label className="text-gray-700">Password</label>
//                     <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition" value={password} onChange={(e) => setPassword(e.target.value)} />
//                     <span className="absolute right-3 top-10 cursor-pointer text-gray-600 hover:text-gray-900 transition" onClick={() => setShowPassword(!showPassword)}>
//                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </span>
//                 </div>

//                 <div className="mt-6">
//                     <button onClick={handleSubmit} className="w-full py-3 px-6 rounded-lg font-semibold text-white shadow-md transition-transform transform active:scale-95" style={{ background: "linear-gradient(135deg, #6EC6FF, #0080FF)" }}>
//                         {loading ? <span className="animate-spin w-5 h-5 border-t-2 border-white rounded-full mx-auto"></span> : isSignup ? "Sign Up" : "Login"}
//                     </button>
//                 </div>

//                 <div className="mt-4 text-center">
//                     {isSignup ? (
//                         <p className="text-gray-600">Already a user? <button className="text-blue-600 font-bold cursor-pointer" onClick={() => setIsSignup(false)}>Login here</button></p>
//                     ) : (
//                         <p className="text-gray-600">New user? <button className="text-blue-600 font-bold cursor-pointer" onClick={() => setIsSignup(true)}>Sign up here</button></p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AuthModal;



import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, setLoading, setError } from "../../redux/features/auth/authSlice";
import client from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthModal = ({ isOpen, onClose, isSignup, setIsSignup }) => {
    const modalRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [role, setRole] = useState("parent");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleSubmit = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            if (!username || !password || (isSignup && !email)) {
                toast.error("Please fill in all fields.");
                return;
            }

            let response;
            if (isSignup) {
                response = await client.post("/auth/register", { username, email, password, role });
                localStorage.setItem("authToken", response.data.token);
                navigate("/otp-screen");
            } else {
                response = await client.post("/auth/login", { username, password });
                localStorage.setItem("authToken", response.data.token);
                const userRole = response.data.user.role;
                navigate(
                    userRole === "admin" ? "/admindashboard" :
                    userRole === "parent" ? "/parentdashboard" :
                    "/tutordashboard"
                );
            }

            dispatch(login(response.data.user));
            toast.success(isSignup ? "Registration successful!" : "Login successful!");
            onClose();
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Action failed"));
            toast.error("Action failed! " + (error.response?.data?.message || ""));
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50">
            <div
                ref={modalRef}
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-lg rounded-2xl w-full max-w-lg p-8 relative transition-transform transform translate-y-12"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{isSignup ? "Sign Up" : "Login"}</h2>

                {isSignup && (
                    <div className="flex justify-center mb-6">
                        <div className="relative inline-flex bg-gray-300 rounded-full p-1">
                            <button
                                className={`px-6 py-2 rounded-full transition ${
                                    role === "parent" ? "bg-blue-600 text-white shadow-lg" : "text-gray-700"
                                }`}
                                onClick={() => setRole("parent")}
                            >
                                Parent
                            </button>
                            <button
                                className={`px-6 py-2 rounded-full transition ${
                                    role === "tutor" ? "bg-blue-600 text-white shadow-lg" : "text-gray-700"
                                }`}
                                onClick={() => setRole("tutor")}
                            >
                                Tutor
                            </button>
                        </div>
                    </div>
                )}

                {isSignup && (
                    <div className="mb-4">
                        <label className="text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="text-gray-700">Username</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-4 relative">
                    <label className="text-gray-700">Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className="absolute right-3 top-10 cursor-pointer text-gray-600 hover:text-gray-900 transition"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 px-6 rounded-lg font-semibold text-white shadow-md transition-transform transform active:scale-95"
                        style={{
                            background: "linear-gradient(135deg, #6EC6FF, #0080FF)",
                        }}
                    >
                        {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    {isSignup ? (
                        <p className="text-gray-600">
                            Already a user? {" "}
                            <button
                                className="text-blue-600 font-bold cursor-pointer"
                                onClick={() => setIsSignup(false)}
                            >
                                Login here
                            </button>
                        </p>
                    ) : (
                        <p className="text-gray-600">
                            New user? {" "}
                            <button
                                className="text-blue-600 font-bold cursor-pointer"
                                onClick={() => setIsSignup(true)}
                            >
                                Sign up here
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;


