const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, BitField } = require('discord.js');
const ms = require(`ms`);
const humanizeDuration = require('humanize-duration');

module.exports = {
	name: 'unlock',
	description: "🔓 Remove denied sending messages from @everyone in specific channel.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    userPerms: ['ManageChannels'],
	botPerms: ['ManageChannels'],
	options: [
		{
			name: 'channel',
			description: 'Select the channel to Unlock.',
			type: 7,
			required: false,
		},
	],
	run: async (client, interaction) => {
		const channel = interaction.options.getChannel('channel') || interaction.channel;
        const everyone = interaction.guild.roles.cache.find(role => role.name === '@everyone');

        switch (true) {
            case !everyone:
                return interaction.reply({ content: client.language.roleNotFound, ephemeral: true });
            case !channel.permissionsFor(everyone).has(PermissionFlagsBits.SendMessages):
                return interaction.reply({ content: client.language.alreadyUnlocked, ephemeral: true });
            default:
                await channel.permissionOverwrites.edit(everyone, {
                    SendMessages: true
                });
                interaction.reply({ content: client.language.unlock.replace("[channel]", channel.name) });
        }
	}
};

