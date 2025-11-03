const {
  ActionRowBuilder: ROWS, 
  EmbedBuilder: EMBD, 
  SlashCommandBuilder: SLAB
} = require("discord.js");

const getColors = require("get-image-colors");

module.exports = {

  //adminCommand: true,
  //correctMessageCommand: "<usage>",
  checkPaletteRole: true, //skipable
  colorRoleRequired: true, //skipable
  checkColorEditable: true, //skipable
  protectColorRole: true, //skipable
  warnMultipleEffect: true,
  
  //
  skipChecks_disableUI: true,
  //

  data: new SLAB()
	.setName("palette")
  .setDMPermission(false)
	.setDescription("Match your Color and Profile Picture!"),

  async execute(cmd) {
    //Align Behavior for Automatic Executions
    if (cmd.guild) {var user = cmd.member.user, channel = cmd.channel;}
    else {var user = cmd, channel = await user.createDM();}

    //Find Palette Servers
    var paletteGuilds = cmd.client.guilds.cache.filter(guild => SLAB.filterPalette(cmd, guild, user));
    if (!paletteGuilds.size) {return;}
    var page = 0;

    //Interactive Message
    await getColors(user.displayAvatarURL({extension: "png", forceStatic: true}), {count: 30}).then(async colors => {
    try {await SLAB.smartReply(cmd, {content: "<@" + user.id + ">, Pick a New Color!",     
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
            if (page < 4) {
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
            var choice = colors[(btn + (page * 5) - 1)].toString();
            paletteGuilds.forEach(guild => guild.members.cache.get(user.id).roles.color.setColor(choice))
            botReply.edit({content: "Done!", embeds: [EMBD.colorChip(choice, "🎨")], components: []})
          break;
        }
      })
    })
  } catch {return;}})
}}