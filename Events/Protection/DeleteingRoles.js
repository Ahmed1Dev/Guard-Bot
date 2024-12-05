const client = require('../..')
const ProtectionSettings = require('../../Models/ProtectionSettings');

client.on('roleDelete', async (role) => {
    const settings = await ProtectionSettings.findOne({ guildId: role.guild.id });

    if (settings && settings.protections.get('role_delete')?.enabled) {
        const limit = settings.protections.get('role_delete')?.limit || 1;

        const auditLogs = await role.guild.fetchAuditLogs({
            type: 'ROLE_DELETE',
            limit: 1,
        });

        const logEntry = auditLogs.entries.first();
        if (!logEntry) return;

        const executor = logEntry.executor;

        const userActions = client.protectionCache.get(executor.id) || 0;

        if (userActions >= limit) {
            try {
                await role.guild.members.ban(executor, { reason: 'Exceeded role deletion limit' });
                console.log(`User ${executor.tag} was banned for deleting too many roles.`);
            } catch (error) {
                console.error(`Failed to ban user ${executor.tag}:`, error);
            }
        } else {
            client.protectionCache.set(executor.id, userActions + 1);
            setTimeout(() => client.protectionCache.delete(executor.id), 10 * 60 * 1000); // إعادة تعيين بعد 10 دقائق
        }
    }
});
