const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const { errorMiddleware } = require('./middlewares/errorMiddleware');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
