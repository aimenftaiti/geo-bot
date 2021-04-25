const countries = require("../countries.json");
var players_score;
var cpt;
var countries_selected;
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function sortByValue(jsObj){
    var sortedArray = [];
    for(var i in jsObj)
    {
        sortedArray.push([jsObj[i], i]);
    }
    return sortedArray.sort();
}

function manage(message, keys, cpt){
    if(keys[cpt] != undefined){
        message.channel.send("https://flagcdn.com/256x192/" + keys[cpt] +".png");
    }    
    else {
        message.channel.send("LA PARTIE EST TERMINER BANDE DE PD");
        message.channel.send("VOICI LES SCORES :");
        console.log();
        for (let index = sortByValue(players_score).length - 1; index >= 0; index--) {
            const element = sortByValue(players_score)[index];
            message.channel.send(`<@${element[1]}> a obtenu ${element[0]} points`);
        }
    }
  }

module.exports = {
    name: "geo",
    description: "Faire un petit Géoquizz",
    usage:"new | init | players | pass | response <the answer>",
    guildOnly: true,
    cooldown:1,
    execute(message,args) {   
        if (args[0] === "new") {
            players_score = {}
            const filter = m => m.content.includes('register');
            const collector = message.channel.createMessageCollector(filter, { time: 20000 });
        
            collector.on('collect', m => {
                players_score[m.author.id] = 0;
                m.channel.send(`<@${m.author.id}> s'est inscrit !`);        
            });      

            collector.on('end', () => {
                console.log(players_score);
            });      
        }
        if (args[0] === "players") {
            message.channel.send("Voici la liste des joueurs : \n");
             
            Object.keys(players_score).forEach(function(key) {
                message.channel.send(`<@${key}>`);
            })
        }
            
        if (args[0] === "init") {
            cpt = 0;
            Object.keys(players_score).forEach(function(key) {
                return players_score[key] = 0;
            })
        
            keys = Object.keys(countries); 
            countries_selected = getRandom(keys, 3);
            manage(message, countries_selected, cpt);
        }
        
        if(args[0] === "pass"){
            const filter = (reaction) => {
                return ['👍'].includes(reaction.emoji.name);
            };
            message.awaitReactions(filter, { max: 1, time: 5000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
        
                if (reaction.count >= Object.keys(players_score).length/2) {
                    message.reply('OK TA GAGNER ON VA PASSER');
                    manage(message, countries_selected, ++cpt);
                }
            });    
        }

        else if (countries_selected && args[0] !== "init" && args[0] !== "pass"){
            if(args.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") === countries[countries_selected[cpt]].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")){
                if(message.author.id in players_score){
                    message.reply("Félicitations pédé");
                    players_score[message.author.id] += 1;
                    manage(message, countries_selected, ++cpt);
                }
                else {
                    message.reply("TU JOUES PAS TOI");
                }
            }
            else {
                message.reply("HAHAHA PAS LA BONNE REPONSE CHEH !");
            }
        }            
    }
  };