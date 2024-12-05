const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits } = require('discord.js');
const Model = require('../../../Models/GuildDB')

module.exports = {
	name: 'blacklist-add',
	description: "Give a server blacklist",
	cooldown: 3000,
	userPerms: ['SendMessages'],
	botPerms: ['SendMessages'],
	run: async (client, message, args) => {
		if(message.author.id !== '813484592123609088') return;
        const id = args[0];
        const guildData = await Model.findOne({ guildId: id });

        if(!id) return message.reply('Where the ID of the server');
        

        if(!guildData) return message.reply(`The server not registerd in database`);

        guildData.Blacklisted = true;
        message.reply(`The Server has been blacklisted.`);
       
	}
};
