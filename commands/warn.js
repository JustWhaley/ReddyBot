const discord = require("discord.js");


module.exports.run = async (client, message, args) => {

    const warns = JSON.parse(fs.readFileSync("./warning.json", "utf8"));
      const args = message.content.slice(prefix.length).split(/ +/);

      // Nakijken als deze persoon wel toestemming heeft om dit te kunnen doen.
      if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, but u cant do that.");
 
      // Nakijken als er een gebruiker is meegegeven.
      if (!args[0]) return message.reply("Please specify a user.");
 
      // Nakijken als er een redenen is meegegeven.
      if (!args[1]) return message.reply("Please specify a reason.");
 
      // Nakijken als de bot perms heeft.
      if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, but i dont have perms.");
 
      // User ophalen.
      var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
 
      // Redenen aan elkaar koppelen die met een spatie zijn gesplitst.
      var reason = args.slice(1).join(" ");
 
      // Nakijken als de user kan gevonden worden.
      if (!kickUser) return message.reply("Kan de gebruiker niet vinden.");
 
      // Nakijken als je geen staff waarschuwt.
      if (kickUser.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, but u cant warn a staff member.");
 
      // We gaan kijken als deze user nog geen warns heeft.
      // Heeft deze er geen dan maken we eentje aan met 0 waarschuwingen in het bestand.
      if (!warns[kickUser.id]) warns[kickUser.id] = {
        warns: 0
      };
 
      // Toevoegen van een waarschuwing.
      warns[kickUser.id].warns++;
 
      // Document updaten.
      fs.writeFile("./warning.json", JSON.stringify(warns), (err) => {
        if (err) console.log(err);
      });
 
      var embed = new discord.MessageEmbed()
        .setColor("#ff0000")
        .setFooter(message.member.displayName, message.author.displayAvatarURL)
        .setTimestamp()
        .setDescription(`**Warned: ** ${kickUser} (${kickUser.id})
        **Warned by: ** ${message.author}
        **Reason: ** ${reason}`)
        .addField("Amount of warns: ", warns[kickUser.id].warns);
 
      // Kanaal opzoeken.
      const channel = message.member.guild.channels.cache.get('725849681136975944');
 
      if (!channel) return;
 
      channel.send(embed);

      message.channel.send(message.author.toString() + " has warned " + args[1].toString());
 
      // Als 3 waarschuwingen doe dan iets.
      if (warns[kickUser.id].warns == 3) {
 
        var mes = new discord.MessageEmbed()
            .setDescription("WATCH OUT " + kickUser)
            .setColor("#ee0000")
            .addField("Message: ", "1 warn remaining. and then u get a ban!!");
 
            message.channel.send(mes);
 
    } else if (warns[kickUser.id].warns == 4) {

        message.guild.member(kickUser).ban(reason);
        message.channel.send(`${kickUser} got banned because they had to many warns`);
 
    }



}





module.exports.help = {
    name: "warn"
}