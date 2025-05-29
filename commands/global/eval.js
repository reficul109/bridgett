const {SlashCommandBuilder: SLAB} = require('discord.js');

module.exports = {

  //checkPaletteRole: true,
  //colorRoleRequired: true,
  //checkColorEditable: true,
  //protectColorRole: true,
  //warnMultipleEffect: true,
  correctMessageCommand: ('Correct usage is: ' + SLAB.prefix + 'eval <code>'),
  restrictedCommand: true,
  
  data: new SLAB()
  .setName('eval')
  .setDescription('Pain.')
  .setDMPermission(false),

  async execute(cmd, roles) {
    eval(cmd.args);
    SLAB.smartReply(cmd, 'Done!')
}}