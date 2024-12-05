const mongoose = require('mongoose');

const KeySchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
    createdBy: { type: String, required: true }, // User who created the key
    assignedTo: { type: String, default: null }, // User ID who used the key
    expireAt: { type: Date, required: true },
});

module.exports = mongoose.model('PremiumKey', KeySchema);
