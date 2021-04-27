
const Discord = require('discord.js');  
const { MessageEmbed, MessageAttachment } = require('discord.js');
const client = new Discord.Client(); 
const config = require('./config.json');
const axios = require('axios').default;
const ytdl = require('ytdl-core');
const fs = require("fs")

var dispatcher = ""

//lancé lorsque le bot est ready
client.on("ready", () => {
    play()
}); 

//methode qui gere les message entré dans le tchat
// client.on('message', async message => {
//     //test si message envoyer par un bot
//     if(message.author.bot) return;
// });

function play()
{
    const channel = client.channels.cache.get(process.env.VOC || config.voc);

    if (!channel) return console.error("The channel does not exist!");

    channel.join().then(connection => {

        console.log("Successfully connected.");
        dispatcher = connection.play( "./pike-e-girl.mp3",{volume: 0.5,});
        
        dispatcher.on('finish', () => {

            play()
    
        });

    }).catch(e => {

        console.error(e);

    });
}

//methode qui gere les message entré dans le tchat
client.on('message', async message => {

    if(message.content == "!reloadEgirl")
    {
        if(message.author.id != administrateur)
        {
            sendMessage("cette commande est reserver a l'administrateur <@"+administrateur+"> !!")
            return;
        }
        message.member.voice.channel.leave();
        play()
    }


    if(message.content == "!parole")
    {
        try {
            message.channel.send(`REFRAIN:

Depuis tout petit je sais que j'aime les E-Girls
J'pourrais les regarder pendant des heures
Jusqu'à c'que j'meurs
Je lui donnerais tout je suis un admirateur (oh oui mon coeur)
Je vais lui faire passer l'aspirateur
Pour moi elle fera tout le dur labeur
t'inquiète pas qu'avec moi elle en passera des heures
Yayaya, Hellsey marie-moi
Yayayaya, Hellsey épouse-moi

1ER COUPLET:

Elle a les cheveux bleus et roses
Un peu comme une gomme
Avec elle la vie n'est plus morose 
Depuis qu'elle efface mes fautes
Elle ressemble à Belle Delphine mais moi ça me dérange pas
Tu sais j'aime ce genre de filles qui vend son eau de bain
Kenne-Kennedy, tu manques mon amie
On se verra au paradis
Toi moi et Billy
Kenne-Kennedy, tu manques mon amie
Depuis que t'es bannie
Zebi zebi zebi zebi

PONT:

Ooooh Hellsey épouse-moi,
Yayaya, 
Ohohohohoh ouais,
Hellsey marie-moi`);
message.channel.send(`
Parole E girl:

REFRAIN:

Depuis tout petit je sais que j'aime les E-Girls
J'pourrais les regarder pendant des heures
Jusqu'à c'que j'meurs
Je lui donnerais tout je suis un admirateur (oh oui mon coeur)
Je vais lui faire passer l'aspirateur
Pour moi elle fera tout le dur labeur
t'inquiète pas qu'avec moi elle en passera des heures
Yayaya, Hellsey marie-moi
Yayayaya, Hellsey épouse-moi

2E COUPLET:

J'suis trop accro à toi comme du cannabis
J'aimerais dire des choses mais j'veux pas finir banni
Donc j'vais dire que t'es belle
Et que j'ai envie de m'étouffer entre tes.. (fesses)
Et vu que j'ai la niaque, j'vais aussi t'exploser ton gros fiak
T'es trop fraîche j'ai envie de te manger comme un steak
Tu es ma planète
Sans toi je n'suis plus un mec

PONT:

Ooooh Hellsey épouse-moi,
Yayaya, 
Ohohohohoh ouais,
Hellsey marie-moi

REFRAIN:

Depuis tout petit je sais que j'aime les E-Girls
J'pourrais les regarder pendant des heures
Jusqu'à c'que j'meurs
Je lui donnerais tout je suis un admirateur (oh oui mon coeur)
Je vais lui faire passer l'aspirateur
Pour moi elle fera tout le dur labeur
t'inquiète pas qu'avec moi elle en passera des heures
Yayaya, Hellsey marie-moi
Yayayaya, Hellsey épouse-moi

Yayaya, Hellsey marie-moi
Yayayaya, Hellsey épouse-moi`)
        } catch (error) {
            console.log(error)
        }
    }
})

//login du bot a discord
client.login(process.env.TOKEN || config.token);