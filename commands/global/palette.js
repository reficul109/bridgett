const {SlashCommandBuilder: SLAB} = require("discord.js");

const getColors = require("get-image-colors");

module.exports = {

  //adminCommand: true,
  //correctMessageCommand: "<usage>",
  checkPaletteRole: true, //skipable
  colorRoleRequired: true, //skipable
  checkColorEditable: true, //skipable
  protectColorRole: true, //skipable
  warnMultipleEffect: true,
  skipChecks_disableUI: true,

  data: new SLAB()
	.setName("palette")
  .setDMPermission(false)
	.setDescription("Match your Color and Profile Picture!"),

  async execute(cmd) {
    //Align Behavior for Automatic Executions
    if (cmd.guild) {var user = cmd.member.user, channel = cmd.channel;}
    else {var user = cmd, channel = await user.createDM();}

    getColors(user.displayAvatarURL({extension: "png", forceStatic: true}), {count: 30}).then(colors => {
      SLAB.colorBrowse(cmd, user, channel, colors)
    })
  }
}