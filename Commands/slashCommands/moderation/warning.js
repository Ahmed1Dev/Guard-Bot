const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, BitField, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const ms = require(`ms`);
const humanizeDuration = require('humanize-duration');
const mongoose = require('mongoose');
const Model = require('../../../Models/Warn');

module.exports = {
    name: 'warnings',
    description: 'display a users warns list.',
    options: [
        {
            name: "user",
            description: 'select a user for displaying warn list for him',
            type: 6,
            required: false
        },
    ],
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    userPerms: ['ManageMessages'],
    botPerms: ['ManageMessages'],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');

        const userWarnings = user ?
            await Model.find({
                userId: user.id,
                guildId: interaction.guildId,
            }) :
            await Model.find({
                guildId: interaction.guildId,
            });

        const page = interaction.options.getNumber('page') || 1;

        if(!userWarnings?.length) {
            if(user) {
                return interaction.reply(client.language.noWarn.replace('[user]', user));
            } else {
                return interaction.reply(client.language.ThereNoWarns);
            }
        }

        const embedDescription = userWarnings.slice((page - 1) * 15, page * 15).map((warn) => {
            const moderator = interaction.guild.members.cache.get(warn.moderatorId)?.user;
            const warnId = warn.warnId;

            return [
                `**WarnID: ${warnId} - By: ${moderator?.tag || 'Has Left'} - On: <@${warn.userId}>**`,
                `\`\`\`${warn.reason}\`\`\``

            ].join("\n")
        }).join('\n');

        const display = new EmbedBuilder()
        .setTitle(`${user ? `${user.tag}'s` : 'All'} Warnings :warning:`)
        .setDescription(embedDescription)
        .setFooter({text: `Page ${page}/${Math.ceil(userWarnings.length / 15)}`});

        let row;
        if(userWarnings.length > 15) {
            row = new ActionRowBuilder();
            if(page > 1) {
                row.addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${user ? user.id : interaction.guildId}-${page - 1}`)
                    .setLabel('Back')
                    .setStyle(1)
                );
            }
            if(page * 15 < userWarnings.length) {
                row.addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${user ? user.id : interaction.guildId}-${page + 1}`)
                    .setLabel('Next')
                    .setStyle(1)
                );
            }
        }

        const message = await interaction.reply({ embeds: [display], components: row ? [row] : [] });

        const filter = (i) =>
            (i.customId.startsWith(`${user ? user.id : interaction.guildId}-`) && i.user.id === interaction.user.id);

        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            await i.deferUpdate();
            const newPage = Number(i.customId.split('-').pop());
            if(newPage >= 1 && newPage <= Math.ceil(userWarnings.length / 15)) {
                await interaction.editReply({ embeds: [display.setDescription(userWarnings.slice((newPage - 1) * 15, newPage * 15).map((warn) => {
                    const moderator = interaction.guild.members.cache.get(warn.moderatorId)?.user;
                    const warnId = warn.warnId;

                    return [
                        `**WarnID: ${warnId} - By: ${moderator?.tag || 'Has Left'} - On: <@${warn.userId}>**`,
                        `\`\`\`${warn.reason}\`\`\``

                    ].join("\n")
                }).join('\n'))], components: row ? [row] : [] });
                display.setFooter({text: `Page ${newPage}/${Math.ceil(userWarnings.length / 15)}`});
            }
        });

        collector.on('end', collected => {
            if(collected.size === 0) message.edit({ components: [] });
        });
    }
};

