import React, { useState } from "react";
import { motion } from "framer-motion";
import "./LandingPage.css"; 
import user1 from "../../assets/user1.png";
import user2 from "../../assets/user2.png";
import user3 from "../../assets/user3.png";
import user4 from "../../assets/user4.png";
import AuthModal from "../../components/AuthModal/LoginSignupModal";

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const features = [
    {
      title: "Personalized Tutor Searches",
      description: "Use advanced search filters to find tutors based on subjects, experience levels, hourly rates, and teaching styles.",
    },
    {
      title: "Localized Tutoring Services",
      description: "By providing location-based searches, the platform helps you find tutors who are conveniently nearby.",
    },
    {
      title: "Comprehensive Tutor Profiles",
      description: "Tutor profiles provide detailed information to help parents make informed decisions.",
    },
    {
      title: "Flexible Scheduling",
      description: "Plan tutoring sessions at your convenience with flexible scheduling options.",
    },
    {
      title: "Affordable Rates",
      description: "Find tutoring services that fit your budget, with no hidden fees.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Parent",
      text: "We found a perfect local math tutor for my son. Booking was so simple, and the tutor was just a few blocks away.",
      image: user2,
    },
    {
      name: "Ravi K.",
      role: "Parent",
      text: "LearnLink made finding a qualified tutor for my daughter effortless.",
      image: user1,
    },
    {
      name: "Emily J.",
      role: "English & History",
      text: "The platform connects me with students in my local community. It's been great!",
      image: user3,
    },
    {
      name: "James T.",
      role: "Mathematics",
      text: "LearnLink's scheduling system is intuitive and helps me manage sessions efficiently.",
      image: user4,
    },
  ];

  return (
    <div className="page-ui">
      {/* Features Section */}
      <section className="features">
        <h2>FEATURES</h2>
        <div className="features-cards">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>HEAR FROM OUR AWESOME USERS</h2>
        <motion.div
          className="testimonial-cards"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {testimonials.map((user, index) => (
            <motion.div
              className="testimonial-card"
              key={index}
              whileHover={{ scale: 1.05 }}
            >
              <img src={user.image} alt={user.name} />
              <h3>{user.name}</h3>
              <p className="role">{user.role}</p>
              <p className="text">{user.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Join Our Community Section */}
      <section className="join-community">
        <h2>JOIN OUR COMMUNITY NOW</h2>
        <p>
          Be part of a vibrant learning community and enhance your skills with us. 
          Sign up today to start your educational journey.
        </p>

        {/* Get In Touch Button */}
        <motion.button
          className="get-in-touch"
          whileHover={{ scale: 1.1, backgroundColor: "#4CAF50" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => openModal("signup")}
        >
          GET IN TOUCH
        </motion.button>

        {/* Auth Modal */}
        {isModalOpen && (
          <AuthModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            isSignup={modalType === "signup"}
          />
        )}
      </section>
    </div>
  );
};

export default LandingPage;

