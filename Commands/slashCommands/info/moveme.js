const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'moveme',
	description: "Move yourself to another voice channel.",
	type: ApplicationCommandType.ChatInput,
    options: [
		{
			name: 'channel',
			description: 'select the channel to move in',
			type: 7,
			required: true,
			channel_types: [2],
		},
	],
	cooldown: 3000,
	run: async (client, interaction) => {
		
        const target = interaction.options.getChannel('channel');
		if (!interaction.member.voice.channel) {
			return interaction.reply({ content: ':x: You need to be in voice channel', ephemeral: true });
		}
		if (interaction.member.voice.channel.id === target.id) {
			return interaction.reply({ content: `:x: You are already in ${target.name} channel`, ephemeral: true });
		}
		await interaction.member.voice.setChannel(target, `By Moveme command`);
		interaction.reply({ content: `✅ **${interaction.user.username} has been Moved to ${target.name} **` });

	}
};