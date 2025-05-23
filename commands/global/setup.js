const {
  SlashCommandBuilder: SLAB, 
  PermissionsBitField: PBIT
} = require('discord.js');

module.exports = {
  
  data: new SLAB()
  .setName('setup')
  .setDescription('Allow Bridgett to Start Working!')
  .setDMPermission(false),

  async execute(interaction, roles) {
    if (!interaction.member.permissions.has(PBIT.Flags.ManageRoles)) {return SLAB.replyOrFollow(interaction, '**You** do not have Permission to Create New Roles...');}

    if (interaction.paletteRole) {
      return SLAB.replyOrFollow(interaction, "Your Server Seems to be Set-Up!");
    
    } else {
      var newRole = {name: "🎨 Auto-Palette 🎨", permissions: []}
      await interaction.guild.roles.create(newRole).catch(() => {return SLAB.replyOrFollow(interaction, 'I Need Permission to Create New Roles...');})
      var paletteRole = interaction.guild.roles.cache.find(role => role.name === "🎨 Auto-Palette 🎨")
      SLAB.replyOrFollow(interaction, {content: 'Your Server is Set-Up!\nI Created a New Role: <@&' + paletteRole.id + '>\nPosition it Wisely, If I Create More Roles, they Will be Above This One!', files: ['./ScreenNewRoles.png']})
    }
}}