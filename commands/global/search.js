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
    //Find Matches
    var color = (cmd.argRes ?? cmd.options.getString("color")).toLowerCase();    
    var colors = SLAB.colorList.filter(o => o.name.toLowerCase().includes(color)).map(o => o.hex);
    if (!colors.length) {return SLAB.smartReply(cmd, "No matches found...");} 

    var pageLimit = Math.ceil(colors.length / 5) - 1;
    var page = 0;

    //Interactive Message
    await SLAB.smartReply(cmd, {content: "Found " + colors.length + " matches!", 
    embeds: EMBD.paletteEmbeds(colors, page, 5), 
    components: ROWS.searchUI}).then(function (botReply) {
  
      //Filter Message
      SLAB.findCollectorFilter(cmd, botReply)
      
      //Filtered Collector
      const collector = cmd.channel.createMessageComponentCollector({time: 1800000});
      collector.on("collect", async userReply => {
        if (userReply.message.id !== botReply.filterMessage) {return;}
        await userReply.deferUpdate()
        if (userReply.user.id !== cmd.member.id) {return;}
        
        //Actions
        var btn = (parseInt(userReply.customId) || userReply.customId);
        switch (btn) {
          case "+":
            if (page < pageLimit) {
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
            botReply.edit({content: "Stopped!", embeds: [], components: []})
          break;
        }
      })
    })
}}