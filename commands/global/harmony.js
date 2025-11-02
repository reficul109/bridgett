const {
  ActionRowBuilder: ROWS,
  EmbedBuilder: EMBD,
  SlashCommandBuilder: SLAB
} = require("discord.js");

const {
  colord: colorEdit,
  extend: paletteFunc
} = require("colord");

const harmonies = require("colord/plugins/harmonies");
paletteFunc([harmonies])

module.exports = {

  //adminCommand: true,
  correctMessageCommand: ("Correct usage is: " + SLAB.prefix + "harmony <hexColor>"),
  //checkPaletteRole: true,
  //colorRoleRequired: true,
  //checkColorEditable: true,
  //protectColorRole: true,
  //warnMultipleEffect: true,

  data: new SLAB()
  .setName("harmony")
  .setDMPermission(false)
  .setDescription("Form your Palette!")
  .addStringOption(option => option.setName("color").setRequired(true)
  .setDescription("Color to Harmonize").setMinLength(6).setMaxLength(7)),

  async execute(cmd) {
    var color = (cmd.argRes ?? cmd.options.getString("color"));
    if (!color.startsWith("#")) {color = "#" + color;}
    var harmony = colorEdit(color).harmonies("complementary").map((c) => c.toHex());

    await SLAB.smartReply(cmd, {content: "Displaying Complementary Colors!", 
    embeds: EMBD.paletteEmbeds(harmony, 0, harmony.length), 
    components: ROWS.harmonyUI}).then(function (botReply) {
  
      //Filter Message
      SLAB.findCollectorFilter(cmd, botReply)
      
      //Filtered Collector
      const collector = cmd.channel.createMessageComponentCollector({time: 1800000});
      collector.on("collect", async userReply => {
        if (userReply.message.id !== botReply.filterMessage) {return;}
        await userReply.deferUpdate()
        if (userReply.user.id !== cmd.member.id) {return;}
        
        if (userReply.customId === "Side-Complementary") {
          harmony = colorEdit(color).harmonies("rectangle").map((c) => c.toHex());
          harmony.splice(1, 2)
          
        } else {
          harmony = colorEdit(color).harmonies(userReply.customId.toLowerCase()).map((c) => c.toHex());}

        botReply.edit({content: "Displaying " + userReply.customId + " Colors!",
        embeds: EMBD.paletteEmbeds(harmony, 0, harmony.length)})
      })
    })
}}