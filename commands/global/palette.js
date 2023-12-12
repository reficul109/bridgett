const {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder} = require('discord.js');
const getColors = require('get-image-colors');

module.exports = {

  data: new SlashCommandBuilder()
	  .setName('palette')
	  .setDescription('Match Your Color and Profile Picture!')
    .setDMPermission(false),

  async execute(interaction) {
    var roles = interaction.member.roles;
    if (roles.color.id === "1182907738708258916") {return interaction.reply('You need a custom role first! (/role)');}
    
    var pagina = 0;
    const colorOptions = {count: 30}
    function colorPalette(colors) {return ('<@' + interaction.user.id + '>, Pick a New Color!\nhttps://encycolorpedia.com/' + colors[0 + (pagina * 5)] .toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[1 + (pagina * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[2 + (pagina * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[3 + (pagina * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[4 + (pagina * 5)].toString().substring(1))}

    const more = new ButtonBuilder().setCustomId('+').setEmoji('➕').setStyle(ButtonStyle.Success);
    const less = new ButtonBuilder().setCustomId('-').setEmoji('➖').setStyle(ButtonStyle.Success);
    const none = new ButtonBuilder().setCustomId('x').setEmoji('✖️').setStyle(ButtonStyle.Danger);

    const color1 = new ButtonBuilder().setCustomId('1').setEmoji('1️⃣').setStyle(ButtonStyle.Primary);
    const color2 = new ButtonBuilder().setCustomId('2').setEmoji('2️⃣').setStyle(ButtonStyle.Primary);
    const color3 = new ButtonBuilder().setCustomId('3').setEmoji('3️⃣').setStyle(ButtonStyle.Primary);
    const color4 = new ButtonBuilder().setCustomId('4').setEmoji('4️⃣').setStyle(ButtonStyle.Primary);
    const color5 = new ButtonBuilder().setCustomId('5').setEmoji('5️⃣').setStyle(ButtonStyle.Primary);

    const colorRow = new ActionRowBuilder().addComponents(color1, color2, color3, color4, color5);
    const optionRow = new ActionRowBuilder().addComponents(more, less, none);

    await getColors(interaction.user.displayAvatarURL({extension: 'png', forceStatic: true}), colorOptions).then(colors => {
    interaction.reply({content: colorPalette(colors), components: [colorRow, optionRow]}).then(function (nInteraction) {

      const collector = interaction.channel.createMessageComponentCollector({time: 1800000});
      collector.on('collect', async cInteraction => {
        if(cInteraction.member.id != interaction.user.id) {return;}
        await cInteraction.deferUpdate();

        var btn = (parseInt(cInteraction.customId) || cInteraction.customId);
        switch (btn) {

          case '+':
            if (pagina < 4) {
              pagina++;
              nInteraction.edit(colorPalette(colors))}
          break;

          case '-':
            if (pagina > 0) {
              pagina--;
              nInteraction.edit(colorPalette(colors))}
          break;

          case 'x':
            collector.stop();
            nInteraction.edit({content: ('Cancelled!'), components: []});
          break;

          default:
            await roles.color.setColor(colors[(btn + (pagina * 5) - 1)].toString());
            collector.stop();
            nInteraction.edit({content: (colors[(btn + (pagina * 5) - 1)] + ' Selected!'), components: []});
          break;}
        })
    })})
  }}