const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    option: String,
    votes: Number,
});

module.exports = mongoose.model('Poll', pollSchema);
