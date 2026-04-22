const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, email, service, date, time, notes } = req.body;

    if (!name || !phone || !service || !date || !time) {
      return res.status(400).json({ message: 'Name, phone, service, date and time are required' });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const appointment = await Appointment.create({
      userId: user._id,
      name: name.trim(),
      phone: phone.trim(),
      email: (email || user.email || '').trim().toLowerCase(),
      service: service.trim(),
      date,
      time,
      notes: (notes || '').trim(),
      status: 'Booked'
    });

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not save appointment' });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select('service date time notes status createdAt');

    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch appointment history' });
  }
});

module.exports = router;
