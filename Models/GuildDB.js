const mongoose = require(`mongoose`);

const Schema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    Blacklisted: { type: Boolean, default: false },
    activatedBy: { type: String, required: false },
    activatedAt: { type: Date, default: Date.now },
    expireAt: { type: Date, required: false },
    Lang: { type: String, default: "en" },
    events: { type: [String], default: [] }
});

module.exports = mongoose.model('Guild', Schema)