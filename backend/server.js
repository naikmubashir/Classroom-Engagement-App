const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const feedbackRoutes = require('./routes/feedbackRoutes');
const http = require('http');
const { Server } = require('socket.io');

const app = express(); // Move this before creating server
const server = http.createServer(app); // Create server using app
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/feedback', feedbackRoutes);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('submit-poll', (pollData) => {
        io.emit('update-poll', pollData); // Broadcast to all connected users
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
    }).catch(err => console.error('MongoDB connection error:', err));

server.listen(PORT, () => { // Use server.listen instead of app.listen
    console.log(`Server is running on http://localhost:${PORT}`);
});
