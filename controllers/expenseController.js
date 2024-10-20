const Expense = require('../models/Expense');
const ExpenseParticipant = require('../models/ExpenseParticipant');
const { validatePercentage } = require('../utils/validateInput');

// Add Expense
exports.addExpense = async (req, res) => {
  try {
    const { description, totalAmount, paidBy, participants, splitType } = req.body;

    if (splitType === 'percentage' && !validatePercentage(participants)) {
      return res.status(400).json({ message: 'Invalid percentage split' });
    }

    const expense = new Expense({ description, totalAmount, paidBy, splitType });
    await expense.save();

    let splitAmounts = [];
    switch (splitType) {
      case 'equal':
        const equalShare = totalAmount / participants.length;
        splitAmounts = participants.map(p => ({ userId: p.userId, amountOwed: equalShare }));
        break;
      case 'exact':
        splitAmounts = participants.map(p => ({ userId: p.userId, amountOwed: p.amount }));
        break;
      case 'percentage':
        splitAmounts = participants.map(p => ({
          userId: p.userId,
          amountOwed: (p.percentage / 100) * totalAmount,
          percentage: p.percentage
        }));
        break;
    }

    const expenseParticipants = splitAmounts.map(({ userId, amountOwed, percentage }) => ({
      user: userId,
      expense: expense._id,
      amountOwed,
      percentage: percentage || null,
    }));
    
    await ExpenseParticipant.insertMany(expenseParticipants);
    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve Overall Expenses
exports.getOverallExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('participants.user');
    const overallExpenses = expenses.map(exp => ({
      description: exp.description,
      totalAmount: exp.totalAmount,
      splitType: exp.splitType,
      participants: exp.participants.map(p => ({
        userId: p.user._id,
        amountOwed: p.amountOwed,
        percentage: p.percentage || null,
      }))
    }));

    res.json(overallExpenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Download Balance Sheet (CSV)
exports.downloadBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('participants.user');
    
    const balanceSheet = expenses.map(exp => ({
      description: exp.description,
      totalAmount: exp.totalAmount,
      splitType: exp.splitType,
      participants: exp.participants.map(p => ({
        userId: p.user._id,
        amountOwed: p.amountOwed,
        percentage: p.percentage || null,
      }))
    }));

    // CSV conversion logic here
    // Placeholder to return JSON
    res.json(balanceSheet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
