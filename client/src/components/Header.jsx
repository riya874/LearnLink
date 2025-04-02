import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import logo from "../assets/logo.png";
import AuthModal from "../components/AuthModal/LoginSignupModal";

const Header = () => {
  const user = useSelector(selectUser); // Get the user from Redux store
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#ADD8E6",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, rgba(173, 216, 230, 0.7), rgba(255, 182, 193, 0.7))",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 30px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="Logo" style={{ width: "80px", height: "80px", marginRight: "15px" }} />
            <div>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  fontFamily: "'Lobster', cursive",
                  color: "#333",
                  marginBottom: "5px",
                }}
              >
                LearnLink
              </h1>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  fontFamily: "'Poppins', sans-serif",
                  fontStyle: "italic",
                  color: "#555",
                  margin: 0,
                }}
              >
                The right tutor at your door, <br /> making learning less of a chore.
              </p>
            </div>
          </div>

          <nav className="navbar" style={{ display: "flex", alignItems: "center" }}>
            <ul
              style={{
                display: "flex",
                alignItems: "center",
                listStyle: "none",
                margin: 0,
                padding: 0,
                gap: "40px",
              }}
            >
              <li style={{ textAlign: "center" }}>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <FaHome size={28} style={{ color: "blue" }} />
                  <div style={{ color: "purple", fontWeight: "bold", fontSize: "16px", marginTop: "5px" }}>
                    Home
                  </div>
                </Link>
              </li>
              <li style={{ textAlign: "center" }}>
                <Link to="/about" style={{ textDecoration: "none" }}>
                  <FaInfoCircle size={28} style={{ color: "blue" }} />
                  <div style={{ color: "purple", fontWeight: "bold", fontSize: "16px", marginTop: "5px" }}>
                    About
                  </div>
                </Link>
              </li>
            </ul>

            <div style={{ marginLeft: "30px" }}>
              {user && user.username ? (
                <span style={{ fontWeight: "bold", color: "#FFF" }}>Welcome, {user.username}</span>
              ) : (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => openModal("login")}
                    style={{
                      background: "purple",
                      color: "#FFF",
                      padding: "10px 22px",
                      borderRadius: "20px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.background = "#660066")}
                    onMouseOut={(e) => (e.target.style.background = "purple")}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openModal("signup")}
                    style={{
                      background: "#0072FF",
                      color: "#FFF",
                      padding: "10px 22px",
                      borderRadius: "20px",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.background = "#005FCC")}
                    onMouseOut={(e) => (e.target.style.background = "#0072FF")}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* {isModalOpen && <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isSignup={modalType === "signup"} />} */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isSignup={modalType === "signup"}
        setIsSignup={(isSignup) => setModalType(isSignup ? "signup" : "login")} // ✅ Correct prop
      />


    </>
  );
};

export default Header;

