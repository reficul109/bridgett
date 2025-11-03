const {SlashCommandBuilder: SLAB} = require("discord.js");

module.exports = {

  //adminCommand: true,
  correctMessageCommand: ("Correct usage is: " + SLAB.prefix + "search <colorName>"),
  checkPaletteRole: true,
  colorRoleRequired: true,
  checkColorEditable: true,
  protectColorRole: true,
  warnMultipleEffect: true,
  skipChecks_disableUI: true,

  data: new SLAB()
  .setName("search")
  .setDMPermission(false)
  .setDescription("Find Named Colors for your Profile Picture!")
  .addStringOption(option => option.setName("color").setRequired(true)
  .setDescription("Color to Search").setMaxLength(88)),

  async execute(cmd) {
    //Find Matches
    var color = (cmd.argRes ?? cmd.options.getString("color")).toLowerCase();    
    var colors = SLAB.colorList.filter(o => o.name.toLowerCase().includes(color)).map(o => o.hex);
    if (!colors.length) {return SLAB.smartReply(cmd, "No matches found...");}

    SLAB.colorBrowse(cmd, cmd.member.user, cmd.channel, colors)
  }
}