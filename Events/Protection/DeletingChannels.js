const client = require('../..'); // التأكد من استدعاء العميل الأساسي
const ProtectionSettings = require('../../Models/ProtectionSettings');

client.on('channelDelete', async (channel) => {
    const guild = channel.guild;
    const auditLogs = await guild.fetchAuditLogs({ type: 12 }); // نوع حذف القناة
    const entry = auditLogs.entries.first(); // الحصول على آخر تعديل

    if (!entry || !entry.executor) return;

    const executor = entry.executor; // المستخدم الذي قام بالعملية
    const protectionLimit = client.protectionCache.get(`channelDelete_${executor.id}`) || 0;

    // إذا تجاوز الحد المسموح
    if (protectionLimit >= 3) {
        try {
            const member = await guild.members.fetch(executor.id);
            await member.kick('Exceeded the channel delete limit.');
            console.log(`User ${executor.tag} has been kicked for deleting too many channels.`);
        } catch (err) {
            console.error(`Could not kick user ${executor.tag}:`, err);
        }
    } else {
        // تحديث الذاكرة المؤقتة
        client.protectionCache.set(`channelDelete_${executor.id}`, protectionLimit + 1);
        setTimeout(() => {
            client.protectionCache.set(`channelDelete_${executor.id}`, 0);
        }, 10 * 60 * 1000); // إعادة التعيين بعد 10 دقائق
    }
});
