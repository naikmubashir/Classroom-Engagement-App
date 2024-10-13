const express = require('express');
const Poll = require('../models/Poll');
const router = express.Router();

// Get all polls
router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find();
       // console.log("typeeeeee"+polls);
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching polls' });
    }
});

module.exports = router;
