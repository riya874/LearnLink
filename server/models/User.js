const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['parent', 'tutor', 'admin'], required: true },
    phone: { type: String },
    address: { type: String },
    pincode: { type: String },
    profilePhoto: { type: String },
    isVerified: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);
