const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: 'invite',
	description: "Get the bot's invite link",
	cooldown: 3000,
	userPerms: ['SendMessages'],
	botPerms: ['SendMessages'],
	run: async (client, message, args) => {
		const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`;
		const actionRow = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
			.setLabel('Invite')
			.setURL(inviteUrl)
			.setStyle(5)
		])
		message.reply({ content:`🔗 **You can Invite the bot to your server By Click on** [here](${inviteUrl}).`, components: [actionRow] })
	}
};
