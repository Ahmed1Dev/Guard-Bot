const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'clear',
	description: "Clean channel from messages.",
	options: [
		{
			name: 'number_of_messages',
			description: 'Number of messages to clean',
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
		{
			name: 'user',
			description: 'User to clear messages for',
			type: ApplicationCommandOptionType.User,
		},
		{
			name: 'role',
			description: 'Clear messages from role',
			type: ApplicationCommandOptionType.Role,
		},
	],
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	userPerms: ['ManageMessages'],
	botPerms: ['ManageMessages'],
	async run(client, interaction) {
		const deleteAmount = interaction.options.getInteger('number_of_messages');
		const user = interaction.options.getUser('user')?.id;
		const role = interaction.options.getRole('role')?.id;

		let messageCount = 0;

		const messages = await interaction.channel.messages.fetch({ limit: deleteAmount });
		const messagesToDelete = [];

		if (user) {
			messagesToDelete.push(...messages.filter(message => message.author.id === user).values());
		}
		if (role) {
			messagesToDelete.push(...messages.filter(message => message.member?.roles.cache.has(role)).values());
		}
		if (!user && !role) {
			messagesToDelete.push(...messages.values());
		}

		messageCount = messagesToDelete.length;
		await interaction.channel.bulkDelete(messagesToDelete);

		const reply = await interaction.reply({ content: client.language.clear.replace('[messageCount]', messageCount), ephemeral: false });
		setTimeout(() => reply.delete().catch(() => {}), 5000);
	},
};

