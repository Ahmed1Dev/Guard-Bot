const OwnerID = ['919719379439071242', '834067664648536104', '834016499870072843'];
const Model = require('../../../Models/Users');

module.exports = {
	name: 'addvol',
	description: "Add a vols.",
	aliases: "بنج",
	cooldown: 3000,
	userPerms: [],
	botPerms: [],
	run: async (client, message, args) => {
		if (!OwnerID.includes(message.author.id)) return;
        let id = args[0];
        let amount = parseInt(args[1]);
        if (!id || isNaN(amount)) return message.reply({ content: `ID or amount is not correct` });
        let data;
        await Model.findOne({ userId: id }).then(async (foundData) => {
            if (!foundData) {
                data = new Model({
                    userId: id,
                    Coins: amount,
                    Type: 'text'
                });
                await data.save();
            } else {
                data = foundData;
                data.Coins = parseInt(data.Coins) + amount;
                await data.save();
            }
        });
        message.reply({ content: `Successfully added ${amount} volts to user with ID ${id}` });
	},
};
