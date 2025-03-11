const mongoose = require("mongoose");

// Admin Schema
const AdminSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    verifiedTutors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' }]
});

module.exports = mongoose.model('Admin', AdminSchema);

