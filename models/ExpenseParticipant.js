const mongoose = require('mongoose');

const expenseParticipantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true },
  amountOwed: { type: Number, required: true },
  percentage: { type: Number }  // Only for percentage split
}, { timestamps: true });

module.exports = mongoose.model('ExpenseParticipant', expenseParticipantSchema);
