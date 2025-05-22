const {SlashCommandBuilder: SLAB} = require('discord.js');

module.exports = {

  checkPaletteRole: true,
  colorRoleRequired: true,
  checkColorEditable: true,
  protectColorRole: true,
  warnMultipleEffect: true, 

  data: new SLAB()
	.setName('autopalette')
	.setDescription('Enable Automatic Color Recomendations!')
  .setDMPermission(false),

  async execute(interaction, roles) {
    if (!roles.cache.find(role => role.id === interaction.paletteRole.id)) {
      roles.add(interaction.paletteRole.id);
      SLAB.replyOrFollow('Role Set!')

    } else {
      roles.remove(interaction.paletteRole.id);
      SLAB.replyOrFollow('Role Removed!')}     
}}