const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits } = require('discord.js');
const Model = require('../../../Models/GuildDB')

module.exports = {
	name: 'blacklist-remove',
	description: "Unblacklist a server",
	cooldown: 3000,
	userPerms: ['SendMessages'],
	botPerms: ['SendMessages'],
	run: async (client, message, args) => {
		if(message.author.id !== '813484592123609088') return;
		const id = args[0];
		if(!id) return message.reply('Please specify a guild id!');
		const guildData = await Model.findOne({ guildId: id });

		if(!guildData) return message.reply(`The server not registered in database`);

		guildData.Blacklisted === false;
		message.reply(`Server has been unblacklisted`)
		
	}
};

