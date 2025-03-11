const mongoose = require("mongoose");

const TutorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    qualifications: { type: String },
    subjects: [String],
    grades: [String],
    experience: { type: Number, },
    languages: [String],
    gender: { type: String },
    teachingMethodology: { type: String },
    availability: [{ day: String, timeSlots: [String] }],
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    certifications: [{ type: String }]
});

module.exports = mongoose.model('Tutor', TutorSchema);
