const {
  ActionRowBuilder: ROWS,
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
  .setDescription('Form your Palette!')
  .addStringOption(option => option.setName('color').setRequired(true).setDescription('Color to Harmonize').setMinLength(6).setMaxLength(7))
  .setDMPermission(false),

  async execute(cmd, roles) {
    var color = (cmd.args ?? cmd.options.getString('color'));
    if (!color.startsWith('#')) {color = '#' + color;}
    var harmony = colorEdit(color).harmonies('complementary').map((c) => c.toHex());

    await SLAB.smartReply(cmd, {content: 'Displaying Complementary Colors!', 
    embeds: EMBD.paletteEmbeds(harmony, 0, harmony.length), 
    components: ROWS.harmonyUI}).then(function (botReply) {
  
      var filterMessage = botReply;
      if (typeof cmd.commandName === 'string') {cmd.fetchReply().then(reply => {filterMessage = reply;})}

      const collector = cmd.channel.createMessageComponentCollector({time: 1800000});
      collector.on('collect', async userReply => {
        if (userReply.message != filterMessage.id) {return;}
        await userReply.deferUpdate()
        if (userReply.user.id != cmd.member.id) {return;}
        
        if (userReply.customId === 'Side-Complementary') {
          harmony = colorEdit(color).harmonies('rectangle').map((c) => c.toHex());
          harmony.splice(1, 2)
        } else {
          harmony = colorEdit(color).harmonies(userReply.customId.toLowerCase()).map((c) => c.toHex());}

        botReply.edit({content: 'Displaying ' + userReply.customId + ' Colors!',
        embeds: EMBD.paletteEmbeds(harmony, 0, harmony.length)})
      })
    })
}}