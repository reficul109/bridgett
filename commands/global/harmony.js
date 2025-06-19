const {
  EmbedBuilder: EMBD,
  SlashCommandBuilder: SLAB
} = require('discord.js');

const {
  colord: colorEdit,
  extend: paletteFunc
} = require('colord');

const harmonies = require('colord/plugins/harmonies');
paletteFunc([harmonies])

module.exports = {

  //checkPaletteRole: true,
  //colorRoleRequired: true,
  //checkColorEditable: true,
  //protectColorRole: true,
  //warnMultipleEffect: true,
  correctMessageCommand: ('Correct usage is: ' + SLAB.prefix + 'harmony <hexColor>'),
  //adminCommand: true,

  data: new SLAB()
  .setName('harmony')
  .setDescription('Form your palette!')
  .addStringOption(option => option.setName('color').setRequired(true).setDescription('Color to Harmonize').setMinLength(6).setMaxLength(7))
  .setDMPermission(false),

  async execute(cmd, roles) {
    var color = (cmd.args ?? cmd.options.getString('color'));
    const colors = colorEdit(color).harmonies("analogous").map((c) => c.toHex());
    SLAB.smartReply(cmd, {content: '!!!', embeds: EMBD.paletteEmbeds(colors, 0, 2)})
}}