const {SlashCommandBuilder} = require('discord.js');

module.exports = {

  colorRoleRequired: true,
  checkColorEditable: true,
  protectColorRole: true,
  warnMultipleEffect: true, 

  data: new SlashCommandBuilder()
	.setName('autopalette')
	.setDescription('Enable Automatic Color Recomendations!')
  .setDMPermission(false),

  async execute(interaction, roles) {
    var paletteRole = await interaction.guild.roles.cache.find(role => role.name.startsWith("🎨") && role.name.endsWith("🎨"));
    if (paletteRole) {
      if (!roles.cache.find(role => role.id === paletteRole.id)) {
        roles.add(paletteRole.id);
        interaction.replyOrFollow('Set!')

      } else {
        roles.remove(paletteRole.id);
        interaction.replyOrFollow('Removed!')}}

    else {interaction.replyOrFollow('There is no Auto-Palette Role in this Server... (/help)')}}}