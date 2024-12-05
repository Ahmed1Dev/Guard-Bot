const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, BitField } = require('discord.js');
const Model = require('../../../Models/Mute');

module.exports = {
    name: 'unmute',
    description: "Unmute a member from channel they can type again",
    options: [
        {
            name: 'text',
            description: 'Unmute a member from channel they can type again.',
            type: 1,
            options:[
                {
                    name: 'user',
                    description: 'User to unmute',
                    type: 6,
                    required: true,
                },
            ],
        },
        {
            name: 'voice',
            description: 'Unmute a member from voice channel they can speak again!',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'User to unmute.',
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
        
        const member = interaction.guild.members.cache.get(user.id);
        const executor = interaction.member;
    
        if (executor.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({ content: client.language.memberPosision.replace('[user]', user.tag) });
        }

        switch(sub) {
            case "text":
                {
                    const member = interaction.guild.members.cache.get(user.id);
                    const executor = interaction.member;
                    
                    if (!member) return interaction.reply({ content: `User not found!`, ephemeral: true });
                    
                    if (executor.roles.highest.position <= member.roles.highest.position) {
                        return interaction.reply({ content: client.language.mutedcant.replace('[user]', user.tag) });
                    }
                    
                    const role = interaction.guild.roles.cache.find(role => role.name === 'Muted');
                    if (!role) {
                        return interaction.reply({ content: client.language.ThereMutedRole, ephemeral: true });
                    }
                    
                    if (!member.roles.cache.has(role.id)) {
                        return interaction.reply({ content: client.language.notMuted.replace('[user]', user.tag), ephemeral: true });
                    }
                    
                    await member.roles.remove(role);
                    interaction.reply({ content: client.language.unmute.replace('[user]', user.tag)});
                    
                    Model.findOne({ guildId: interaction.guild.id }, async (err, data) => {
                        const index = data.Users.indexOf(user.id);
                        if (index > -1) {
                            data.Users.splice(index, 1);
                        }
                        data.save();
                    });
                    break;
                }
            case "voice":
                {
                    const member = interaction.guild.members.cache.get(user.id);
                    const executor = interaction.member;
                    
                    if (executor.roles.highest.position <= member.roles.highest.position) {
                        return interaction.reply({ content: client.language.mutedcant.replace('[user]', user.tag) });
                    }
                    
                    if (!member.voice.channel) {
                        return interaction.reply({ content: client.language.NotInVoice, ephemeral: true });
                    }
                    
                    await member.voice.setMute(false);
                    interaction.reply({ content: client.language.vunmute.replace('[user]', user.tag) });
                    
                    Model.findOne({ guildId: interaction.guild.id }, async (err, data) => {
                        const index = data.Users.indexOf(user.id);
                        if (index > -1) {
                            data.Users.splice(index, 1);
                        }
                        data.save();
                    });
                    break;
                }
            default:
                break; // Handle default case if needed
        }
        
    }
};
