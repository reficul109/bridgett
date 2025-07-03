const {SlashCommandBuilder: SLAB} = require('discord.js');

module.exports = {

  //checkPaletteRole: true,
  //colorRoleRequired: true,
  //checkColorEditable: true,
  //protectColorRole: true,
  //warnMultipleEffect: true,
  correctMessageCommand: ('Correct usage is: ' + SLAB.prefix + 'eval <code>'),
  adminCommand: true,
  
  data: new SLAB()
  .setName('eval')
  .setDMPermission(false)
  .setDescription('Pain.')
  .addStringOption(option => {option.setName('code').setRequired(true)
  .setDescription('Remeber to use "cmd"!')}),

  async execute(cmd, roles) {
    var code = (cmd.args ?? cmd.options.getString('code'));
    await eval(code)
    SLAB.smartReply(cmd, 'Done!')
}}