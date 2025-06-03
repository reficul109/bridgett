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
	.setDescription('Name your Custom Role!')
  .addStringOption(option => option.setName('name').setRequired(true).setDescription('Name to Display in the Role').setMaxLength(88))
  .setDMPermission(false),

  async execute(cmd, roles) {
    if (!roles.color || cmd.guild.members.me.roles.cache.get(roles.color)) {
      var name = (cmd.args ?? cmd.options.getString('name'));
      var color = '#ffffff';
      var position = (cmd.paletteRole.position + 1);

      var newRole = {name: name, color: color, position: position, permissions: []}
      await cmd.guild.roles.create(newRole);

      roles.add(cmd.guild.roles.cache.find(role => role.position === position));
      SLAB.smartReply(cmd, 'Role Created!');

    } else {
      var name = (cmd.args ?? cmd.options.getString('name'));
      
      roles.color.setName(name);
      SLAB.smartReply(cmd, 'Role Updated!')}
}}