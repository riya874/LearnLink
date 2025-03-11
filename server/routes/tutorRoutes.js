const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { createOrUpdateTutorProfile, getTutorProfile, getAllTutors, deleteTutorProfile, getAvailableTutors } = require('../controllers/tutorController');

// CREATE OR UPDATE TUTOR PROFILE (AUTH REQUIRED)
router.post('/profile', authenticate, createOrUpdateTutorProfile);
// GET AVAILABLE TUTOR PROFILE (AUTH REQUIRED)
router.get("/available", getAvailableTutors);
// GET A SINGLE TUTOR PROFILE
router.get('/:tutorId', getTutorProfile);

// GET ALL TUTORS (FILTERING OPTIONS)
router.get('/', getAllTutors);



// DELETE TUTOR PROFILE (AUTH REQUIRED)
router.delete('/profile', authenticate, deleteTutorProfile);

module.exports = router;
