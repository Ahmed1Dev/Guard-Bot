const client = require('../..');
const { EmbedBuilder, ActionRowBuilder, MessageComponentInteraction, ButtonBuilder, ButtonStyle } = require('discord.js');
const Model = require('../../Models/GuildDB');

client.on('guildCreate', async guild => {
    const channel = client.channels.cache.get('1313991856673259572');
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setTitle('Joined a new guild!')
        .setDescription(`${guild.name} (${guild.id})`)
        .addFields([
            {
                name: 'Member Count',
                value: guild.memberCount.toString(),
                inline: true
            },
            {
                name: 'Boost Level',
                value: guild.premiumSubscriptionCount.toString(),
                inline: true
            }
        ])
        .setColor('Green')
        .setTimestamp();

    if (guild.iconURL()) {
        embed.setThumbnail(guild.iconURL({ dynamic: true }));
    }

    if (guild.bannerURL()) {
        embed.setImage(guild.bannerURL({ dynamic: true }));
    }

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Blacklist Server')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('blacklist_server'),
            new ButtonBuilder()
                .setLabel('Leave Guild')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('leave_guild')
        );

    let message;
    try {
        message = await channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
        console.error(`Failed to send message to guildCreate channel: ${error}`);
        return;
    }

    const filter = i => i.user.id === guild.ownerId;
    const collector = message.createMessageComponentCollector({ filter, time: 1500000 });

    collector.on('collect', async interaction => {
        if (!interaction.isMessageComponent() || !interaction.deferUpdate) return;
        await interaction.deferUpdate();

        switch (interaction.customId) {
            case 'leave_guild':
                await guild.leave();
                await interaction.followUp({ content: '> Bot has left the server.', ephemeral: true });
                break;
            case 'blacklist_server':
                const guildData = await Model.findOne({ guildId: guild.id });
                guildData.Blacklisted = true;
                await interaction.followUp({ content: '> Server has been blacklisted.', ephemeral: true });
                break;
            default:
                break;
        }
    });

    collector.on('end', () => {
        if (!collector.ended) {
            message.edit({ components: [] });
        }
    });
});

