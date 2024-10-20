const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  splitType: { type: String, enum: ['equal', 'exact', 'percentage'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
