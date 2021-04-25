module.exports = {
    name: 'ping',
    cooldown:5,
	description: 'Replies by pinging the user.',
	execute(message) {
		message.reply("Pong! t'es content fdp ?");
	},
};
