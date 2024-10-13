// backend/routes/feedbackRoutes.js
const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

// Route to submit feedback
router.post('/submit', async (req, res) => {
    try {
        const { studentName, feedbackText, rating } = req.body;
        const feedback = new Feedback({ studentName, feedbackText, rating });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get all feedback
router.get('/', async (req, res) => {
    try {
        const feedback = await Feedback.find();
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
