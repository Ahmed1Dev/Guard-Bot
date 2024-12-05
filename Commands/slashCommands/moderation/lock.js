const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, BitField } = require('discord.js');
const ms = require(`ms`);
const humanizeDuration = require('humanize-duration');

module.exports = {
	name: 'lock',
	description: "🔒 Disables @everyone from sending messages in specific channel.",
    options: [
        {
            name: 'channel',
            description: 'Select the channel to lock.',
            type: 7,
            required: false,
        },
        {
            name: 'bulk',
            description: 'Lock all channels.',
            type: 5,
            required: false,
        },
    ],
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    userPerms: ['ManageChannels'],
	botPerms: ['ManageChannels'],
	run: async (client, interaction) => {
        const channel = interaction.options.getChannel('channel');
        const bulk = interaction.options.getBoolean('bulk');

        if (bulk) {
            await interaction.guild.channels.cache.forEach(channel => {
                const everyone = interaction.guild.roles.cache.find(role => role.name === '@everyone');
                const overwrite = channel.permissionOverwrites.cache.get(everyone.id);
                if (overwrite && !overwrite.allow.has(PermissionFlagsBits.SendMessages)) return;
                channel.permissionOverwrites.edit(everyone, {
                    SendMessages: false
                });
            });
            interaction.reply({ content: client.language.bulkLock });
            return;
        }

        if (!channel) channel = interaction.channel;

        const everyone = interaction.guild.roles.cache.find(role => role.name === '@everyone');
        const overwrite = channel.permissionOverwrites.cache.get(everyone.id);

        if (overwrite) {
            switch (true) {
                case overwrite.allow.has(PermissionFlagsBits.SendMessages):
                    return interaction.reply({ content: client.language.alreadyLocked, ephemeral: true });
                default:
                    await channel.permissionOverwrites.edit(everyone, {
                        SendMessages: false
                    });
                    interaction.reply({ content: client.language.lock.replace("[channel]", `<#${channel.id}>`) });
            }
        }
	}
};


