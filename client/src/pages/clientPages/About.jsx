import React from "react";
import { motion } from "framer-motion";
import "./About.css";
import logo from "../../assets/logo.png";

const About = () => {
  return (
    <div className="about-us-page">
      <motion.div
        className="glass-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Logo */}
        <motion.img
          src={logo}
          alt="LearnLink Logo"
          className="about-logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Title */}
        <motion.h1
          className="about-title"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          LearnLink
        </motion.h1>

        {/* Tagline */}
        <motion.h2
          className="about-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          The right tutor at your door, <br/>
          making learning less of a chore.
        </motion.h2>

        {/* Description */}
        <motion.p
          className="about-description-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          LearnLink is a specialized, web-based platform designed to connect parents of 1-10 students with local tutors who can provide personalized educational support. 
          This platform emphasizes simplicity, focusing primarily on discovering and booking tutors without overwhelming users with additional complex features. 
          By utilizing advanced search and filtering options, LearnLink allows parents to find tutors based on subject expertise, grade, level, availability, proximity and even the specific school their child attends. 
          It offers a user-centric approach, enabling parents to make informed decisions through detailed tutor profiles, which include qualifications, reviews and teaching methodologies. 
          LearnLink facilitates direct communication between parents and tutors through an in-app messaging system, streamlining the process of arranging tutoring sessions.
</motion.p>
      </motion.div>
    </div>
  );
};

export default About;