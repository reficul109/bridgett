const {SlashCommandBuilder: SLAB} = require('discord.js');

module.exports = {

  checkPaletteRole: true,
  colorRoleRequired: true,
  checkColorEditable: true,
  protectColorRole: true,
  warnMultipleEffect: true,
  //correctMessageCommand: '<usage>',
  //adminCommand: true, 

  data: new SLAB()
	.setName('autopalette')
	.setDescription('Enable Automatic Color Recomendations!')
  .setDMPermission(false),

  async execute(cmd, roles) {
    if (!roles.cache.find(role => role.id === cmd.paletteRole.id)) {
      roles.add(cmd.paletteRole);
      SLAB.smartReply(cmd, 'Role Set!')

    } else {
      roles.remove(cmd.paletteRole);
      SLAB.smartReply(cmd, 'Role Removed!')}     
}}