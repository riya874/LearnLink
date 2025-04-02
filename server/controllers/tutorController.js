const Tutor = require('../models/Tutor');
const User = require('../models/User');
const Session = require('../models/Session');
const Review = require("../models/Review")

// CREATE OR UPDATE TUTOR PROFILE
const createOrUpdateTutorProfile = async (req, res) => {
    try {
        const userId = req.user; // Authenticated user
        const { qualifications, subjects, grades, experience, languages, gender, teachingMethodology, availability, certifications } = req.body;

        let tutor = await Tutor.findOne({ userId });

        if (tutor) {
            // Update existing tutor profile
            tutor = await Tutor.findOneAndUpdate(
                { userId },
                { $set: { qualifications, subjects, grades, experience, languages, gender, teachingMethodology, availability, certifications } },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ success: true, message: "Tutor profile updated successfully", tutor });
        } else {
            // Create new tutor profile
            const newTutor = new Tutor({
                userId,
                qualifications,
                subjects,
                grades,
                experience,
                languages,
                gender,
                teachingMethodology,
                availability,
                certifications
            });
            await newTutor.save();
            return res.status(201).json({ success: true, message: "Tutor profile created successfully", tutor: newTutor });
        }
    } catch (error) {
        console.error("Error creating/updating tutor profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET A SINGLE TUTOR PROFILE
const getTutorProfile = async (req, res) => {
    try {
        const { tutorId } = req.params; // This is actually the userId

        // Find the tutor using userId instead of _id
        const tutor = await Tutor.findOne({ userId: tutorId })
            .populate('userId', 'username email profilePhoto phone address pincode')

        if (!tutor) return res.status(404).json({ message: "Tutor not found" });

        res.status(200).json({ success: true, tutor });
    } catch (error) {
        console.error("Error fetching tutor profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// const getAllTutors = async (req, res) => {
//     try {
//         const { subject, grade, language, address } = req.query;
//         let filters = {};

//         // Subject filter
//         if (subject && typeof subject === 'string') {
//             filters.subjects = { $regex: subject, $options: "i" };
//         }
        
//         // Grade filter
//         if (grade) {
//             filters.grades = Array.isArray(grade) ? { $in: grade } : grade;
//         }

//         // Language filter
//         if (language && typeof language === 'string') {
//             filters.languages = { $regex: language, $options: "i" };
//         }

//         // ✅ Address search - Corrected field naming
//         if (address && typeof address === 'string') {
//             const addressRegex = { $regex: address, $options: 'i' };

//             // Apply OR condition for address and pincode
//             filters.$or = [
//                 { 'userId.address': addressRegex },
//                 { 'userId.pincode': addressRegex }
//             ];
//         }

//         // Fetch tutors with the corrected filter
//         const tutors = await Tutor.find(filters)
//             .populate({
//                 path: 'userId',
//                 select: 'username email profilePhoto phone address pincode'
//             })
//             .lean();

//         // Filter out tutors where `userId` isn't populated
//         const validTutors = tutors.filter(tutor => tutor.userId);

//         res.status(200).json({ tutors: validTutors });
//     } catch (error) {
//         console.error("Error fetching tutors:", error);
//         res.status(500).json({ error: "Failed to fetch tutors. Please try again later." });
//     }
// };

const getAllTutors = async (req, res) => {
    try {
        const { subject, grade, language, address } = req.query;
        let filters = {};

        if (subject) filters.subjects = { $regex: subject, $options: "i" };
        if (grade) filters.grades = Array.isArray(grade) ? { $in: grade } : grade;
        if (language) filters.languages = { $regex: language, $options: "i" };

        // Fetch tutors first and then filter by address
        let tutors = await Tutor.find(filters).populate("userId", "username email profilePhoto phone address pincode");

        if (address) {
            const addressRegex = new RegExp(address, "i");
            tutors = tutors.filter(tutor => tutor.userId && (addressRegex.test(tutor.userId.address) || addressRegex.test(tutor.userId.pincode)));
        }

        res.status(200).json({ tutors });
    } catch (error) {
        console.error("Error fetching tutors:", error);
        res.status(500).json({ error: "Failed to fetch tutors. Please try again later." });
    }
};


 // GET AVAILABLE TUTOR PROFILE
const getAvailableTutors = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: "Date is required" });

        // Ensure `date` is a string in "YYYY-MM-DD" format to match stored `day`
        const formattedDate = new Date(date).toISOString().split("T")[0];
        let tutors = await Tutor.find({
            "availability.day": formattedDate
        }).populate("userId", "username profilePhoto");
        // Fetch booked sessions on this date
        const bookedSessions = await Session.find({ date: formattedDate, status: "Booked" });

        // Remove tutors who have all slots booked
        tutors = tutors.filter(tutor => {
            const tutorAvailability = tutor.availability.find(avail => avail.day === formattedDate);
            const tutorSessions = bookedSessions.filter(session => session.tutorId.toString() === tutor._id.toString());

            // If timeSlots is empty, assume unlimited availability
            return tutorAvailability && (tutorAvailability.timeSlots.length === 0 || tutorSessions.length < tutorAvailability.timeSlots.length);
        });
        res.status(200).json({ success: true, tutors });
    } catch (error) {
        console.error("Error fetching available tutors:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// DELETE TUTOR PROFILE
const deleteTutorProfile = async (req, res) => {
    try {
        const userId = req.user;
        const tutor = await Tutor.findOneAndDelete({ userId });

        if (!tutor) return res.status(404).json({ message: "Tutor profile not found" });

        res.status(200).json({ success: true, message: "Tutor profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting tutor profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const addReview = async (req, res) => {
    const { tutorId, parentId } = req.body;
    const { rating, comment } = req.body;

    try {
        // Check if tutor exists
        const tutor = await Tutor.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        // Create a new review
        const newReview = new Review({
            parentId,
            tutorId,
            rating,
            comment
        });

        // Save the review
        await newReview.save();

        // Push the review reference to the tutor
        tutor.reviews.push(newReview._id);
        await tutor.save();

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Like a tutor's profile
const addLike = async (req, res) => {
    const { tutorId } = req.params;
    const parentId = req.body; // Assuming the parentId is sent in the request body

    try {
        // Check if tutor exists
        const tutor = await Tutor.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        // Check if the parent has already liked the tutor
        if (tutor.likes.includes(parentId)) {
            return res.status(400).json({ message: 'You already liked this tutor' });
        }

        // Add the parent to the likes array
        tutor.likes.push(parentId);
        await tutor.save();

        res.status(200).json({ message: 'Tutor liked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// GET A TUTOR'S REVIEWS
const getReviews = async (req, res) => {
    const { tutorId } = req.params;

    try {
        const reviews = await Review.find({ tutorId })
            .populate({
                path: 'parentId',
                populate: {
                    path: 'userId',
                    select: 'username profilePhoto'
                }
            });

        res.status(200).json({ reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        
        // Assuming you're using Mongoose
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error });
    }
};
module.exports = { createOrUpdateTutorProfile, getTutorProfile, getAllTutors, getAvailableTutors, deleteTutorProfile, addReview, addLike, getReviews,deleteReview };
