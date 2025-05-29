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
  .addStringOption(option => option.setName('code').setRequired(true))
  .setDMPermission(false),

  async execute(cmd, roles) {
    var code = (cmd.args ?? cmd.options.getString('code'));
    eval(code);
    SLAB.smartReply(cmd, 'Done!')
}}