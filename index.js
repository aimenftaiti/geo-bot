// Initialisazing vars
const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();
const list = client.guilds.cache.get("568181062367444992"); 
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
console.log(commandFiles);

// Fetch all commands and puts into map
for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
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
  let members = {};
  message.guild.members.fetch()
      .then(member => console.log(members["333713489799544832"] = member.get("333713489799544832").));/*member.forEach((values,keys)=> */   

  if (commandName === 'geo') {
    if (args[0] === "set"){    
       
      message.react('👌');
      const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === '333713489799544832'
      message.awaitReactions(filter, { time: 5000 })
      .then(collected => console.log(`Collected ${collected.size} reactions`))
      .catch(console.error);
      
    }
    
    if (message.content.split(" ")[1] === "init"){
      cpt = 0;
      var HttpClient = function() {
          this.get = function(aUrl, aCallback) {
              var anHttpRequest = new XMLHttpRequest();
              anHttpRequest.onreadystatechange = function() { 
                  if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                      aCallback(anHttpRequest.responseText);
              }
      
              anHttpRequest.open( "GET", aUrl, true );            
              anHttpRequest.send( null );
          }
      };
      var client = new HttpClient();
      client.get('https://flagcdn.com/fr/codes.json', function(response) {
          // do something with response
          countries = JSON.parse(response);
          keys = Object.keys(countries); 
          countries_selected = getRandom(keys, 5);
          manage(message, countries_selected, cpt);
          console.log(countries[countries_selected[cpt]]);
      });
    }
    if(message.content.split(' ')[1] === "response"){
      setTimeout(function(){ 
          console.log();
          if(message.content.split(' ').splice(2).join(' ') === countries[countries_selected[cpt]]){
              message.reply("Félicitations pédé");
              manage(message, countries_selected, ++cpt);
          }
      }, 1000);
    }
  }


  // Debug
  //console.log("ARGS : " + args + "\nCOMMAND : " + command);

  // Cooldowns
  /*if (!cooldowns.has(command.name)) {
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
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);*/

});

client.login(token);
