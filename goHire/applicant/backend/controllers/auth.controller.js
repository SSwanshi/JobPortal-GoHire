const User = require('../models/user');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  const { firstName, lastName, email, phone, gender, password, confirmPassword } = req.body;

  try {
    if (!firstName || !lastName || !email || !phone || !gender || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      gender,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: 'Signup successful! Please login.',
      success: true
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    req.session.user = {
      id: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      authenticated: true
    };

    await req.session.save();
    
    res.status(200).json({
      message: 'Login successful!',
      success: true,
      user: {
        id: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error. Please try again.' 
    });
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful', success: true });
  });
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.user?.authenticated) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findOne({ userId: req.session.user.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser
};

