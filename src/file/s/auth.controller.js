import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const login = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ message: 'PIN is required' });
    }

    // For first-time setup, create a user with default PIN
    let user = await User.findOne().select('+pin');
    
    if (!user) {
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
    res.json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const changePin = async (req, res) => {
  try {
    const { currentPin, newPin } = req.body;
    const user = await User.findById(req.user._id).select('+pin');

    const isValid = await user.comparePin(currentPin);
    if (!isValid) {
      return res.status(401).json({ message: 'Current PIN is incorrect' });
    }

    user.pin = newPin;
    await user.save();

    res.json({ message: 'PIN updated successfully' });
  } catch (error) {
    console.error('Change PIN error:', error);
    res.status(500).json({ message: 'Failed to change PIN' });
  }
};

export const validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ valid: false });
    }

    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch (error) {
    res.json({ valid: false });
  }
};