const discord = require("discord.js");


module.exports.run = async (client, message, args) => {


    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Sorry, but u cant do that.");
 
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply("Sorry, but i dont have perms.");
 
        if (!args[0]) return message.reply("Please specify a user.");
 
        if (!args[1]) return message.reply("Please specify a reason.");

 
        var banUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
 
        var reason = args.slice(2).join(" ");
 
        if (!banUser) message.reply("Cant find the user.");
 
        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(banUser.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(`** Banned:** ${banUser} (${banUser.id})
            **banned by:** ${message.author}
            **Reason: ** ${reason}`);
 
        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor("Please respond within 30sec.")
            .setDescription(`Do you want to ban ${banUser}?`);
 
 
        message.channel.send(embedPrompt).then(async msg => {

 
            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
 
 
            // We kijken dat het de gebruiker is die het als eerste heeft uitgevoerd.
            // message.channel.awaitMessages(m => m.author.id == message.author.id,
            //     { max: 1, time: 30000 }).then(collected => {
 
            //         if (collected.first().content.toLowerCase() == 'yes') {
            //             message.reply('Kick speler.');
            //         }
            //         else
            //             message.reply('Geanuleerd');
 
            //     }).catch(() => {
            //         message.reply('Geen antwoord na 30 sec, geanuleerd.');
            //     });
 
 
            if (emoji === "✅") {
 
                msg.delete();
 
               
                banUser.ban(reason).catch(err => {
                    if (err) return message.channel.send(`Something went wrong.`);
                });
 
                message.reply(embed);
 
            } else if (emoji === "❌") {
 
                msg.delete(embed);
 
                message.reply("Ban cancelled.").then(m => m.delete(5000));
 
            }
 
        });
    }
 
// Emojis aan teksten kopellen.
async function promptMessage(message, author, time, reactions) {
    // We gaan eerst de tijd * 1000 doen zodat we seconden uitkomen.
    time *= 1000;
 
    // We gaan ieder meegegeven reactie onder de reactie plaatsen.
    for (const reaction of reactions) {
        await message.react(reaction);
    }
 
    // Als de emoji de juiste emoji is die men heeft opgegeven en als ook de auteur die dit heeft aangemaakt er op klikt
    // dan kunnen we een bericht terug sturen.
    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;
 
    // We kijken als de reactie juist is, dus met die filter en ook het aantal keren en binnen de tijd.
    // Dan kunnen we bericht terug sturen met dat icoontje dat is aangeduid.
    return message.awaitReactions(filter, { max: 1, time: time }).then(collected => collected.first() && collected.first().emoji.name);






}





module.exports.help = {
    name: "ban"
}