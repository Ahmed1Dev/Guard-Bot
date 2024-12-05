const { 
    ApplicationCommandType, 
    EmbedBuilder, 
    PermissionFlagsBits 
} = require('discord.js');

module.exports = {
    name: 'scan-bots',
    description: "Scan all bots in the server for dangerous permissions.",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    userPerms: [PermissionFlagsBits.ManageGuild],
    botPerms: [PermissionFlagsBits.ManageRoles],
    run: async (client, interaction) => {
        const dangerousPermissions = [
            'Administrator',
            'ManageGuild',
            'BanMembers',
            'KickMembers',
            'ManageRoles',
            'ManageChannels',
            'ViewAuditLog',
            'ManageWebhooks',
            'ManageMessages',
            'MentionEveryone'
        ];

        const botsWithDangerousPermissions = [];

        interaction.guild.members.cache.forEach(member => {
            if (member.user.bot) { // Check if the member is a bot
                const dangerousPermsFound = dangerousPermissions.filter(perm =>
                    member.permissions.has(PermissionFlagsBits[perm])
                );

                if (dangerousPermsFound.length > 0) {
                    botsWithDangerousPermissions.push({
                        name: member.user.tag,
                        permissions: dangerousPermsFound
                    });
                }
            }
        });

        const embed = new EmbedBuilder()
            .setTitle('Bots with Dangerous Permissions')
            .setColor(botsWithDangerousPermissions.length > 0 ? 'Red' : 'Green')
            .setDescription(
                botsWithDangerousPermissions.length > 0
                    ? botsWithDangerousPermissions
                        .map(bot => `**${bot.name}**\nPermissions: ${bot.permissions.join(', ')}`)
                        .join('\n\n')
                    : 'No bots with dangerous permissions detected.'
            );

        const content = botsWithDangerousPermissions.length > 0 
            ? '⚠️ Bots with dangerous permissions detected:' 
            : '✅ No bots with dangerous permissions found.';

        await interaction.reply({ content, embeds: [embed], ephemeral: true });
    }
};
