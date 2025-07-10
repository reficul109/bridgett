const {
  ActionRowBuilder: ROWS, 
  EmbedBuilder: EMBD, 
  SlashCommandBuilder: SLAB
} = require("discord.js");

const getColors = require("get-image-colors");

module.exports = {

  //adminCommand: true,
  //correctMessageCommand: "<usage>",
  checkPaletteRole: true,
  colorRoleRequired: true,
  checkColorEditable: true,
  protectColorRole: true,
  warnMultipleEffect: true,

  data: new SLAB()
	.setName("palette")
  .setDMPermission(false)
	.setDescription("Match your Color and Profile Picture!")
  .addStringOption(option => option.setName("scope")
  .setDescription("Amount of Server Roles to Update").addChoices(
    {name: "For all Servers", value: "All"}, 
    {name: "For this Server", value: "One"})),

  async execute(cmd, roles) {
    //Align Behavior for Automatic Executions
    if (cmd.guild) {var user = cmd.member.user, channel = cmd.channel;}
    else {var user = cmd, channel = await user.createDM();}

    //Area of Effect
    var scope = (cmd.args ?? cmd.options.getString("scope") ?? "All").toLowerCase();
    var paletteGuilds = cmd.client.guilds.cache;
    if (scope.includes("one")) {paletteGuilds = paletteGuilds.filter(guild => guild === cmd.guild);}
    else {paletteGuilds = paletteGuilds.filter(guild => SLAB.filterPalette(cmd, guild, user));}
    
    if (!paletteGuilds.size) {return;}

    var page = 0;
    await getColors(user.displayAvatarURL({extension: "png", forceStatic: true}), {count: 30}).then(async colors => {
    try {await SLAB.smartReply(cmd, {content: "<@" + user.id + ">, Pick a New Color!",     
    embeds: EMBD.paletteEmbeds(colors, page, 5), 
    components: ROWS.paletteUI}).then(function (botReply) {

      //Filter Message
      SLAB.componentFilter(cmd, botReply)

      //Filtered Collector
      const collector = channel.createMessageComponentCollector({time: 1800000});
      collector.on("collect", async userReply => {
        if (userReply.message.id !== botReply.filterMessage) {return;}
        await userReply.deferUpdate()
        if (userReply.user.id !== user.id) {return;}

        var btn = (parseInt(userReply.customId) || userReply.customId);
        switch (btn) {
          case "+":
            if (page < 4) {
              page++;
              botReply.edit({embeds: EMBD.paletteEmbeds(colors, page, 5)})}
          break;

          case "-":
            if (page > 0) {
              page--;
              botReply.edit({embeds: EMBD.paletteEmbeds(colors, page, 5)})}
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