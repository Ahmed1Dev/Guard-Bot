const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, BitField } = require('discord.js');
const ms = require(`ms`);
const humanizeDuration = require('humanize-duration');
const Model = require('../../../Models/Mute');

module.exports = {
	name: 'mute',
	description: "Mute a member from channel they cannot type",
    options: [
        {
            name: 'text',
            description: 'Mute a member from channel they cannot type.',
            type: 1,
            options:[
                {
                    name: 'user',
                    description: 'User to mute',
                    type: 6,
                    required: true,
                },
                {
                    name: 'time',
                    description: 'Time duration for the mute Example (1m, 1d, 1w, 1mo, 1y).',
                    type: 3,
                    required: false,
                },
                {
                    name: 'reason',
                    description: 'eason for mute',
                    type: 3,
                    required: false,
                },
            ],
        },
        {
            name: 'voice',
            description: 'Mute a member from voice channel they cannot speak!',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'User to mute.',
                    type: 6,
                    required: true
                },
            ],
        },
    ],
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    userPerms: ['ManageMessages'],
	botPerms: ['ManageRoles', 'ManageChannels'],
	run: async (client, interaction) => {
		const sub = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        const time = interaction.options.getString('time') || '99999y';
        const reason = interaction.options.getString('reason') || client.language.noReason;

        switch(sub) {
            case "text": {
                const member = interaction.guild.members.cache.get(user.id);
                const executor = interaction.member;

                if (executor.roles.highest.position <= member.roles.highest.position) {
                    return interaction.reply({ content: client.language.memberPosision.replace('[user]', user.tag) });
                }

                let role = interaction.guild.roles.cache.find(role => role.name === 'Muted');
                if (!role) {
                    role = await interaction.guild.roles.create({ name: 'Muted', permissions: [] });
                }

                await member.roles.add(role);
                interaction.reply({ content: client.language.mute.replace('[user]', user.tag).replace('[time]', humanizeDuration(ms(time), { units: ['y', 'mo', 'w', 'd', 'h', 'm', 's'] })) });

                await Model.findOneAndUpdate(
                    { guildId: interaction.guild.id },
                    {
                        $addToSet: {
                            Users: user.id
                        },
                        Type: 'text'
                    },
                    { upsert: true }
                );

                setTimeout(async () => {
                    await member.roles.remove(role);
                    await Model.findOneAndUpdate(
                        { guildId: interaction.guild.id, Users: user.id },
                        { $pull: { Users: user.id } }
                    );
                }, ms(time));
                break;
            }
            case "voice": {
                const member = interaction.guild.members.cache.get(user.id);
                const executor = interaction.member;

                if (executor.roles.highest.position <= member.roles.highest.position) {
                    return interaction.reply({ content: client.language.memberPosision.replace('[user]', user.tag)});
                }

                await member.voice.setMute(true);
                interaction.reply({ content: client.language.vmute.replace('[user]', user.tag) });

                await Model.findOneAndUpdate(
                    { guildId: interaction.guild.id },
                    {
                        $addToSet: {
                            Users: user.id
                        },
                        Type: 'voice'
                    },
                    { upsert: true }
                );
                break;
            }
        }
	}
};
