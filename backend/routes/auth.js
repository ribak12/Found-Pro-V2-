const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

function makeToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email
  };
}

router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, pin } = req.body;

    if (!name || !phone || !email || !pin) {
      return res.status(400).json({ message: 'Name, phone, email and PIN are required' });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }

    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be exactly 4 digits' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'Account already exists with this email. Please login.' });
    }

    const pinHash = await bcrypt.hash(pin, 10);

    const user = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      pinHash
    });

    const token = makeToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ message: 'Email and PIN are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or PIN' });
    }

    const isMatch = await bcrypt.compare(pin, user.pinHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or PIN' });
    }

    const token = makeToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not login' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch profile' });
  }
});

router.put('/me', auth, async (req, res) => {
  try {
    const { name, phone, email, pin } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!name || !phone || !email) {
      return res.status(400).json({ message: 'Name, phone and email are required' });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: user._id } });
    if (existingEmail) {
      return res.status(409).json({ message: 'Another account already uses this email' });
    }

    user.name = name.trim();
    user.phone = phone.trim();
    user.email = email.toLowerCase().trim();

    if (pin) {
      if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({ message: 'PIN must be exactly 4 digits' });
      }
      user.pinHash = await bcrypt.hash(pin, 10);
    }

    await user.save();
    const token = makeToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not update profile' });
  }
});

module.exports = router;
