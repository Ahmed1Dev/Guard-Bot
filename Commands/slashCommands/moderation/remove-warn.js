const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, BitField } = require('discord.js');
const ms = require(`ms`);
const humanizeDuration = require('humanize-duration');
const Model = require('../../../Models/Warn');

module.exports = {
    name: 'remove-warn',
    description: "Remove a warn from member.",
    options: [
        {
            name: 'warn_id',
            description: 'ID of the warn',
            type: 3,
            required: true
        }
    ],
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    userPerms: ['ManageMessages'],
    botPerms: ['ManageMessages'],
    run: async (client, interaction) => {
        const id = interaction.options.getString('warn_id');
        const warn = await Model.findOneAndDelete({ warnId: id, guildId: interaction.guild.id });
        if (!warn) return interaction.reply({ content: client.language.noWarnID });
        await interaction.reply({ content: client.language.warnRemoved.replace('[WarnID]', id) });
    }
};

