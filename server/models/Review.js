const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);

