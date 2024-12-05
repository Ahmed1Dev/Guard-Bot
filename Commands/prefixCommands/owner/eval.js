const OwnerID = ['813484592123609088'];

module.exports = {
	name: 'eval',
	description: "Check bot's ping.",
	aliases: "بنج",
	cooldown: 3000,
	userPerms: [],
	botPerms: [],
	run: async (client, message, args) => {
		if (!OwnerID.includes(message.author.id)) return;
		let codein = args.join(' ');
		try {
			let code = eval(codein);
			if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 });
			message.channel.send(`\`\`\`js\n${code}\n\`\`\``);
		} catch (e) {
			return message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
		}
	},
};
