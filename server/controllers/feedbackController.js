const Feedback = require('../models/Feedback');

// Submit feedback (by Parent or Tutor)
exports.submitFeedback = async (req, res) => {
    const { parentId, tutorId, feedback, rating } = req.body;

    if ((!parentId && !tutorId) || !feedback || !rating) {
        return res.status(400).json({ error: "All fields are required. Either parentId or tutorId must be provided." });
    }

    try {
        const newFeedback = new Feedback({
            parentId: parentId || null,
            tutorId: tutorId || null,
            feedback,
            rating
        });

        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to submit feedback" });
    }
};

// Get all feedback (admin view)
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate({
                path: 'parentId',
                populate: {
                    path: 'userId',
                    select: 'username profilePhoto email'
                }
            })
            .populate({
                path: 'tutorId',
                populate: {
                    path: 'userId',
                    select: 'username profilePhoto email'
                }
            })
            .exec();
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch feedback" });
    }
};

// Get feedback by Parent or Tutor ID
exports.getFeedbackByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const feedbacks = await Feedback.find({
            $or: [{ parentId: userId }, { tutorId: userId }]
        })
            .populate({
                path: 'parentId',
                populate: {
                    path: 'userId',
                    select: 'username profilePhoto email'
                }
            })
            .populate({
                path: 'tutorId',
                populate: {
                    path: 'userId',
                    select: 'username profilePhoto email'
                }
            })
            .exec();

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch feedback" });
    }
};
