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
    if (!color.startsWith('#')) {color = '#' + color;}
    var harmony = colorEdit(color).harmonies("complementary").map((c) => c.toHex());

    SLAB.smartReply(cmd, {content: 'Displaying Complementary Colors!', 
    embeds: EMBD.paletteEmbeds(harmony, 0, harmony.length), 
    components: ROWS.harmonyUI}).then(function (botReply) {
  
      const collector = channel.createMessageComponentCollector({time: 1800000});
      collector.on('collect', async userReply => {
        if (userReply.user.id != user.id) {return;}
        await userReply.deferUpdate();

        if (userReply.customId === 'HalfRectangle') {
          harmony = colorEdit(color).harmonies('rectangle').map((c) => c.toHex());
          harmony.splice(1, 2);
          botReply.edit({content: 'Displaying Complementary Colors!', 
          embeds: EMBD.paletteEmbeds(harmony, 0, harmony.length)})

        } else {
          harmony = colorEdit(color).harmonies(userReply.customId).map((c) => c.toHex());
          botReply.edit({content: 'Displaying ' + userReply.customId + ' Colors!',
          embeds: EMBD.paletteEmbeds(harmony, 0, harmony.length)})}
      })
    })
}}