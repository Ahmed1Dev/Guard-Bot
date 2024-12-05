const client = require('../..');
const ProtectionSettings = require('../../Models/ProtectionSettings');

client.on('messageCreate', async (message) => {
    if (!message.guild || message.author.bot) return;

    try {
        const settings = await ProtectionSettings.findOne({ guildId: message.guild.id });

        if (!settings || !settings.protections || !settings.protections.invite_links) {
            return; 
        }

        const inviteLinksProtection = settings.protections.invite_links;

        if (inviteLinksProtection.enabled) {
            const inviteLinkRegex = /(https?:\/\/)?(www\.)?(discord\.gg|discordapp\.com\/invite)\/\w+/i;

            if (inviteLinkRegex.test(message.content)) {
                await message.delete();

                message.channel.send(`❌ **${message.author.tag}**, sending invite links is not allowed here!`);
            }
        }
    } catch (err) {
        console.error('Error in LinksProtection.js:', err);
    }
});
