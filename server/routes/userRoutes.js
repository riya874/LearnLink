// PACKAGES
const express = require('express');
const { body } = require('express-validator');

// FILES
const { registerUser, verifyEmail, logout, loginUser, resendVerificationEmail, verifyUser, updateUser } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

// ROUTER OBJECT
const router = express.Router();

// VALIDATION RULES
const validateRegistration = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['parent', 'tutor', 'admin']).withMessage('Invalid role'),
];

const validateLogin = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

const validateUpdateUser = [
    body('username').optional().notEmpty().withMessage('Invalid username'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('address').optional().notEmpty().withMessage('Invalid address'),
    body('pincode').optional().isPostalCode('any').withMessage('Invalid pincode'),
    body('profilePhoto').optional().isURL().withMessage('Invalid profile photo URL'),
];

// CREATED ROUTES
router.post('/register', validateRegistration, registerUser);
router.post('/verify-email', authenticate, verifyEmail);
router.post('/resend-otp', authenticate, resendVerificationEmail);
router.post('/login', validateLogin, loginUser);
router.get('/verify-user', authenticate, verifyUser);
router.put('/update', authenticate, validateUpdateUser, updateUser);
router.delete('/logout', logout);

// EXPORT ROUTER
module.exports = router;
