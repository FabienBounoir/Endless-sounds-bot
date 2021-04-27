
const Discord = require('discord.js');  
const { MessageEmbed, MessageAttachment } = require('discord.js');
const client = new Discord.Client(); 
const config = require('./config.json');
const axios = require('axios').default;
const ytdl = require('ytdl-core');
const fs = require("fs")
const mongoose = require('mongoose');
var ComptePlayEgirl = require('./model/ComptePlayEgirl.js');

var administrateur= process.env.ADMINISTRATEUR || config.administrateur 
var userDB = process.env.USERDB || config.UserDB;
var passwordDB = process.env.PASSWORDDB || config.PasswordDB;

var dispatcher = ""

const url = "mongodb+srv://"+ userDB +":"+ passwordDB +"@cluster0.s8x9g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"; 

mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
});

//lancé lorsque le bot est ready
client.on("ready", () => {
    client.user.setPresence({
        status: 'online',
            activity: {
                name: 'du Egirl de Pike',
                type: 'STREAMING',
                url: 'https://www.youtube.com/watch?v=nvYi3XlP8sk'
            }
    })
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

            ajoutPlay()
            play()
    
        });

    }).catch(e => {

        console.error(e);

    });
}

//ajouté +1 quand la musique se fini
function ajoutPlay()
{
    //Recuperation channel disponible dans la BDD
    ComptePlayEgirl.find().exec((erreur, playCount) => {

        if (erreur) return console.error(err);

        if(playCount.length == 0)
        {
            const addComptePlayEgirl = new ComptePlayEgirl({
                nombrePlay: 1
            });

            addComptePlayEgirl.save((err) => {
                if (err) return console.error(err);
            });
        }
        else
        {
            var newvalues = {nombrePlay: playCount[0].nombrePlay + 1 };

            ComptePlayEgirl.updateOne(playCount[0], newvalues, function(err, res) {
                if (err) throw err;
            });

        }
    });
}

//convertir le nombre de seconde en Heure / minute / seconde 
function format(time) {   
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

//methode qui gere les message entré dans le tchat
client.on('message', async message => {

    //commande qui renvoie des stats sur le bot (nbplay / nbTime)
    if(message.content == "!statEgirl")
    {
        ComptePlayEgirl.find().exec((erreur, playCount) => {
            if (erreur) return console.error(err);
    
            const XpEmbed = new MessageEmbed()
                .setColor('#f372ff')
                .setTitle('Nombres de play Egirl Pike')
                .setURL('https://www.youtube.com/watch?v=nvYi3XlP8sk')
                .setDescription("**Nb Play: " + playCount[0].nombrePlay + "**")
                .addField('Équivalant à **' + format(playCount[0].nombrePlay * 209) + "**", '\u200B', true)
                .setTimestamp()
                .setFooter('Bot crée par BadbounsTV', 'https://media.discordapp.net/attachments/815030909010444318/822519435268718613/miniLogoRGB.gif');
            
                message.channel.send(XpEmbed)
        })
    }

    //commande qui reload le bot
    if(message.content == "!reloadEgirl")
    {
        if(message.author.id != administrateur)
        {
            message.channel.send("cette commande est reserver a l'administrateur <@"+administrateur+"> !!")
            return;
        }
        else
        {

            setTimeout(() => {
                play();
            }, 2000);

            message.member.voice.channel.leave();
            message.channel.send("Reload En Cours...")
            dispatcher = "";
        }
    }

    //commande qui nous donne les paroles de la musique
    if(message.content == "!paroleEgirl")
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