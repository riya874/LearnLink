const mongoose = require("mongoose");
const ParentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    children: {
        name: { type: String },
        grade: { type: String },
        school: { type: String }
    },
    preferences: {
        subjects: [String],
        teachingStyle: String,
        languagePreference: String,
        tutorGender: String
    }
});

module.exports = mongoose.model('Parent', ParentSchema);
