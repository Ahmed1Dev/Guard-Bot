const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, BitField } = require('discord.js');
const lang = require('../../../Models/GuildDB');
const emojis = require('../../../function/emojis.json');
module.exports = {
    name: 'setlang',
    description: "Change a bot language.",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    userPerms: ['ManageChannels'],
    botPerms: ['ManageChannels'],
    options: [
        {
            name: 'lang',
            description: 'Choose a language.',
            required: true,
            type: 3,
            choices: [
                {
                    name: 'English',
                    value: 'english'
                },
                {
                    name: 'Arabic',
                    value: 'arabic'
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        let selectedLang = interaction.options.getString('lang');
        let reply;
        switch(selectedLang){
            case 'english':
                selectedLang = 'en';
                reply = `**${emojis.checkMark} Server language has been set to ${selectedLang}.**`;
                break;
            case 'arabic':
                selectedLang = 'ar';
                reply = `**${emojis.checkMark} تم تغير اللغة بنجاح إلى اللغة العربية**`;
                break;
        }
        try {
            const currentLang = await lang.findOne({ guildId: interaction.guildId });
            if (currentLang && currentLang.Lang === selectedLang) {
                return interaction.reply({ content: `**${emojis.xMark} Server language is already set to ${selectedLang}.**` });
            }
            await lang.updateOne({ guildId: interaction.guildId }, { Lang: selectedLang });
            interaction.reply({ content: reply });
        } catch (err) {
            interaction.reply({ content: `**${emojis.xMark} Error setting server language: ${err.message}**` });
        }
    }
};