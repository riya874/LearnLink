const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// Route to submit feedback
router.post('/submit', feedbackController.submitFeedback);

// Route to get all feedbacks (admin)
router.get('/all', feedbackController.getAllFeedback);

router.get('/:userId', feedbackController.getFeedbackByUser);

module.exports = router;
