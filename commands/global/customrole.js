const {SlashCommandBuilder: SLAB} = require('discord.js');

module.exports = {

  checkPaletteRole: true,
  //colorRoleRequired: true,
  checkColorEditable: true,
  //protectColorRole: true,
  warnMultipleEffect: true,

  data: new SLAB()
	.setName('customrole')
	.setDescription('Customize your Custom Role!')
  .addStringOption(option => option.setName('name').setDescription('Name to Display in the Role'))
  .addStringOption(option => option.setName('color').setDescription('Color to Assign to the Role').setMinLength(6).setMaxLength(8))
  .setDMPermission(false),

  async execute(cmd, roles) {
    if (!roles.color || cmd.guild.members.me.roles.cache.get(roles.color.id)) {
      var name = (cmd.options.getString('name') ?? 'My Role');
      var color = (cmd.options.getString('color') ?? '#ffffff');
      var position = (cmd.paletteRole.position + 1);

      if (parseInt(color.toString()) === 0 || color === '#000000') {return SLAB.smartReply(cmd, "Discord does not like this Color...")}
      var newRole = {name: name, color: color, position: position, permissions: []}
      await cmd.guild.roles.create(newRole).catch(() => {return SLAB.smartReply(cmd, 'Invalid Color (Must be Hexadecimal or Decimal...)')});

      roles.add(cmd.guild.roles.cache.find(role => role.position === position));
      SLAB.smartReply(cmd, 'Role Created!');

    } else {
      var name = (cmd.options.getString('name') ?? roles.color.name);
      var color = (cmd.options.getString('color') ?? roles.color.color);

      roles.color.setName(name);
      if (parseInt(color.toString()) === 0 || color === '#000000') {SLAB.smartReply(cmd, "Discord does not like this Color...")}
      roles.color.setColor(color).catch(() => {SLAB.smartReply(cmd, 'Invalid Color (Must be Hexadecimal or Decimal...)')})
      SLAB.smartReply(cmd, 'Role Updated!')}
}}