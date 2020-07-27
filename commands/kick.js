const discord = require("discord.js")



module.exports.run = async (client, message, args) => {



if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, but u cant do that.");
 
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, but i dont have perms.");
 
        if (!args[1]) return message.reply("Please specify a user.");
 
        if (!args[2]) return message.reply("Please specify a reason.");
 
        var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
 
        var reason = args.slice(2).join(" ");
 
        if (!kickUser) return message.reply("Cant find the user.");
 
        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(kickUser.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(`** Kicked:** ${kickUser} (${kickUser.id})
            **Kicked by:** ${message.author}
            **Reason: ** ${reason}`);
 
        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor("Please respond within 30sec.")
            .setDescription(`Do you want to kick ${kickUser}?`);
 
 
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
 
                kickUser.kick(reason).catch(err => {
                    if (err) return message.channel.send(`Something went wrong.`);
                });
 
                message.reply(embed);
 
            } else if (emoji === "❌") {
 
                msg.delete();
 
                message.reply("Kick cancelled.").then(m => m.delete(5000));
 
            } 
               });
            }
module.exports.help = {
    name: "kick"
}