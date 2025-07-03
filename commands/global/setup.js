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
  .setDMPermission(false)
  .setDescription('Allow Bridgett to Start Working!'),

  async execute(cmd, roles) {
    if (!cmd.member.permissions.has(PBIT.Flags.ManageRoles)) {return SLAB.smartReply(cmd, '**You** do not have Permission to Create New Roles...');}

    if (cmd.paletteRole) {
      SLAB.smartReply(cmd, "Your Server Seems to be Set-Up!")
    
    } else {
      var newRole = {name: "🎨 Auto-Palette 🎨", permissions: []};
      try {await cmd.guild.roles.create(newRole)} catch {return SLAB.smartReply(cmd, 'I Need Permission to Create New Roles...');}
      var paletteRole = cmd.guild.roles.cache.find(role => role.name === "🎨 Auto-Palette 🎨");
      cmd.me.roles.add(paletteRole)

      //FALTAAAAAAAAAA

      SLAB.smartReply(cmd, {content: 'Your Server is Set-Up!\nI Created a New Role: <@&' + paletteRole.id + '>\nPosition it Wisely, If I Create More Roles, they Will be Above This One!', files: ['images/ScreenNewRoles.png']})
    }
}}