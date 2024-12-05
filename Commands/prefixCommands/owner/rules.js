const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, SelectMenuBuilder, AttachmentBuilder, MessageCollector } = require('discord.js');


module.exports = {
    name: 'rules',
    description: "Give a user blacklist",
    cooldown: 3000,
    userPerms: ['SendMessages'],
    botPerms: ['SendMessages'],
    run: async (client, message, args, interaction) => {
        if(message.author.id !== '919719379439071242') return;
       
      const string = `
      مرحبًا بك في جارد! يرجى أن تأخذ لحظة لمراجعة إرشاداتنا: 

احترام أعضاء الفريق: يرجى عدم منشن أعضاء الفريق مباشرةً في الدردشة.
لا للترويج الذاتي: تجنب الترويج لروابط خوادم ديسكورد للحفاظ على تكامل مجتمعنا.
الابتعاد عن الجدل: احتفظ بالمناقشات بعيدة عن مواضيع مثل السياسة والدين لضمان الانسجام والتوافق  بين الأعضاء.
منطقة خالية من الدراما: احتفظ بالخادم خاليًا من الدراما عن طريق معالجة المشاكل الشخصية بشكل خاص. لنحافظ على بيئة نظيفة ومريحة للجميع.
التركيز على جارد: يرجى الحفاظ على المحادثات مركزة على مواضيع تتعلق بجارد في قنوات الدعم لضمان ملاءمتها مع جميع الأعضاء.
حافظ على نظافة المجتمع: يُمنع منعًا باتًا أي محتوى NSFW، بما في ذلك المواد الصريحة أو العنيفة، للحفاظ على مساحة آمنة ومحترمة للجميع.
طلب الدعم: إذا كنت بحاجة إلى مساعدة في استفسارات أو مشاكل تتعلق بجارد، يرجى منشن رتبة الدعم مرة واحدة فقط.
استخدام قنوات الدعم: بدلاً من التواصل مع أعضاء الفريق بشكل خاص للحصول على المساعدة، استخدم القنوات المخصصة للدعم المُقدمة للمساعدة.
عدم التكرار: تجنب تكرار استخدام الرسائل، أو الصور، أو المنشن للحفاظ على بيئة خالية من الفوضى وضمان تجربة ممتعة للجميع.
احترام الاقتراحات: يرجى الامتناع عن تكرار الاقتراحات الخاصة بك أو الآخرين لتجنب التكرار وضمان الكفاءة في عملياتنا لجمع الملاحظات.
الانتباه إلى خوادم أخرى: للحفاظ على الاحترافية داخل مجتمعنا، يرجى الامتناع عن ذكر أسماء خوادم ديسكورد أخرى أو مناقشة أعضاء الفريق فيها.
عدم التداول أو التسول: لا يُسمح بطلب اي شيء، للحفاظ على النزاهة والاستقامة داخل الخادم.
كن لطيفًا: عامل أعضاءك بالاحترام واللطف. تجنب الإساءة، أو التعدي، أو التحرش، أو استهداف الآخرين.

🔗 نحن نتبع شروط الخدمة وقواعد المجتمع الخاصة بديسكورد:
- [شروط خدمة الديسكورد](\https://discord.com/terms)
- [إرشادات المُجتمع للديسكورد](\https://discord.com/guidelines)
للمساعدة، يرجى التوجه إلى قنوات الدعم الفني.`

        const string2 = `
        Welcome to Guard! Please take a moment to review our guidelines: 

Respect Team Members: Please do not tag team members directly in the chat.
No self-promotion: Avoid promoting Discord server links to maintain the integrity of our community.
Stay away from controversy: Keep discussions away from topics like politics and religion to ensure harmony and consensus among members.
Drama-Free Zone: Keep the server drama-free by addressing personal issues privately. Let's maintain a clean and comfortable environment for everyone.
Focus on Volti: Please keep conversations focused on topics related to Volti in the support channels to ensure it is relevant to all members.
Keep the community clean: Any NSFW content, including explicit or violent material, is strictly prohibited to maintain a safe and respectful space for everyone.
Support Request: If you need help with questions or issues related to Guard, please mention the support rank just once.
Use support channels: Instead of reaching out to team members privately for help, use dedicated support channels provided for assistance.
Avoid repetition: Avoid repeating the use of messages, images, or messages to maintain a clutter-free environment and ensure an enjoyable experience for everyone.
Respect Suggestions: Please refrain from repeating your own or others' suggestions to avoid repetition and ensure efficiency in our feedback collection processes.
Attention to other servers: To maintain professionalism within our community, please refrain from mentioning the names of other Discord servers or discussing team members there.
No trading or begging: It is not allowed to ask for anything, to maintain integrity and uprightness within the server.
Be Kind: Treat your members with respect and kindness. Avoid abusing, harassing, or targeting others.

🔗 We follow Discord's Terms of Service and Community Rules:
- [Discord Terms of Service](https://discord.com/terms)
- [Discord Community Guidelines](\https://discord.com/guidelines)
For assistance, please go to the support channels.
`
        const embed = new EmbedBuilder()
        .setTitle(`قوانين جارد!`)
        .setDescription(`${string}`)
        .setColor(`Blurple`)
        .setImage(`https://cdn.discordapp.com/attachments/1233241148332576830/1260809834358374501/info_2.png`);
        const embed2 = new EmbedBuilder()
        .setTitle(`Rules of Guard!`)
        .setDescription(`${string2}`)
        .setColor(`Blurple`)
        .setImage(`https://cdn.discordapp.com/attachments/1233241148332576830/1260809834358374501/info_2.png`);
        message.channel.send({ embeds: [embed, embed2] })
        message.channel.send(`https://cdn.discordapp.com/attachments/1233241148332576830/1260668507385893034/line_.png`)

    }
};

