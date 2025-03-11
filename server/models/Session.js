const mongoose = require("mongoose");
const SessionSchema = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
    childName: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['Booked', 'Completed', 'Cancelled'], default: 'Booked' }
});

module.exports = mongoose.model('Session', SessionSchema);
