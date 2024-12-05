const { ButtonBuilder } = require('discord.js')

function createButton({style, label, customId, disabled, emoji, url}) {
    return new ButtonBuilder()
        .setStyle(style)
        .setCustomId(customId)
        .setLabel(label)
        .setDisabled(disabled)
        .setEmoji(emoji)
        .setURL(url)
}