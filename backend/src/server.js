const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const transferRoutes = require('./routes/transferRoutes');

app.use(cors());
app.use(express.json());

// Set io instance in app to access it in controllers
app.set('io', io);

// Routes
app.use('/api/transfer', transferRoutes);

app.get('/', (req, res) => {
  res.send('Monster-mongo API is running');
});

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// Connect to Local MongoDB for logging (optional, but recommended)
const MONGODB_URI = process.env.LOG_DB_URI || 'mongodb://localhost:27017/monster-mongo-logs';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to logging database');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to logging database:', err);
    // Even if logging DB fails, we might want to run the server for transfers
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without logging DB)`);
    });
  });

// Export io for use in controllers/services
module.exports = { app, io };
