const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const PremiumKey = require('../../../Models/PremiumKeys');
const PremiumServer = require('../../../Models/GuildDB'); 
const ms = require('ms');

module.exports = {
    name: 'vip',
    description: 'Manage VIP keys',
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    options: [
        {
            name: 'action',
            description: 'Action to perform (add/remove/info)',
            type: 3, 
            required: true,
            choices: [
                { name: 'Add', value: 'add' },
                { name: 'Remove', value: 'remove' },
                { name: 'Info', value: 'info' },
            ],
        },
        {
            name: 'user',
            description: 'Target user',
            type: 6,
            required: true,
        },
        {
            name: 'time',
            description: 'Expiration time (e.g., 7d, 1m)',
            type: 3, 
            required: false,
        },
    ],
    run: async (client, interaction) => {
        const allowedRoleId = '1313316300411637812';

        if (!interaction.member.roles.cache.has(allowedRoleId)) {
            return interaction.reply({
                content: `❌ You don't have the required role to use this command.`,
                ephemeral: true,
            });
        }

        const action = interaction.options.getString('action');
        const user = interaction.options.getUser('user');
        const time = interaction.options.getString('time');

        const expireAt = time ? new Date(Date.now() + ms(time)) : null;

        if (action === 'add') {
            if (!expireAt) {
                return interaction.reply({
                    content: `❌ Please provide a valid expiration time.`,
                    ephemeral: true,
                });
            }

            const newKey = new PremiumKey({
                key: `${user.id}-${Date.now()}`,
                createdBy: interaction.user.id,
                expireAt,
            });

            await newKey.save();

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ VIP Key Added')
                .setDescription(`VIP key created for **${user.tag}**.\n**Key:** \`${newKey.key}\`\n**Expires At:** ${expireAt}`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (action === 'remove') {
            const key = await PremiumKey.findOneAndDelete({ assignedTo: user.id });
            if (!key) {
                return interaction.reply({
                    content: `❌ No active VIP key found for **${user.tag}**.`,
                    ephemeral: true,
                });
            }

            const premiumServers = await PremiumServer.find({ activatedBy: user.id });
            for (const server of premiumServers) {
                server.activatedBy = null;
                server.expireAt = null;
                await server.save();
            }

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ VIP Key Removed')
                .setDescription(
                    `VIP key for **${user.tag}** has been removed.\n` +
                    `Premium access was removed from **${premiumServers.length} server(s)**.`
                )
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (action === 'info') {
            const key = await PremiumKey.findOne({ assignedTo: user.id });
            if (!key) {
                return interaction.reply({
                    content: `❌ No active VIP key found for **${user.tag}**.`,
                    ephemeral: true,
                });
            }

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🔑 VIP Key Info')
                .setDescription(`**Key:** ${key.key}\n**Expires At:** ${key.expireAt}`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }
    },
};
