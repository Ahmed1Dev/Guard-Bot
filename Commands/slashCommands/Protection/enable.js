const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ProtectionSettings = require('../../../Models/ProtectionSettings');

module.exports = {
    name: 'enable',
    description: 'Enable a specific protection feature with a limit.',
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    options: [
        {
            name: 'action',
            description: 'Select the protection action to enable.',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Banning Members', value: 'ban' },
                { name: 'Kicking Members', value: 'kick' },
                { name: 'Deleting Roles', value: 'role_delete' },
                { name: 'Creating Roles', value: 'role_create' },
                { name: 'Deleting Channels', value: 'channel_delete' },
                { name: 'Creating Channels', value: 'channel_create' },
                { name: 'Adding Bots', value: 'bot_add' },
                { name: 'Giving Dangerous Permissions', value: 'dangerous_permissions' },
                { name: 'Giving Administration Roles', value: 'admin_roles' },
                { name: 'Pruning Members', value: 'pruning_members' },
                { name: 'Sending Invite Links', value: 'invite_links' },
            ],
        },
        {
            name: 'limit',
            description: 'Set the limit for this protection (e.g., 3).',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ You do not have permission to use this command.',
                ephemeral: true,
            });
        }

        const action = interaction.options.getString('action');
        const limit = interaction.options.getInteger('limit');

        if (limit < 1) {
            return interaction.reply({
                content: '❌ The limit must be at least 1.',
                ephemeral: true,
            });
        }

        try {
            let settings = await ProtectionSettings.findOne({ guildId: interaction.guild.id });

            if (!settings) {
                settings = new ProtectionSettings({
                    guildId: interaction.guild.id,
                    protections: {},
                });
            }

            settings.protections[action] = {
                enabled: true,
                limit,
            };

            await settings.save();

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Protection Enabled')
                .setDescription(`**Action:** ${action}\n**Limit:** ${limit}`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            return interaction.reply({
                content: '❌ An error occurred while saving the settings. Please try again.',
                ephemeral: true,
            });
        }
    },
};
