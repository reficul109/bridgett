const {
  SlashCommandBuilder: SLAB, 
  PermissionsBitField: PBIT
} = require('discord.js');

module.exports = {

  //checkPaletteRole: true,
  //colorRoleRequired: true,
  //checkColorEditable: true,
  //protectColorRole: true,
  //warnMultipleEffect: true,
  //correctMessageCommand: '<usage>',
  //adminCommand: true,
  
  data: new SLAB()
  .setName('setup')
  .setDescription('Allow Bridgett to Start Working!')
  .setDMPermission(false),

  async execute(cmd, roles) {
    if (!cmd.member.permissions.has(PBIT.Flags.ManageRoles)) {return SLAB.smartReply(cmd, '**You** do not have Permission to Create New Roles...');}

    if (cmd.paletteRole) {
      return SLAB.smartReply(cmd, "Your Server Seems to be Set-Up!");
    
    } else {
      var newRole = {name: "🎨 Auto-Palette 🎨", permissions: []}
      await cmd.guild.roles.create(newRole).catch(() => {return SLAB.smartReply(cmd, 'I Need Permission to Create New Roles...');})
      var paletteRole = cmd.guild.roles.cache.find(role => role.name === "🎨 Auto-Palette 🎨")
      cmd.guild.members.me.roles.add(paletteRole)
      SLAB.smartReply(cmd, {content: 'Your Server is Set-Up!\nI Created a New Role: <@&' + paletteRole.id + '>\nPosition it Wisely, If I Create More Roles, they Will be Above This One!', files: ['./ScreenNewRoles.png']})
    }
}}