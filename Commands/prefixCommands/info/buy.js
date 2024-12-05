const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle } = require('discord.js');
const premium_api = `ZDov3MX26IzO3HEHLsN3zM3FgFoSyCKpMexs62hSAXA`;
const patreon_api = `ZDov3MX26IzO3HEHLsN3zM3FgFoSyCKpMexs62hSAXA`;

module.exports = {
	name: 'buy',
	description: "Buy a premium",
	cooldown: 3000,
	userPerms: ['SendMessages'],
	botPerms: ['SendMessages'],
	run: async (client, message, args) => {
		const premium_link = `https://www.patreon.com/bePatron?u=16589138`;

		const embed = new EmbedBuilder()
			.setTitle('Premium')
			.setDescription(`To buy our premium, please click the button below.\n\n[Premium Link](${premium_link})`)
			.setColor('Green');
		const button = new ButtonBuilder()
			.setStyle(ButtonStyle.Link)
			.setLabel('Buy Premium')
			.setURL(premium_link);
		const row = new ActionRowBuilder().addComponents(button);

		const embed2 = new EmbedBuilder()
			.setTitle('Invoice')
			.setDescription(`To check your invoice, please click the button below.\n\n[Invoice](https://www.patreon.com/user?u=16589138&amp;tab=invoices)`)
			.setColor('Green');
		const button2 = new ButtonBuilder()
			.setStyle(ButtonStyle.Link)
			.setLabel('Check Invoice')
			.setURL(`https://www.patreon.com/user?u=16589138&amp;tab=invoices`);
		const row2 = new ActionRowBuilder().addComponents(button2);

		return message.reply({ embeds: [embed, embed2], components: [row, row2] });
	}
};


