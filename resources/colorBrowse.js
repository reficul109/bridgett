const {
  ActionRowBuilder: ROWS, 
  EmbedBuilder: EMBD, 
  SlashCommandBuilder: SLAB
} = require("discord.js");

SLAB.colorBrowse = async function(cmd, user, channel, colors) {
  //Find Palette Servers
  var paletteGuilds = cmd.client.guilds.cache.filter(guild => SLAB.filterPalette(cmd, guild, user));
  if (!paletteGuilds.size) {return;}
  var pageLimit = Math.ceil(colors.length / 5) - 1;
  var page = 0;
    
  //Interactive Message
  try {await SLAB.smartReply(cmd, {
  content: "<@" + user.id + ">, Showing " + colors.length + " colors!",  
  embeds: EMBD.paletteEmbeds(colors, page, 5, cmd.isLimited), 
  components: (cmd.isLimited ? ROWS.searchUI : ROWS.paletteUI)}).then(function (botReply) {

    //Filter Message
    SLAB.findCollectorFilter(cmd, botReply)

    //Filtered Collector
    const collector = channel.createMessageComponentCollector({time: 1800000});
    collector.on("collect", async userReply => {
      if (userReply.message.id !== botReply.filterMessage) {return;}
      await userReply.deferUpdate()
      if (userReply.user.id !== user.id) {return;}

      //Actions
      var btn = (parseInt(userReply.customId) || userReply.customId);
      switch (btn) {
        case "+":
          if (page < pageLimit) {
            page++;
            botReply.edit({embeds: EMBD.paletteEmbeds(colors, page, 5, cmd.isLimited)})}
        break;

        case "-":
          if (page > 0) {
            page--;
            botReply.edit({embeds: EMBD.paletteEmbeds(colors, page, 5, cmd.isLimited)})}
        break;

        case "x":
          collector.stop()
          botReply.edit({content: "Cancelled!", embeds: [], components: []})
        break;

        default:
          collector.stop()
          var choice = colors[(page * 5 + btn - 1)].toString();
          paletteGuilds.forEach(guild => guild.members.cache.get(user.id).roles.color.setColor(choice))
          botReply.edit({content: "Done!", embeds: [EMBD.colorChip(choice, "🎨")], components: []})
        break;
      }
    })
  })
} catch {return;}}