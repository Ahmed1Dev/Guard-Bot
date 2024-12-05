const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, CommandInteraction, Client } = require('discord.js');
const ms = require(`ms`);
const humanizeDuration = require('humanize-duration');

module.exports = {
	name: 'ban',
	description: "Ban a member from the server.",
    options: [
        {
			name: 'user',
			description: 'User to ban',
			type: 6,
			required: true,
		},
		{
			name: 'time',
			description: 'type a time Example: 1m, 1d, 1w, 1mo, 1y',
			type: 3,
			required: false
		},
		{
			name: 'reason',
			description: 'type reason for giving him banned',
			type: 3,
			required: false
		},
        {
            name: 'bulk',
            description: 'Ban multiple users',
            type: 5,
            required: false
        }
    ],
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    userPerms: ['BanMembers'],
	botPerms: ['BanMembers'],
    /**
     * @param {Client} client
     * @parma {CommandInteraction} interaction
     * @param {String} args
     */
	run: async (client, interaction) => {
        try {
            if(interaction.options.getBoolean('bulk')) {
                const users = interaction.options.getMentions('user');
                const reason = interaction.options.getString('reason') || "No Reason";
                const time = interaction.options.getString('time') || "999999999";

                users.forEach(async (user) => {
                    if(user === interaction.user || user === client.user) return;
                    if(user.roles.highest.position > interaction.member.roles.highest.position) return interaction.reply(client.language.higherRole);
                    if(user.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.fetchOwner().id) return interaction.reply(client.language.higherSelf);
                    if(!user.bannable) return interaction.reply(client.language.BanRolePosition);
                    await user.ban({ reason: `${reason}`, days: ms(time) });
                    await interaction.reply(client.language.ban.replace('[user]', user.user.tag));
                });
            } else {
                let user = interaction.options.getMember('user') || user.id;
                let time = interaction.options.getString('time') || "999999999";
                let reason = interaction.options.getString('reason') || "No Reason";

                if(user === interaction.user || user === client.user) return;
                if(user.roles.highest.position > interaction.member.roles.highest.position) return interaction.reply(client.language.higherRole);
                if(user.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.fetchOwner().id) return interaction.reply(client.language.higherSelf);
                if(!user.bannable) return interaction.reply(client.language.BanRolePosition);
                await user.ban({ reason: `${reason}`, days: ms(time) });
                await interaction.reply(client.language.ban.replace('[user]', user.user.tag));
            }
        } catch (e) {
              console.log(e)
              interaction.reply(client.language.bug)
          }
	}
};
