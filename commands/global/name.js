const {SlashCommandBuilder: SLAB} = require("discord.js");

module.exports = {

  //adminCommand: true,
  correctMessageCommand: ("Correct usage is: " + SLAB.prefix + "name <roleName>"),
  checkPaletteRole: true,
  //colorRoleRequired: true,
  checkColorEditable: true,
  //protectColorRole: true,
  warnMultipleEffect: true,

  data: new SLAB()
	.setName("name")
  .setDMPermission(false)
	.setDescription("Name your Custom Role!")
  .addStringOption(option => option.setName("name").setRequired(true)
  .setDescription("Name to Display in the Role").setMaxLength(88)),

  async execute(cmd) {
    var name = (cmd.argRes ?? cmd.options.getString("name"));

    //New Role Properties
    if (!cmd.color || cmd.me.roles.cache.get(cmd.color.id)) {
      var color = "#ffffff", position = (cmd.paletteRole.position + 1);
      var newRole = {name: name, color: color, position: position, permissions: []};
      await cmd.guild.roles.create(newRole)

      //Protect New Role
      cmd.member.roles.add(cmd.guild.roles.cache.find(role => role.position === position))
      SLAB.smartReply(cmd, "Role Created!")

    //Role Updates
    } else {
      cmd.color.setName(name)
      SLAB.smartReply(cmd, "Role Updated!")
    }
  }
}