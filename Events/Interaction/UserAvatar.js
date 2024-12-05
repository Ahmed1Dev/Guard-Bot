const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const client = require(`../../`)

client.on(`interactionCreate`, async interaction => {
    if (!interaction.isButton()) return;
    
    if (interaction.customId && interaction.customId.startsWith(`user_avatar_`)) {
        const User = interaction.guild.members.cache.get(interaction.customId.split(`_`)[2]);
        
        const Sv = new ButtonBuilder()
            .setLabel(`Server Avatar`)
            .setStyle(2)
            .setCustomId(`server_avatar_${User.id}`);

        const Row = new ActionRowBuilder().addComponents(Sv);
        const embed = new EmbedBuilder()
            .setColor(`Red`)
            .setImage(User.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setThumbnail(User.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setAuthor({ name: User.displayName, iconURL: User.displayAvatarURL({ dynamic: true }) })
            .setFooter({ text: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        interaction.update({ embeds: [embed], components: [Row] });
    }
});