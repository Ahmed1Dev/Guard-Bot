const { ApplicationCommandType, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	name: 'avatar',
	description: "Display your avatar or another user avatar",
	type: ApplicationCommandType.ChatInput,
    options: [
		{
			name: 'user',
			description: 'User to get avatar',
			type: 6,
		},
		{
			name: 'server_avatar',
			description: 'Get member avatar in this server',
			type: 5,
		},
	],
	cooldown: 3000,
	run: async (client, interaction) => {
		
        const member = interaction.options.getMember('user') || interaction.member;

		const Sv = new ButtonBuilder()
		.setLabel(`Server Avatar`)
		.setStyle(2)
		.setCustomId(`server_avatar_${interaction.user.id}`);

		const Row = new ActionRowBuilder().addComponents(Sv);
		const isMemberAvatar = interaction.options.getBoolean('server_avatar');
		if (isMemberAvatar) {
			if (!member.avatar) {
				return interaction.reply({
					content: ":x: This user don't has avatar in this server",
					ephemeral: true,
				});
			}
			const embed = new EmbedBuilder()
				.setAuthor({ name: member.user.tag, iconURL: member.avatarURL({ dynamic: true }) })
				.setDescription(`[Avatar Link](${member.avatarURL({ dynamic: true, size: 4096 })})`)
				.setImage(member.avatarURL({ dynamic: true, size: 4096 }))
				.setFooter({
					text: `Requested By ${interaction.user.tag}`,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true })
				})
			return interaction.reply({ embeds: [embed], components: [Row] });
		}
		const embed = new EmbedBuilder()
			.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
			.setDescription(`[Avatar Link](${member.user.displayAvatarURL({ dynamic: true, size: 4096 })})`)
			.setImage(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: `Requested By ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true })
			})
		interaction.reply({ embeds: [embed], components: [Row] });


	}
};