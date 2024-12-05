const client = require('../..');
const ProtectionSettings = require('../../Models/ProtectionSettings');

client.on('guildMemberAdd', async (member) => {
    if (member.user.bot) {
        const settings = await ProtectionSettings.findOne({ guildId: member.guild.id });

        if (settings && settings.protections.get('bot_add')?.enabled) {
            try {
                await member.kick('Adding bots is not allowed.');
                console.log(`Bot ${member.user.tag} was kicked from ${member.guild.name}.`);
            } catch (error) {
                console.error(`Failed to kick bot ${member.user.tag}:`, error);
            }
        }
    }
});
