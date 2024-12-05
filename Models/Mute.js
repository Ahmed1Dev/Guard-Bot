const mongoose = require(`mongoose`);

const Schema = new mongoose.Schema({
    guildId: String,
    Users: Array
});

module.exports = mongoose.model('Mute', Schema)