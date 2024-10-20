const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const user = new User({ name, email, password, mobile });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

// Retrieve User
exports.getUserDetails = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};
