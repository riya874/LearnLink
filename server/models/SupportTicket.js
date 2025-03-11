const mongoose = require('mongoose')
const SupportTicketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issueType: { type: String, enum: ['Technical', 'Account', 'Other'], required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Resolved', 'Closed'], default: 'Open' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
