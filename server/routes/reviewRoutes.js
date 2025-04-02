// const express = require('express');
// const router = express.Router();
// const { addReview, addLike, getReviews } = require('../controllers/tutorController');


// // Get all reviews for a tutor
// router.get('/:tutorId', getReviews);
// // Add a review to a tutor
// router.post('/tutor', addReview);

// // Like a tutor's profile
// router.post('/tutor/:tutorId/like', addLike);

// module.exports = router;




const express = require('express');
const router = express.Router();
const { addReview, addLike, getReviews, deleteReview } = require('../controllers/tutorController');

// Get all reviews for a tutor
router.get('/:tutorId', getReviews);

// Add a review to a tutor
router.post('/tutor', addReview);

// Like a tutor's profile
router.post('/tutor/:tutorId/like', addLike);

// Delete a review
router.delete('/review/:reviewId', deleteReview);

module.exports = router;
