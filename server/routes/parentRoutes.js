const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { createOrUpdateParentProfile, getParentProfile, getAllParents, deleteParentProfile } = require('../controllers/parentController');

// CREATE OR UPDATE PARENT PROFILE (AUTH REQUIRED)
router.post('/profile', authenticate, createOrUpdateParentProfile);

// GET A SINGLE PARENT PROFILE
router.get('/:parentId', getParentProfile);

// GET ALL PARENTS (FILTERING OPTIONS)
router.get('/', getAllParents);

// DELETE PARENT PROFILE (AUTH REQUIRED)
router.delete('/profile', authenticate, deleteParentProfile);

module.exports = router;
