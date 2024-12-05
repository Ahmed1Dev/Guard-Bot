const { SelectMenuBuilder } = require('discord.js');

function createMenu({ setCustomId, setPlaceholder, setDisabled, setMaxValues, setMinValues, addOptions }) {
    return new SelectMenuBuilder()
    .setCustomId(setCustomId)
    .setPlaceholder(setPlaceholder)
    .setDisabled(setDisabled)
    .setMaxValues(setMaxValues)
    .setMinValues(setMinValues)
    .addOptions(addOptions)
}