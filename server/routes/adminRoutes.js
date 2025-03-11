const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");

// User Management
router.get("/users", authenticate, adminController.getAllUsers);
router.delete("/users/:id", authenticate, adminController.deleteUser);

// Tutor Management
router.get("/tutors", authenticate, adminController.getAllTutors);
router.delete("/tutors/:id", authenticate, adminController.deleteTutor);

// Parent Management
router.get("/parents", authenticate, adminController.getAllParents);
router.delete("/parents/:id", authenticate, adminController.deleteParent);

// Session Management
router.get("/sessions", authenticate, adminController.getAllSessions);
router.put("/sessions/:id/status", authenticate, adminController.updateSessionStatus);

// Review Management
router.get("/reviews", authenticate, adminController.getAllReviews);
router.delete("/reviews/:id", authenticate, adminController.deleteReview);

// Message Management
router.get("/messages", authenticate, adminController.getAllMessages);
router.delete("/messages/:id", authenticate, adminController.deleteMessage);

module.exports = router;
