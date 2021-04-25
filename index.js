// Initialisazing vars
const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
console.log(commandFiles);

// Fetch all commands and puts into map
for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  console.log(cmd)
  client.commands.set(cmd.name, cmd);
}

// Starting server
client.on("ready", () => {
  console.log(`Serveur demarre !`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return; // if not starting with &

  // Parameters/args
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  // Name of the command (shift = pop)
  const commandName = args.shift().toLowerCase();

  // Unknown command
  if (!client.commands.has(commandName)) return;

  const command = message.client.commands.get(commandName)
  || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  // Command reserved to DMs
  if (command.guildOnly && message.channel.type === "dm") {
    return message.reply("I can't execute that command inside DMs!");
  }

  // No args
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }


  // Debug
  console.log("ARGS : " + args + "\nCOMMAND : " + command);

  // Cooldowns
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Executing command's code
  try {
    command.execute(message, args);
    console.log(command.description); //debug
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

client.login(token);
