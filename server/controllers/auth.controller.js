import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const login = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin || pin.length < 4 || pin.length > 6) {
      return res.status(400).json({ message: 'Invalid PIN format. Must be 4-6 digits.' });
    }

    // For first-time setup, create a user with default PIN
    let user = await User.findOne().select('+pin');

    if (!user) {
      if (!process.env.DEFAULT_PIN) {
        return res.status(500).json({ message: 'System not properly configured' });
      }

      if (pin === process.env.DEFAULT_PIN) {
        user = await User.create({ pin });
      } else {
        return res.status(401).json({ message: 'Invalid PIN' });
      }
    }

    const isValid = await user.comparePin(pin);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid PIN' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({ 
      token,
      user: {
        _id: user._id,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

export const changePin = async (req, res) => {
  try {
    const { currentPin, newPin } = req.body;

    if (!newPin || newPin.length < 4 || newPin.length > 6) {
      return res.status(400).json({ message: 'New PIN must be 4-6 digits' });
    }

    const user = await User.findById(req.user._id).select('+pin');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValid = await user.comparePin(currentPin);
    if (!isValid) {
      return res.status(401).json({ message: 'Current PIN is incorrect' });
    }

    user.pin = newPin;
    await user.save();

    res.json({ message: 'PIN updated successfully' });
  } catch (error) {
    console.error('Change PIN error:', error);
    res.status(500).json({ message: 'Failed to change PIN. Please try again.' });
  }
};

export const validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ valid: false });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.json({ valid: false });
    }

    res.json({ 
      valid: true,
      user: {
        _id: user._id,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.json({ valid: false });
  }
};