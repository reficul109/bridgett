const {
  SlashCommandBuilder: SLAB, 
  PermissionsBitField: PermissionsBitField
} = require('discord.js');

module.exports = {
  
  data: new SLAB()
  .setName('setup')
  .setDescription('Allow Bridgett to Start Working!')
  .setDMPermission(false),

  async execute(interaction, roles) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {return message.replyOrFollow('**You** do not have Permission to Create New Roles...');}

    if (interaction.paletteRole) {
      return SLAB.replyOrFollow("Your Server Seems to be Set-Up!");
    
    } else {
      var newRole = {name: "🎨 Auto-Palette 🎨", permissions: []}
      await interaction.guild.roles.create(newRole).catch(() => {return message.replyOrFollow('I Need Permission to Create New Roles...');})
      var paletteRole = interaction.guild.roles.cache.find(role => role.name === "🎨 Auto-Palette 🎨")
      SLAB.replyOrFollow({content: 'Your Server is Set-Up!\nI Created a New Role: <@&' + paletteRole.id + '>\nPosition it Wisely, If I Create More Roles, they Will be Above This One!', files: ['./ScreenNewRoles.png']})
    }
}}