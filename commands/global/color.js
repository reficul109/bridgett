const {
  EmbedBuilder: EMBD,
  SlashCommandBuilder: SLAB
} = require('discord.js');

module.exports = {

  checkPaletteRole: true,
  //colorRoleRequired: true,
  checkColorEditable: true,
  //protectColorRole: true,
  warnMultipleEffect: true,
  correctMessageCommand: ('Correct usage is: ' + SLAB.prefix + 'color <hexColor>'),
  //adminCommand: true,

  data: new SLAB()
	.setName('color')
	.setDescription('Color your Custom Role!')
  .addStringOption(option => option.setName('color').setRequired(true).setDescription('Color to Assign to the Role').setMinLength(6).setMaxLength(8))
  .setDMPermission(false),

  async execute(cmd, roles) {
    if (!roles.color || cmd.guild.members.me.roles.cache.get(roles.color)) {
      var name = 'My Color Role';
      var color = (cmd.args ?? cmd.options.getString('color'));
      var position = (cmd.paletteRole.position + 1);
      if (parseInt(color.toString()) === 0 || color === '#000000') {return SLAB.smartReply(cmd, "Discord does not like this Color...")}
      
      var newRole = {name: name, color: color, position: position, permissions: []}
      await cmd.guild.roles.create(newRole).catch(() => {return SLAB.smartReply(cmd, 'Invalid Color (Must be Hexadecimal or Decimal...)')});

      roles.add(cmd.guild.roles.cache.find(role => role.position === position));
      SLAB.smartReply(cmd, {content: 'Role Created!', embeds: [EMBD.colorChip(color, "🎨")]});

    } else {
      var color = (cmd.args ?? cmd.options.getString('color'));
      if (parseInt(color.toString()) === 0 || color === '#000000') {return SLAB.smartReply(cmd, "Discord does not like this Color...")}
      
      await roles.color.setColor(color).catch(() => {return SLAB.smartReply(cmd, 'Invalid Color (Must be Hexadecimal or Decimal...)')})
      SLAB.smartReply(cmd, {content: 'Role Updated!', embeds: [EMBD.colorChip(color, "🎨")]})}
}}