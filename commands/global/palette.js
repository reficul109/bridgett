const {SlashCommandBuilder: SLAB} = require("discord.js");

const getColors = require("get-image-colors");

module.exports = {

  //adminCommand: true,
  //correctMessageCommand: "<usage>",
  checkPaletteRole: true, 
  colorRoleRequired: true,
  checkColorEditable: true,
  protectColorRole: true,
  warnMultipleEffect: true,
  skipChecks_disableUI: true,

  data: new SLAB()
	.setName("palette")
  .setDMPermission(false)
	.setDescription("Match your Color and Profile Picture!")
  .addUserOption(option => option.setName("user").setDescription("Obtain Palette from an User!"))
  .addAttachmentOption(option => option.setName("image").setDescription("Obtain Palette from an Image!")),

  async execute(cmd) {
    //Align Behavior for Automatic Executions
    if (cmd.guild) {var user = cmd.member.user, channel = cmd.channel;}
    else {var user = cmd, channel = await user.createDM();}

    //Select Correct Image (Text)
    if (cmd.content) {
      if (cmd.msgAtt && cmd.attachments.first().height) {image = cmd.msgAtt[0];} 
      else if (cmd.mentions.users) {image = cmd.mentions.users.first().displayAvatarURL({extension: "png", forceStatic: true});}
      else {image = user.displayAvatarURL({extension: "png", forceStatic: true});}}

    //Select Correct Image (Slash)
    else {
      var att = cmd.options.getAttachment("image"), mention = cmd.options.getUser("user");
      if (att.height) {image = att.url;}
      else if (mention) {image = mention.displayAvatarURL({extension: "png", forceStatic: true});}
      else {image = user.displayAvatarURL({extension: "png", forceStatic: true});}}

    getColors(image, {count: 31}).then(colors => {SLAB.colorBrowse(cmd, user, channel, colors)})
  }
}