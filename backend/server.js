const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const labReportsRoutes = require('./routes/labReports');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use('/reports', express.static(path.join(__dirname, 'public/reports')));

app.get('/', (req, res) => {
  res.json({
    message: 'Oasis Healthcare backend is running',
    endpoints: [
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/me',
      '/api/appointments',
      '/api/appointments/my',
      '/api/lab-reports/check',
      '/api/lab-reports/seed-demo'
    ]
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/lab-reports', labReportsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
