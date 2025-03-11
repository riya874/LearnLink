// PACKAGES
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// FILES
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendVerificationEmail } = require('../services/emailService');
const authenticate = require('../middlewares/authMiddleware');

// HANDLING COOKIE FUNCTION
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000, // 1 hour
    sameSite: 'Strict',
};

// VARIABLES
const RESEND_OTP_LIMIT = 3;
const OTP_EXPIRATION_TIME = 2 * 60 * 1000;

// REGISTER USER FUNCTION
const registerUser = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { role, username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ message: 'Username or email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(1000 + Math.random() * 9000).toString();
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role,
            isVerified: false,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + OTP_EXPIRATION_TIME,
        });

        await user.save();
        const token = generateToken(user._id);
        res.cookie('token', token, cookieOptions);
        await sendVerificationEmail({ email: user.email, verificationToken });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user,
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// VERIFY EMAIL FUNCTION
const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
        if (user.verificationToken !== otp || user.verificationTokenExpiresAt < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired verification OTP' });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// RESEND VERIFICATION FUNCTION
const resendVerificationEmail = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
        if (user.otpResendCount >= RESEND_OTP_LIMIT) return res.status(400).json({ message: 'OTP resend limit exceeded' });
        const verificationToken = Math.floor(1000 + Math.random() * 9000).toString();
        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = Date.now() + OTP_EXPIRATION_TIME;
        user.otpResendCount += 1;
        await user.save();
        await sendVerificationEmail({ email: user.email, verificationToken });
        res.status(200).json({ message: 'New OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// LOGIN USER FUNCTION
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const token = generateToken(user._id);
        res.cookie('token', token, cookieOptions);
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// VERIFY USER FUNCTION
const verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ success: true, message: 'User is authenticated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// UPDATE USER FUNCTION
const updateUser = async (req, res) => {
    try {
        const userId = req.user;
        const { username, phone, address, pincode, profilePhoto } = req.body;

        // Validate request
        if (!username && !phone && !address && !pincode && !profilePhoto) {
            return res.status(400).json({ message: "At least one field must be provided for update" });
        }

        // Find the user and update only provided fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { username, phone, address, pincode, profilePhoto } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                pincode: updatedUser.pincode,
                profilePhoto: updatedUser.profilePhoto,
            }
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// FORGOT PASSWORD FUNCTION
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

        await user.save();
        await sendResetEmail({ email: user.email, resetToken });

        res.status(200).json({ message: "Password reset OTP sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// RESET PASSWORD FUNCTION
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email, resetPasswordToken: otp });
        if (!user || user.resetPasswordExpiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// LOGOUT USER FUNCTION
const logout = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};


module.exports = { registerUser, verifyEmail, resendVerificationEmail, loginUser, verifyUser, updateUser, forgotPassword, resetPassword, logout };
