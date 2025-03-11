const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { cancelSession, rescheduleSession, bookSession, getSessionsByParent, getSessionsByTutor } = require('../controllers/sessionController');


// BOOK SESSION
router.post("/book", bookSession);

// RESCHEDULE SESSION
router.put("/reschedule/:sessionId", rescheduleSession);

// CANCEL SESSION
router.put("/cancel/:sessionId", cancelSession);

// GET ALL SESSIONS FOR A SPECIFIC PARENT
router.get('/parent/:parentId', getSessionsByParent);

// GET ALL SESSIONS FOR A SPECIFIC TUTOR
router.get('/tutor/:tutorId', getSessionsByTutor);

module.exports = router;
