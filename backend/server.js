const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const feedbackRoutes = require('./routes/feedbackRoutes');
const http = require('http');
const { Server } = require('socket.io');
const Poll = require('./models/Poll');
const pollRoutes = require('./routes/pollRoutes');

const openaiRoutes=require('./routes/openaiRoutes')

//const userRoutes = require('./routes/userRoutes');




const app = express(); 
const server = http.createServer(app); // Create server using app

const PORT = process.env.PORT || 8000;

app.use(cors());
// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend's origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Optional: if you need to include cookies in requests
}));
app.use(bodyParser.json());
 //app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/openai', openaiRoutes)


const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow your frontend's origin for Socket.io
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true // Optional
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('submit-poll', async (pollData) => {
        // Save to MongoDB
        const existingPoll = await Poll.findOne({ option: pollData.option });
        if (existingPoll) {
            existingPoll.votes += 1; // Increment vote count
            await existingPoll.save();
        } else {
            const newPoll = new Poll({ option: pollData.option, votes: 1 });
            await newPoll.save();
        }

        const polls = await Poll.find(); // Fetch all polls after update
        io.emit('update-poll', polls); // Broadcast updated polls
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

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
