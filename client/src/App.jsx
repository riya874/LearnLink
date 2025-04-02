import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, setLoading, setError, selectUserRole, selectUser, selectIsVerified } from "./redux/features/auth/authSlice";
import client from "./lib/axios";
import LandingPage from "./pages/clientPages/LandingPage";
import About from "./pages/clientPages/About";
import OtpScreen from "./pages/authPages/OtpScreen";
import ParentDashboard from "./pages/clientPages/ParentDashboard";
import TutorDashboard from "./pages/clientPages/TutorDashboard";
import './App.css';
import AdminDashboard from "./pages/adminPages/AdminDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoadingState] = useState(true);
  const username = useSelector(selectUser);
  const role = useSelector(selectUserRole);
  const isVerified = useSelector(selectIsVerified);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          dispatch(setLoading(true));
          const response = await client.get("/auth/verify-user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success && response.data.user) {
            dispatch(login(response.data.user));
            // Redirect user to their respective dashboard based on their role
            if (response.data.user.role === "parent" && response.data.user.isVerified) {
              navigate("/parentdashboard");
            } else if (response.data.user.role === "tutor" && response.data.user.isVerified) {
              navigate("/tutordashboard");
            } else if (response.data.user.role === "admin" && response.data.user.isVerified) {
              navigate("/admindashboard");
            }
          } else {
            dispatch(setError("Authentication failed"));
          }
        } catch (error) {
          dispatch(setError("Token verification failed"));
        } finally {
          dispatch(setLoading(false));
          setLoadingState(false);
        }
      } else {
        setLoadingState(false);
      }
    };
    checkAuth();
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img src="/loading.gif" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              isVerified && role ? (
                // If the user is verified and has a role, redirect to their respective dashboard
                role === "parent" ? (
                  <Navigate to="/parentdashboard" />
                ) : role === "tutor" ? (
                  <Navigate to="/tutordashboard" />
                ) : role === "admin" ? (
                  <Navigate to="/admindashboard" />
                ) : null
              ) : (
                // Otherwise, show the LandingPage
                <LandingPage />
              )
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/otp-screen" element={isVerified ? <Navigate to="/" /> : <OtpScreen />} />
          <Route path="/parentdashboard" element={isVerified && role === "parent" ? <ParentDashboard /> : <Navigate to="/" />} />
          <Route path="/tutordashboard" element={isVerified && role === "tutor" ? <TutorDashboard /> : <Navigate to="/" />} />
          <Route path="/admindashboard" element={isVerified && role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;