const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, AttachmentBuilder, WebhookClient } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessagePolls,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	],
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});
const fs = require(`fs`)

const config = require('./config.json');
require('dotenv').config() // remove this line if you are using replit

client.commands = new Collection()
client.aliases = new Collection()
client.events = new Collection();
client.createEmbed = require('./function/createEmbed');
client.createMenu = require('./function/createMenu');
client.slashCommands = new Collection();
client.protectionCache = new Map();
client.prefix = config.prefix
module.exports = client;




fs.readdirSync('./Handlers/').forEach(file => {
	require(`./Handlers/${file}`)(client);
});



fs.readdir('./language/', (err, files) => {
	if (err) console.error(err);
	files.forEach((f) => {
		console.log(`[Language] ${f} is loaded`)
		client[f.split('.')[0]] = require(`./language/${f}`);
	});
	console.log(`[Language] is loadded!`)
});

client.login(process.env.TOKEN)





const ErrHock = new WebhookClient({ url: `https://discord.com/api/webhooks/1313687314416930907/SmIrNXT687oYZ1k0rKl-RiywAQhBnOW-z4TcsAoAngPLDMpNqif3XluE4D4nby14r9ft` })
process.on('uncaughtException', (err, origin) => {

	try{
		return ErrHock.send({
			embeds: [
				new EmbedBuilder()
					.setTitle('Unhandled Rejection/Catch')
					.setColor('#FF0000')
					.addFields(
						{ name: 'Reason', value: `\`\`\`${err.message}\`\`\`` },
						{ name: 'Promise', value: `\`\`\`${origin}\`\`\`` },
						{ name: 'Stack', value: `\`\`\`${err.stack}\`\`\`` }
					)
					.setFooter({ text: new Date().toLocaleString() })
			]
		})
		return console.log(err,err.stack)

	} catch {
		return console.log(err,err.stack)
	}
});