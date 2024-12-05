const { Schema, model } = require('mongoose');


const Warn = new Schema({
    userId: String,
    guildId: String,
    moderatorId: String,
    reason: String,
    timestamp: String,
});

module.exports = model('WarnDB', Warn);
