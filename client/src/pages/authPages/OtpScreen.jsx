import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserEmail, selectUserRole } from "../../redux/features/auth/authSlice";
import client from "../../lib/axios";
import { toast } from "react-hot-toast";

const OtpScreen = () => {
    const email = useSelector(selectUserEmail);
    const role = useSelector(selectUserRole);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resend, setResend] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleOtpChange = (value, index) => {
        if (!/^\d*$/.test(value)) return; // Prevent non-numeric input
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only allow 1 digit
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    useEffect(() => {
        if (otp.every((digit) => digit !== "")) {
            setTimeout(handleVerifyOtp, 500); // Debounce auto-submit
        }
    }, [otp]);

    // const handleVerifyOtp = async () => {
    //     const otpString = otp.join('');
    //     if (otpString.length !== 4) {
    //         toast.error("Please enter a valid 4-digit OTP");
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const token = localStorage.getItem('authToken');
    //         const response = await client.post("/auth/verify-email", { role, otp: otpString }, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });

    //         if (response.data.success) {
    //             toast.success("OTP verified successfully!");
    //             navigate('/tutordashboard');
    //         } else {
    //             toast.error("Invalid OTP. Please try again.");
    //         }
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "An error occurred.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await client.post("/auth/verify-email", { role, otp: otpString }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userRole = response.data.user.role;
            console.log(response.data.user)
            console.log(userRole)
            if (response.data.success) {
                toast.success("OTP verified successfully!");
                navigate(
                    userRole === "admin" ? "/admindashboard" :
                        userRole === "parent" ? "/parentdashboard" :
                            "/tutordashboard"
                );
            } else {
                toast.error("Invalid OTP. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResend(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await client.post("/auth/resend-otp", { role }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            response.data.success
                ? toast.success("OTP resent successfully!")
                : toast.error("Error: Please try again.");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            setResend(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="flex flex-col items-center bg-white text-gray-800 rounded-xl shadow-lg w-full max-w-md p-8 m-6">
                <h1 className="text-2xl font-semibold mb-4 text-gray-700">Enter OTP</h1>
                <p className="text-gray-500 text-center mb-6">
                    We have sent a 4-digit OTP to your email: <strong>{email}</strong>
                </p>

                <div className="flex space-x-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            className="w-14 h-14 text-center text-2xl bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition hover:bg-gray-200"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className={`w-full py-3 bg-blue-500 text-white rounded-lg font-semibold text-lg transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                        }`}
                >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                    onClick={handleResendOtp}
                    className="mt-4 text-blue-500 hover:text-blue-700 transition font-semibold"
                    disabled={resend}
                >
                    {resend ? 'Wait...' : 'Resend OTP'}
                </button>
            </div>
        </div>
    );
};

export default OtpScreen;


