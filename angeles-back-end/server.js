const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');

const userRoutes = require('./src/routes/userRoutes');

dotenv.config();

const app = express();

// Connect to database
connectDB();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://angeles-frontend.onrender.com'
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running....');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});