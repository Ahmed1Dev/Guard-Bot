const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'ping',
	description: "Check bot's ping.",
	aliases: "بنج",
	cooldown: 3000,
	userPerms: [],
	botPerms: [],
	premium: false,
	run: async (client, message, args) => {
		const msg = await message.reply(':ping_pong: Pong!')
		const embed = new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setColor('Blue')
        .setTimestamp()
        .setDescription(`**Time:** ${Math.floor(msg.createdTimestamp - message.createdTimestamp)} ms\n**API Ping:** ${client.ws.ping} ms`)
		await msg.edit({embeds: [embed]})
	}
};