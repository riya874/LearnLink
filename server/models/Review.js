const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reviews', ReviewSchema);
