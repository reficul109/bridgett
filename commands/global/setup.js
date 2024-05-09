const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');

module.exports = {
  
  data: new SlashCommandBuilder()
  .setName('setup')
  .setDescription('...')
  .setDMPermission(false),

  async execute(interaction, roles) {
    if (!interaction.member.permission.has(PermissionsBitField.Flags.ManageRoles)) {return message.reply('**You** do not have Permission to Create New Roles...');}

    if (interaction.paletteRole) {
      return interaction.replyOrFollow("Your Server Seems to be Set-Up!")
    
    } else {
      var newRole = {name: "🎨 Auto-Palette 🎨", permissions: []}
      interaction.guilds.roles.create(newRole).catch(() => {return message.reply('I Need Permission to Create New Roles...');})
      var paletteRole = interaction.guilds.roles.cache.find(role => role.name === "🎨 Auto-Palette 🎨")
      roles.add(paletteRole.id);
      interaction.guild.members.me.roles.add(paletteRole.id);
      interaction.reply({content: 'Your Server is Set-Up!\nI Created a New Role: <@&' + paletteRole.id + '>\nPosition it Wisely, If I Create More Roles, they Will be Above This One!>', files: './ScreenNewRoles.png'})
    }
}}