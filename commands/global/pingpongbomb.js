const {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder} = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()
  .setName('pingpongbomb')
  .setDescription('Jjj...')
  .setDMPermission(false),

  async execute(interaction, roles) {

    //Ping Pong UI
    const pong = new ButtonBuilder().setCustomId('p').setStyle(ButtonStyle.Success).setEmoji('🏓');
    const bomb = new ButtonBuilder().setCustomId('b').setStyle(ButtonStyle.Success).setEmoji('💣');
    const gold = new ButtonBuilder().setCustomId('g').setStyle(ButtonStyle.Success).setEmoji('881382652488343603');
    const none = new ButtonBuilder().setCustomId('n').setStyle(ButtonStyle.Success);

    const test1 = new ActionRowBuilder().addComponents(pong);
    const test2 = new ActionRowBuilder().addComponents(bomb);

    var safes = ["1", "2", "3", "4", "5"], traps = ["6", "7", "8", "9", "0"];
    interaction.replyOrFollow({content: 'Game Start!', components: [test1]}).then(function (nInteraction) {

      const collector = interaction.channel.createMessageComponentCollector({time: 1800000});
      collector.on('collect', async cInteraction => {
        if (cInteraction.member.id != interaction.user.id) {return;}
        console.log(cInteraction);

        await cInteraction.deferUpdate();

        if (cInteraction.customId === 'd') {
          if (safes.some(word => cInteraction.id.endsWith(word))) {
            nInteraction.edit({components: [test1]})}

          else if (traps.some(word => cInteraction.id.endsWith(word))) {
            nInteraction.edit({components: [test2]})}

        } else if ((cInteraction.customId === 'b')) {
            nInteraction.edit({content: (':('), components: []})
        }

      })  
    })
}}