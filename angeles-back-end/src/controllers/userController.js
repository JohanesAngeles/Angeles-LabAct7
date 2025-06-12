const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email or username
  const user = await User.findOne({ 
    $or: [{ email }, { username: email }] 
  });

  if (user && (await user.matchPassword(password))) {
    // Update last login
    await user.updateLastLogin();
    
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      age: user.age,
      gender: user.gender,
      mobile: user.mobile,
      address: user.address,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { 
    firstName, 
    lastName, 
    age, 
    gender, 
    mobile, 
    address, 
    username, 
    email, 
    password, 
    role 
  } = req.body;

  // Check if user already exists by email
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Check if username already exists
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(400);
    throw new Error('Username already taken. Please choose a different username.');
  }

  try {
    // Create new user with all fields
    const user = await User.create({
      firstName,
      lastName,
      age,
      gender,
      mobile,
      address,
      username,
      email,
      password,
      role: role || 'user',
    });

    if (user) {
      // Update last login for new user
      await user.updateLastLogin();
      
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        age: user.age,
        gender: user.gender,
        mobile: user.mobile,
        address: user.address,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(400);
    if (error.name === 'ValidationError') {
      // Handle validation errors specifically
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    } else {
      throw new Error('Failed to create user. Please check your input data.');
    }
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 });

  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Update all possible fields
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.age = req.body.age !== undefined ? req.body.age : user.age;
    user.gender = req.body.gender || user.gender;
    user.mobile = req.body.mobile !== undefined ? req.body.mobile : user.mobile;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    
    // Only update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      fullName: updatedUser.fullName,
      age: updatedUser.age,
      gender: updatedUser.gender,
      mobile: updatedUser.mobile,
      address: updatedUser.address,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      lastLogin: updatedUser.lastLogin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};