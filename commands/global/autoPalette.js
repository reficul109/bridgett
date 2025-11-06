const {SlashCommandBuilder: SLAB} = require("discord.js");

module.exports = {

  //adminCommand: true,
  //correctMessageCommand: "<usage>", 
  checkPaletteRole: true,
  colorRoleRequired: true,
  checkColorEditable: true,
  protectColorRole: true,
  warnMultipleEffect: true,
  //skipChecks_disableUI: true,

  data: new SLAB()
	.setName("autopalette")
  .setDMPermission(false)
	.setDescription("Enable Automatic Color Recomendations!"),

  async execute(cmd) {
    //Add Role
    if (!cmd.member.roles.cache.get(cmd.paletteRole.id)) {
      cmd.member.roles.add(cmd.paletteRole)
      SLAB.smartReply(cmd, "Role Set!")

    //Remove Role
    } else {
      cmd.member.roles.remove(cmd.paletteRole)
      SLAB.smartReply(cmd, "Role Removed!")}     
  }
}