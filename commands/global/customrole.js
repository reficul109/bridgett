const {SlashCommandBuilder} = require('discord.js');

module.exports = {

  checkPaletteRole: true,
  checkColorEditable: true,
  warnMultipleEffect: true,

  data: new SlashCommandBuilder()
	.setName('customrole')
	.setDescription('Customize your Custom Role!')
  .addStringOption(option => option.setName('name').setDescription('Name to Display in the Role'))
  .addStringOption(option => option.setName('color').setDescription('Color to Assign to the Role').setMinLength(6).setMaxLength(8))
  .setDMPermission(false),

  async execute(interaction, roles) {
    if (!roles.color || interaction.guild.members.me.roles.cache.get(roles.color.id)) {
      var name = (interaction.options.getString('name') ?? 'My Role');
      var color = (interaction.options.getString('color') ?? '#ffffff');
      var position = (interaction.paletteRole.position + 1);

      if (parseInt(color.toString()) === 0 || color === '#000000') {return interaction.replyOrFollow("Discord Doesn't Like This Color...")}
      var newRole = {name: name, color: color, position: position, permissions: []}
      await interaction.guild.roles.create(newRole).catch(() => {return interaction.replyOrFollow('Invalid Color (Must be Hexadecimal or Decimal...)')});

      roles.add(interaction.guild.roles.cache.find(role => role.position === position));
      interaction.replyOrFollow('Role Created!');

    } else {
      var name = (interaction.options.getString('name') ?? roles.color.name);
      var color = (interaction.options.getString('color') ?? roles.color.color);

      roles.color.setName(name);
      if (parseInt(color.toString()) === 0 || color === '#000000') {return interaction.replyOrFollow("Discord Doesn't Like This Color...")}
      roles.color.setColor(color).catch(() => {return interaction.replyOrFollow('Invalid Color (Must be Hexadecimal or Decimal...)')})
      interaction.replyOrFollow('Role Updated!')}
  }}