const mongoose = require('mongoose');

const ProtectionSettingsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    protections: {
        type: Object,
        default: {}, // يجب أن يكون كائنًا لتخزين إعدادات الحماية.
    },
});

module.exports = mongoose.model('ProtectionSettings', ProtectionSettingsSchema);
