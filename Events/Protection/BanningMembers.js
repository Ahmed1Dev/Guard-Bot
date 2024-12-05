const client = require('../..')
const ProtectionSettings = require('../../Models/ProtectionSettings');

client.on('guildBanAdd', async (ban) => {
    const { guild, user } = ban;
    const auditLogs = await guild.fetchAuditLogs({ type: 22 }); // نوع الحظر
    const entry = auditLogs.entries.first();

    if (!entry || !entry.executor) return;

    const executor = entry.executor;
    const protectionLimit = client.protectionCache.get(`ban_${executor.id}`) || 0;

    if (protectionLimit >= 5) {
        try {
            const member = await guild.members.fetch(executor.id);
            await member.kick('Exceeded the ban limit.');
            console.log(`User ${executor.tag} has been kicked for banning too many members.`);
        } catch (err) {
            console.error(`Could not kick user ${executor.tag}:`, err);
        }
    } else {
        client.protectionCache.set(`ban_${executor.id}`, protectionLimit + 1);
        setTimeout(() => {
            client.protectionCache.set(`ban_${executor.id}`, 0);
        }, 10 * 60 * 1000); // إعادة التعيين بعد 10 دقائق
    }
});
