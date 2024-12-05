const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, CommandInteraction, Client } = require('discord.js');
const ms = require(`ms`);
const humanizeDuration = require('humanize-duration');

module.exports = {
	name: 'unban',
	description: "Unban user from this server",
    options: [
        {
			name: 'input',
			description: 'Type user ID to removing ban.',
			type: 3,
			required: true,
		},
    ],
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    userPerms: ['BanMembers'],
	botPerms: ['BanMembers'],
    async run(client, interaction) {
		const input = interaction.options.getString('input');
		switch(input){
			case 'all':
				const fetchBans = await interaction.guild.bans.fetch();
				if (!fetchBans) {
					return interaction.reply(client.language.fetchBans);
				}
				const usersBanned = fetchBans.map((ban) => ban.user.id);
				usersBanned.forEach((userId) => {
					interaction.guild.members.unban(userId, `By: ${interaction.user.tag} unban all`);
				});
				return interaction.reply(client.language.unbanAll.replace('[size]', fetchBans.size));
			default:
				try {
					await interaction.guild.members.unban(input, `By: ${interaction.user.tag}`);
					const unbannedUser = await client.users.fetch(input);
					interaction.reply({ content: client.language.unbanUser.replace('[user]', unbannedUser.username) });
				} catch (e) {
					console.error(e);
					return interaction.reply({ content: client.language.bug });
				}
		}
    }
};
