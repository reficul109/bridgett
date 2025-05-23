const {SlashCommandBuilder: SLAB} = require('discord.js');

module.exports = {

  checkPaletteRole: true,
  checkColorEditable: true,
  warnMultipleEffect: true,

  data: new SLAB()
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

      if (parseInt(color.toString()) === 0 || color === '#000000') {return SLAB.replyOrFollow(interaction, "Discord does not like this Color...")}
      var newRole = {name: name, color: color, position: position, permissions: []}
      await interaction.guild.roles.create(newRole).catch(() => {return SLAB.replyOrFollow(interaction, 'Invalid Color (Must be Hexadecimal or Decimal...)')});

      roles.add(interaction.guild.roles.cache.find(role => role.position === position));
      SLAB.replyOrFollow(interaction, 'Role Created!');

    } else {
      var name = (interaction.options.getString('name') ?? roles.color.name);
      var color = (interaction.options.getString('color') ?? roles.color.color);

      roles.color.setName(name);
      if (parseInt(color.toString()) === 0 || color === '#000000') {SLAB.replyOrFollow(interaction, "Discord does not like this Color...")}
      roles.color.setColor(color).catch(() => {SLAB.replyOrFollow(interaction, 'Invalid Color (Must be Hexadecimal or Decimal...)')})
      SLAB.replyOrFollow(interaction, 'Role Updated!')}
}}