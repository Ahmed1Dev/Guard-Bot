const { 
    ApplicationCommandType, 
    EmbedBuilder, 
    PermissionFlagsBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');

module.exports = {
    name: 'scan',
    description: "Scan if a user, role, or the entire server has dangerous permissions.",
    options: [
        {
            name: 'role',
            description: 'Scan users with a specific role for dangerous permissions.',
            type: 8,
            required: false
        }
    ],
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

        const rolesWithDangerousPermissions = [];
        const usersWithDangerousPermissions = [];

        const role = interaction.options.getRole('role'); 

        interaction.guild.roles.cache.forEach(role => {
            const dangerousPermsFound = dangerousPermissions.filter(perm => 
                role.permissions.has(PermissionFlagsBits[perm])
            );
            if (dangerousPermsFound.length > 0) {
                rolesWithDangerousPermissions.push({
                    name: role.name,
                    permissions: dangerousPermsFound
                });
            }
        });

        interaction.guild.members.cache.forEach(member => {
            const dangerousPermsFound = dangerousPermissions.filter(perm => 
                member.permissions.has(PermissionFlagsBits[perm])
            );
            if (dangerousPermsFound.length > 0) {
                usersWithDangerousPermissions.push({
                    name: `${member.user.username} (${member.user.id})`, 
                    permissions: dangerousPermsFound
                });
            }
        });

        const embed = new EmbedBuilder()
            .setTitle('Scan Results')
            .setColor('Red');

        if (role) {
            const roleMembersWithDangerousPermissions = [];
            role.members.forEach(member => {
                const dangerousPermsFound = dangerousPermissions.filter(perm => 
                    member.permissions.has(PermissionFlagsBits[perm])
                );
                if (dangerousPermsFound.length > 0) {
                    roleMembersWithDangerousPermissions.push({
                        name: `${member.user.username} (${member.user.id})`, 
                        permissions: dangerousPermsFound
                    });
                }
            });

            if (roleMembersWithDangerousPermissions.length > 0) {
                embed.setDescription('Members with Dangerous Permissions in the Role:');
                roleMembersWithDangerousPermissions.forEach(member => {
                    embed.addFields({
                        name: member.name,
                        value: member.permissions.join(', '),
                        inline: false
                    });
                });
            } else {
                embed.setDescription('No members with dangerous permissions in this role.');
            }
        } else {
            embed.setDescription(
                rolesWithDangerousPermissions.length > 0
                    ? rolesWithDangerousPermissions.map(role => `- ${role.name}`).join('\n')
                    : 'No roles with dangerous permissions detected.'
            );
        }

        const detailsButton = new ButtonBuilder()
            .setCustomId('showDetails')
            .setLabel('Roles Details')
            .setStyle(ButtonStyle.Primary);

        const usersButton = new ButtonBuilder()
            .setCustomId('showUsers')
            .setLabel('Dangerous Users')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(detailsButton, usersButton);

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        const collector = interaction.channel.createMessageComponentCollector({
            filter: i => ['showDetails', 'showUsers'].includes(i.customId) && i.user.id === interaction.user.id,
            time: 60000 
        });

        collector.on('collect', async buttonInteraction => {
            if (buttonInteraction.customId === 'showDetails') {
                const detailsEmbed = new EmbedBuilder()
                    .setTitle('Detailed Role Information')
                    .setColor('Blue');

                rolesWithDangerousPermissions.forEach(role => {
                    detailsEmbed.addFields({
                        name: role.name,
                        value: role.permissions.join(', '),
                        inline: false
                    });
                });

                await buttonInteraction.reply({ embeds: [detailsEmbed], ephemeral: true });
            } else if (buttonInteraction.customId === 'showUsers') {
                const usersEmbed = new EmbedBuilder()
                    .setTitle('Users with Dangerous Permissions')
                    .setColor('Green');

                if (usersWithDangerousPermissions.length > 0) {
                    usersWithDangerousPermissions.forEach(user => {
                        usersEmbed.addFields({
                            name: user.name, 
                            value: user.permissions.join(', '),
                            inline: false
                        });
                    });
                } else {
                    usersEmbed.setDescription('No users detected with dangerous permissions.');
                }

                await buttonInteraction.reply({ embeds: [usersEmbed], ephemeral: true });
            }
        });

        collector.on('end', () => {
            detailsButton.setDisabled(true);
            usersButton.setDisabled(true);

            interaction.editReply({
                components: [new ActionRowBuilder().addComponents(detailsButton, usersButton)]
            });
        });
    }
};
