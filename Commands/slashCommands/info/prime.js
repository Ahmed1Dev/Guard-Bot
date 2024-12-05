const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const Guild = require('../../../Models/GuildDB');
const PremiumKey = require('../../../Models/PremiumKeys');

module.exports = {
    name: 'prime',
    description: 'Activate Premium for a server using a VIP key.',
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    options: [
        {
            name: 'serverid',
            description: 'The ID of the server to activate Premium for.',
            type: 3, // String
            required: true,
        },
        {
            name: 'key',
            description: 'The VIP key to use for activation.',
            type: 3, // String
            required: true,
        },
    ],
    run: async (client, interaction) => {
        const serverId = interaction.options.getString('serverid');
        const keyValue = interaction.options.getString('key');

        if (serverId !== interaction.guild.id) {
            return interaction.reply({
                content: `❌ You can only activate Premium for the current server.`,
                ephemeral: true,
            });
        }

        try {
            const guild = await Guild.findOne({ guildId: serverId });
            if (guild && guild.expireAt > new Date()) {
                return interaction.reply({
                    content: `❌ This server already has an active Premium subscription until **${guild.expireAt.toISOString()}**.`,
                    ephemeral: true,
                });
            }

            const key = await PremiumKey.findOne({ key: keyValue, used: false });
            if (!key) {
                return interaction.reply({
                    content: `❌ Invalid or already used VIP key.`,
                    ephemeral: true,
                });
            }

            const premiumExpireAt = key.expireAt;
            const updatedGuild = await Guild.findOneAndUpdate(
                { guildId: serverId },
                {
                    activatedBy: interaction.user.id,
                    activatedAt: new Date(),
                    expireAt: premiumExpireAt,
                },
                { upsert: true, new: true }
            );

            key.used = true;
            key.assignedTo = interaction.user.id;
            await key.save();

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Premium Activated!')
                .setDescription(`Premium has been successfully activated for this server.`)
                .addFields(
                    { name: 'Activated By', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Expires At', value: premiumExpireAt.toISOString(), inline: true }
                )
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: `❌ An error occurred while processing your request.`,
                ephemeral: true,
            });
        }
    },
};
