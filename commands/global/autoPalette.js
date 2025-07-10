const {SlashCommandBuilder: SLAB} = require("discord.js");

module.exports = {

  //adminCommand: true,
  //correctMessageCommand: "<usage>", 
  checkPaletteRole: true,
  colorRoleRequired: true,
  checkColorEditable: true,
  protectColorRole: true,
  warnMultipleEffect: true,

  data: new SLAB()
	.setName("autopalette")
  .setDMPermission(false)
	.setDescription("Enable Automatic Color Recomendations!"),

  async execute(cmd, roles) {
    if (!roles.cache.get(cmd.paletteRole.id)) {
      roles.add(cmd.paletteRole)
      SLAB.smartReply(cmd, "Role Set!")

    } else {
      roles.remove(cmd.paletteRole)
      SLAB.smartReply(cmd, "Role Removed!")}     
}}