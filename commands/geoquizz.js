var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var cpt;
var countries_selected;
var countries;
var players_list = [];
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

function manage(message, keys, cpt){
    if(keys[cpt] != undefined){
        message.channel.send("https://flagcdn.com/256x192/" + keys[cpt] +".png");
    }    
    else {
        message.channel.send("LA PARTIE EST TERMINER BANDE DE PD");
    }
}

module.exports = {
    name: "geo",
    description: "faire un géoquizz",
    guildOnly: true,
    cooldown:5,
    execute(message) {       
        if (message.content.split(" ")[1] === "set"){
            
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
    },
  };