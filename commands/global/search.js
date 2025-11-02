const {
  ActionRowBuilder: ROWS,
  EmbedBuilder: EMBD,
  SlashCommandBuilder: SLAB
} = require("discord.js");

module.exports = {

  //adminCommand: true,
  correctMessageCommand: ("Correct usage is: " + SLAB.prefix + "search <colorName>"),
  //checkPaletteRole: true,
  //colorRoleRequired: true,
  //checkColorEditable: true,
  //protectColorRole: true,
  //warnMultipleEffect: true,

  data: new SLAB()
  .setName("search")
  .setDMPermission(false)
  .setDescription("Find Named Colors!")
  .addStringOption(option => option.setName("color").setRequired(true)
  .setDescription("Color to Search").setMaxLength(88)),

  async execute(cmd) {
    var color = (cmd.argRes ?? cmd.options.getString("color"));    
    var colors = SLAB.colorObjects.filter(named => named.includes(color)).map(named => named.hex);

    if (!colors.length) {return SLAB.smartReply(cmd, "No matches found...");}
    var page = 0, pageLimit = Math.ceil(colors.length / 5);

    await SLAB.smartReply(cmd, {content: "Displaying Complementary Colors!", 
    embeds: EMBD.paletteEmbeds(colors, page, 5), 
    components: ROWS.harmonyUI}).then(function (botReply) {
  
      //Filter Message
      SLAB.findCollectorFilter(cmd, botReply)
      
      //Filtered Collector
      const collector = cmd.channel.createMessageComponentCollector({time: 1800000});
      collector.on("collect", async userReply => {
        if (userReply.message.id !== botReply.filterMessage) {return;}
        await userReply.deferUpdate()
        if (userReply.user.id !== cmd.member.id) {return;}
        
        if (userReply.customId === "+") {
          if (page < pageLimit) {page++;}}

        if (userReply.customId === "-") {
          if (page > 0) {page--;}}

        botReply.edit({embeds: EMBD.paletteEmbeds(colors, page, 5)})
      })
    })
}}