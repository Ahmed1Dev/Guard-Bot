const client = require('../..')
const chalk = require('colors/safe')
const mongoose = require('mongoose')
const Database = process.env.MONGO_DB

	if(Database) {
          mongoose.connect(Database, {
               useNewUrlParser: true,
               useUnifiedTopology: true
          }).then(() => {
               console.log(chalk.cyan("Mongo Database • Connected"))
          }).catch((err) => {
               console.log(err)
          });
		}
client.on("ready", () => {
	

	const activities = [
		{ name: `DM me to contact staff`, type: 2 }, // LISTENING
		{ name: `BytesCode Group ™`, type: 0 }, // PLAYING
		{ name: `+100 Order Complated`, type: 3 } // WATCHING
	];
	const status = [
		'online',
		'dnd',
		'idle'
	];
	let i = 0;
	setInterval(() => {
		if(i >= activities.length) i = 0
		client.user.setActivity(activities[i])
		i++;
	}, 5000);

	let s = 0;
	setInterval(() => {
		if(s >= activities.length) s = 0
		client.user.setStatus(status[s])
		s++;
	}, 30000);
	
		
	console.log(chalk.cyan(`Client Status  • Online`))
});
