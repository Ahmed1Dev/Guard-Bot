const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, BitField, ChannelType } = require('discord.js');
const ms = require(`ms`);
const humanizeDuration = require('humanize-duration');
const mongoose = require('mongoose');
const Model = require('../../../Models/Warn');

module.exports = {
    name: 'warn',
    description: "Warn a member!",
    options: [
        {
            name: 'user',
            description: 'select a member',
            type: 6,
            required: true
        },
        {
            name: 'reason',
            description: 'reason for warn',
            type: 3,
            required: false
        }
    ],
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    userPerms: ['ManageMessages'],
    botPerms: ['ManageMessages'],
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || client.language.noReason;
        const warnId = (Math.floor(Math.random() * 99999) + 10000).toString().padStart(5, '0');

        const member = interaction.guild.members.cache.get(user.id);
        const executor = interaction.member;
    
        if (executor.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({ content: client.language.memberPosision.replace('[user]', user.tag) });
        }

        const Warn = new Model({
            userId: user.id,
            guildId: interaction.guild.id,
            moderatorId: interaction.user.id,
            warnId,
            reason,
            timestamp: Date.now()
        })
        await Warn.save();

        const warned = new EmbedBuilder()
            .setTitle(client.language.warned)
            .setDescription(`${reason}`)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setColor('Yellow');
        await user.send({ embeds: [warned] });

        switch (interaction.channel.type) {
            case 'DM':
                await interaction.reply({ content: client.language.warnDone.replace('[user]', user) });
                break;
            case ChannelType.GuildText:
            case ChannelType.GuildNews:
            case ChannelType.GuildPublicThread:
            case ChannelType.GuildPrivateThread:
            case ChannelType.GuildNewsThread:
                await interaction.reply({ content: client.language.warnDone.replace('[user]', user)});
                break;
            default:
                break;
        }
    }
};



