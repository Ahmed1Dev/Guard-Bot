const mongoose = require(`mongoose`);

const Schema = new mongoose.Schema({
    userId: { type: String },
    Coins: { type: Number, default: 0 },
    Title: { type: String, default: ' ' },
    Reps: { type: Number, default: 0 },
    Blacklisted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Users', Schema)