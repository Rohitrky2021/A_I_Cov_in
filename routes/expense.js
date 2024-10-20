const express = require('express');
const { addExpense, getOverallExpenses, downloadBalanceSheet } = require('../controllers/expenseController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addExpense);
router.get('/overall', authMiddleware, getOverallExpenses);
router.get('/balance_sheet', authMiddleware, downloadBalanceSheet);

module.exports = router;
