const {SlashCommandBuilder: SLAB} = require("discord.js");

module.exports = {

  adminCommand: true,
  correctMessageCommand: ("Correct usage is: " + SLAB.prefix + "eval <code>"),
  //checkPaletteRole: true,
  //colorRoleRequired: true,
  //checkColorEditable: true,
  //protectColorRole: true,
  //warnMultipleEffect: true,
  
  data: new SLAB()
  .setName("eval")
  .setDMPermission(false)
  .setDescription("Pain.")
  .addStringOption(option => option.setName("code").setRequired(true)
  .setDescription("Remeber to use cmd!")),

  async execute(cmd) {
    var code = (cmd.argRes ?? cmd.options.getString("code"));
    await eval(code)
    SLAB.smartReply(cmd, "Done!")
  }
}