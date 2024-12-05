const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require(`ms`);
const humanizeDuration = require('humanize-duration');

module.exports = {
	name: 'timeout',
	description: "timeout a member.",
    options: [
        {
            name: 'user',
            description: 'select the target for timeout',
            type: 6,
            required: true,
        },
        {
            name: 'length',
            description: 'length of timeout.',
            type: 3,
            required: true,
        },
        {
            name: 'reason',
            description: 'reason for this timeout.',
            type: 3,
            required: false
        },
    ],
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    userPerms: ['ManageMessages'],
	botPerms: ['ManageMessages'],
	run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const length = interaction.options.getString('length');
        const reason = interaction.options.getString('reason') || client.language.noReason;
        const member = interaction.guild.members.cache.get(user.id)
        const executor = interaction.member;
    
        if (executor.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({ content: client.language.memberPosision.replace('[user]', user.tag) });
        }

        const timeInMs = ms(length)
        if(!timeInMs) return interaction.reply({ content: client.language.vaildTime });

        switch (true) {
            case timeInMs < 1000: 
                member.timeout(timeInMs, reason)
                interaction.reply({ content: client.language.timeout.replace('[time]', humanizeDuration(timeInMs, { round: true })).replace('[user]', user) })
                break;
            case timeInMs >= 1000 && timeInMs < 60000: 
                const minutes = Math.floor(timeInMs / 60000)
                member.timeout((minutes * 60000), reason)
                interaction.reply({ content: client.language.timeout.replace('[time]', humanizeDuration((minutes * 60000), { round: true })).replace('[user]', user) })
                break;
            case timeInMs >= 60000 && timeInMs < 86400000: 
                const hours = Math.floor(timeInMs / 3600000)
                member.timeout((hours * 3600000), reason)
                interaction.reply({ content: client.language.timeout.replace('[time]', humanizeDuration((hours * 3600000), { round: true })).replace('[user]', user) })
                break;
            case timeInMs >= 86400000: 
                const days = Math.floor(timeInMs / 86400000)
                member.timeout((days * 86400000), reason)
                interaction.reply({ content: client.language.timeout.replace('[time]', humanizeDuration((days * 86400000), { round: true })).replace('[user]', user) })
                break;
            default:
                return interaction.reply({ content: client.language.vaildTime })
        }

	}
};
