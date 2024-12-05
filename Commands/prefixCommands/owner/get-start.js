const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, SelectMenuBuilder, AttachmentBuilder, MessageCollector } = require('discord.js');

module.exports = {
	name: 'get-started',
	description: "Give a user blacklist",
	cooldown: 3000,
	userPerms: ['SendMessages'],
	botPerms: ['SendMessages'],
	run: async (client, message, args, interaction) => {
		if(message.author.id !== '919719379439071242') return;
       
        const intro = new EmbedBuilder()
        .setTitle(`Hello Everyone :wave: to Volty!`)
        .setDescription('- **Thank you for choosing Volty for your server management needs. We assure you that our bot is secure and reliable. We have a wide range of features that will make your server management experience easier and more enjoyable ✨.**')
              .addFields(
                { name: `🌟 Features:`, value: `- Moderation tools \n- Server protection \n- Self-assignable roles\n- Detailed logs\n- Social media notifications` },
                { name: `🤔 How to use:`, value: `To get started, simply click on the button below to get started.`, },
                { name: `🔧 Self Roles:`, value: `- <@&1235281349129011341> Updates Ping! \n- <@&1235281106727866410> Status Ping!` },
                { name: `🔗 Links:`, value: `[Add Volty!](https://discord.com/oauth2/authorize?client_id=932843758687494235&permissions=2080374975&scope=bot%20applications.commands)\n And More!` },
                )
              .setImage(`https://cdn.discordapp.com/attachments/1233241148332576830/1260668532430082159/info_1.png`)
              .setColor('Blurple');

      message.channel.send({ embeds: [intro] });
      message.channel.send(`https://cdn.discordapp.com/attachments/1233241148332576830/1260668507385893034/line_.png`)
      
    }
};