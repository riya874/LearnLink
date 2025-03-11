const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const authenticate = require('../middlewares/authMiddleware');

// Send a message
router.post("/send", authenticate, async (req, res) => {
    try {
        const { receiverId, sessionId, message } = req.body;
        const senderId = req.user; // Extracted from token

        const newMessage = new Message({ senderId, receiverId, sessionId, message });
        await newMessage.save();

        res.status(201).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get messages for a session
router.get("/session/:sessionId", authenticate, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const messages = await Message.find({ sessionId }).populate("senderId", "username profilePhoto");

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
