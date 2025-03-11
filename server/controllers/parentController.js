const Parent = require('../models/Parent');
const User = require('../models/User');

// CREATE OR UPDATE PARENT PROFILE
const createOrUpdateParentProfile = async (req, res) => {
    try {
        const userId = req.user; // Authenticated user
        const { children, preferences } = req.body;

        let parent = await Parent.findOne({ userId });

        if (parent) {
            // Update existing parent profile
            parent = await Parent.findOneAndUpdate(
                { userId },
                { $set: { children, preferences } },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ success: true, message: "Parent profile updated successfully", parent });
        } else {
            // Create new parent profile
            const newParent = new Parent({
                userId,
                children,
                preferences
            });
            await newParent.save();
            return res.status(201).json({ success: true, message: "Parent profile created successfully", parent: newParent });
        }
    } catch (error) {
        console.error("Error creating/updating parent profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET A SINGLE PARENT PROFILE
const getParentProfile = async (req, res) => {
    try {
        const { parentId } = req.params;
        const parent = await Parent.findOne({ userId: parentId }).populate('userId', 'username email profilePhoto phone address pincode');

        if (!parent) return res.status(404).json({ message: "Parent not found" });

        res.status(200).json({ success: true, parent });
    } catch (error) {
        console.error("Error fetching parent profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET ALL PARENTS (FILTER BY PREFERENCES)
const getAllParents = async (req, res) => {
    try {
        const { subject, language, tutorGender } = req.query;
        let filters = {};

        if (subject) filters['preferences.subjects'] = subject;
        if (language) filters['preferences.languagePreference'] = language;
        if (tutorGender) filters['preferences.tutorGender'] = tutorGender;

        const parents = await Parent.find(filters).populate('userId', 'username email');

        res.status(200).json({ success: true, parents });
    } catch (error) {
        console.error("Error fetching parents:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE PARENT PROFILE
const deleteParentProfile = async (req, res) => {
    try {
        const userId = req.user;
        const parent = await Parent.findOneAndDelete({ userId });

        if (!parent) return res.status(404).json({ message: "Parent profile not found" });

        res.status(200).json({ success: true, message: "Parent profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting parent profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createOrUpdateParentProfile, getParentProfile, getAllParents, deleteParentProfile };
