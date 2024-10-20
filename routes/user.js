const express = require('express');
const { registerUser, loginUser, getUserDetails } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:userId', authMiddleware, getUserDetails);

module.exports = router;
