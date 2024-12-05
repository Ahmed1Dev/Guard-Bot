const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
	name: 'user',
	description: "Display information about yourself or another user.",
	type: ApplicationCommandType.ChatInput,
    options: [
		{
			name: 'user',
			description: 'Select a user.',
			type: 6,
		},
	],
	cooldown: 3000,
	run: async (client, interaction) => {
		
        const user = interaction.options.getMember('user') || interaction.member;
		const row1 = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
			  .setStyle('Link')
			  .setURL(`https://discord.com/users/${user.user.id}`)
			  .setEmoji('1171803940338274345')
			  .setLabel('Link'))
		const embed = new EmbedBuilder()
		.setAuthor({ name: `${user.user.username} Information's`, url: `https://discord.com/users/${user.user.id}` })
        .addFields({ name: "**Joined Discord :**", value: `** <t:${parseInt(user.user.createdAt / 1000)}:R> **`, inline: true })
        .addFields({ name: "**Joined Server :**", value: `** <t:${parseInt(user.joinedAt / 1000)}:R> **`, inline: true })
        .setThumbnail(user.user.avatarURL({ dynamic: true }))
		interaction.reply({ embeds: [embed], components: [row1] });

	}
};