const { prefix } = require("../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "Help",
  cooldown: 3,
  execute(message) {
    const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Mode d'emploi GéoBot`)
    .setDescription("**Usage :** &geo new | init | players | pass | response <the answer>")
    .addField(`New`, `Créé une partie, et enregistre des joueurs, vous avez 20 secondes pour envoyer *register* ici`, true)
    .addField(`Init`, `Lance la partie avec 5 drapeaux au hasard`, true)
    .addField(`Players`, `Affiche les joueurs de la partie `, true)
    .addField(`Pass`, `Lance un vote pour passer le tour`, true)
    .addField(`Answer`, `Permet d'envoyer une réponse`, true)
    .setThumbnail('https://kgames.fr/games/icons/geoquizz.jpg')
    .setTimestamp()

    message.channel.send(exampleEmbed);
  },
};
