const Session = require('../models/Session')
const Tutor = require('../models/Tutor')
const Parent = require('../models/Parent')
const User = require('../models/User')

const getAllSessionsForTutor = async (req, res) => {
    try {
        const { tutorId, date } = req.query;

        if (!tutorId || !date) {
            return res.status(400).json({ message: "Tutor ID and date are required" });
        }

        const sessions = await Session.find({ tutorId, date, status: "Booked" });

        res.status(200).json({ success: true, sessions });
    } catch (error) {
        console.error("Error fetching all sessions for tutor:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getSessionsByParent = async (req, res) => {
    try {
        const { parentId } = req.params;

        if (!parentId) {
            return res.status(400).json({ message: "Parent ID is required" });
        }

        const sessions = await Session.find({ parentId }).populate({
            path: "tutorId",
            populate: {
                path: "userId", // Populate user details from User model
                select: "username profilePhoto", // Fetch only username & profilePhoto
            },
        });
        res.status(200).json({ success: true, sessions });
    } catch (error) {
        console.error("Error fetching sessions for parent:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getSessionsByTutor = async (req, res) => {
    try {
        const { tutorId } = req.params;

        if (!tutorId) {
            return res.status(400).json({ message: "Tutor ID is required" });
        }

        // Fetch sessions
        const sessions = await Session.find({ tutorId });

        // Fetch Parent and User details manually
        const sessionsWithDetails = await Promise.all(
            sessions.map(async (session) => {
                if (!session.parentId) {
                    return { ...session.toObject(), parentDetails: null };
                }

                const parent = await Parent.findById(session.parentId);
                if (!parent || !parent.userId) {
                    return { ...session.toObject(), parentDetails: null };
                }
                const user = await User.findById(parent.userId).select("username profilePhoto");
                return {
                    ...session.toObject(),
                    parentDetails: user
                        ? { _id: parent._id, user }
                        : { _id: parent._id, user: null }
                };
            })
        );
        res.status(200).json({ success: true, sessions: sessionsWithDetails });
    } catch (error) {
        console.error("Error fetching sessions for tutor:", error);
        res.status(500).json({ message: "Server error" });
    }
};



const bookSession = async (req, res) => {
    try {
        const { tutorId, parentId, childName, subject, date, time } = req.body;
        if (!tutorId || !parentId || !date || !time) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the time slot is already booked
        const existingSession = await Session.findOne({ tutorId, date, time, status: "Booked" });
        if (existingSession) {
            return res.status(400).json({ message: "Time slot already booked" });
        }

        // Create new session
        const session = new Session({ tutorId, parentId, childName, subject, date, time });
        await session.save();

        res.status(201).json({ success: true, message: "Session booked successfully", session });
    } catch (error) {
        console.error("Error booking session:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const cancelSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await Session.findByIdAndUpdate(sessionId, { status: "Cancelled" }, { new: true });

        if (!session) return res.status(404).json({ message: "Session not found" });

        res.status(200).json({ success: true, message: "Session cancelled", session });
    } catch (error) {
        console.error("Error cancelling session:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const rescheduleSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { newDate, newTime } = req.body;

        const session = await Session.findByIdAndUpdate(sessionId, { date: newDate, time: newTime }, { new: true });

        if (!session) return res.status(404).json({ message: "Session not found" });

        res.status(200).json({ success: true, message: "Session rescheduled", session });
    } catch (error) {
        console.error("Error rescheduling session:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { rescheduleSession, cancelSession, bookSession, getSessionsByParent, getSessionsByTutor, getAllSessionsForTutor };