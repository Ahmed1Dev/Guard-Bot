const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick a member from the server.',
    options: [
        {
            name: 'user',
            description: 'Select the target to kick',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason for this kick',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'bulk',
            description: 'Kick multiple members',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        },
    ],
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    userPerms: [PermissionFlagsBits.KickMembers],
    botPerms: [PermissionFlagsBits.KickMembers],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const bulk = interaction.options.getBoolean('bulk');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const userOption = interaction.options.getUser('user');

        if (!userOption) {
            return interaction.reply({ content: 'Please specify a valid user.', ephemeral: true });
        }

        if (bulk) {
            const mentionedUsers = interaction.options.getMentionable('user');

            if (!mentionedUsers || !Array.isArray(mentionedUsers)) {
                return interaction.reply({ content: 'No valid users mentioned for bulk kick.', ephemeral: true });
            }

            mentionedUsers.forEach(async (user) => {
                const member = interaction.guild.members.cache.get(user.id);
                if (!member) return;

                if (member.id === interaction.user.id || member.id === client.user.id) return;
                if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                    return interaction.reply({ content: 'You cannot kick members with higher or equal roles.' });
                }
                if (!member.kickable) {
                    return interaction.reply({ content: 'I cannot kick this member, check my role position.' });
                }

                await member.kick(reason).catch((err) => console.error(err));
                interaction.channel.send(`Successfully kicked ${member.user.tag}.`);
            });

            return interaction.reply({ content: 'Bulk kick completed.', ephemeral: true });
        } else {
            const member = interaction.guild.members.cache.get(userOption.id);
            if (!member) {
                return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
            }

            if (member.id === interaction.user.id) {
                return interaction.reply({ content: 'You cannot kick yourself.', ephemeral: true });
            }
            if (member.id === client.user.id) {
                return interaction.reply({ content: 'I cannot kick myself.', ephemeral: true });
            }
            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply({ content: 'You cannot kick members with higher or equal roles.', ephemeral: true });
            }
            if (!member.kickable) {
                return interaction.reply({ content: 'I cannot kick this member.', ephemeral: true });
            }

            await member.kick(reason).catch((err) => {
                console.error(err);
                return interaction.reply({ content: 'An error occurred while trying to kick the member.', ephemeral: true });
            });

            return interaction.reply({ content: `Successfully kicked ${member.user.tag}.` });
        }
    },
};
