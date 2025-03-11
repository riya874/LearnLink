const User = require("../models/User");
const Tutor = require("../models/Tutor");
const Parent = require("../models/Parent");
const Session = require("../models/Session");
const Review = require("../models/Review");
const Message = require("../models/Message");

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};

// Get all tutors
exports.getAllTutors = async (req, res) => {
    try {
        const tutors = await Tutor.find().populate("userId");
        res.status(200).json(tutors);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tutors" });
    }
};

// Delete a tutor
exports.deleteTutor = async (req, res) => {
    try {
        await Tutor.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Tutor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete tutor" });
    }
};

// Get all parents
exports.getAllParents = async (req, res) => {
    try {
        const parents = await Parent.find().populate("userId");
        res.status(200).json(parents);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch parents" });
    }
};

// Delete a parent
exports.deleteParent = async (req, res) => {
    try {
        await Parent.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Parent deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete parent" });
    }
};

// Get all sessions
exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find().populate("tutorId parentId");
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
};

// Update session status
exports.updateSessionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await Session.findByIdAndUpdate(req.params.id, { status });
        res.status(200).json({ message: "Session status updated" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update session status" });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate("tutorId parentId");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete review" });
    }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().populate("senderId receiverId sessionId");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete message" });
    }
};
