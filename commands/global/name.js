const {SlashCommandBuilder: SLAB} = require('discord.js');

module.exports = {

  checkPaletteRole: true,
  //colorRoleRequired: true,
  checkColorEditable: true,
  //protectColorRole: true,
  warnMultipleEffect: true,
  correctMessageCommand: ('Correct usage is: ' + SLAB.prefix + 'name <roleName>'),
  //adminCommand: true,

  data: new SLAB()
	.setName('name')
  .setDMPermission(false)
	.setDescription('Name your Custom Role!')
  .addStringOption(option => option.setName('name').setRequired(true)
  .setDescription('Name to Display in the Role').setMaxLength(88)),

  async execute(cmd, roles) {
    var name = (cmd.args ?? cmd.options.getString('name'));

    if (!roles.color || cmd.me.roles.cache.get(roles.color.id)) {
      var color = '#ffffff';
      var position = (cmd.paletteRole.position + 1);

      var newRole = {name: name, color: color, position: position, permissions: []};
      await cmd.guild.roles.create(newRole)

      roles.add(cmd.guild.roles.cache.find(role => role.position === position))
      SLAB.smartReply(cmd, 'Role Created!')

    } else {
      roles.color.setName(name)
      SLAB.smartReply(cmd, 'Role Updated!')
    }
}}