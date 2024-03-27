const {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder} = require('discord.js');
const getColors = require('get-image-colors');

module.exports = {

  colorRoleRequired: true,
  checkColorEditable: true,
  protectColorRole: true,
  warnMultipleEffect: true,

  data: new SlashCommandBuilder()
	.setName('palette')
	.setDescription('Match your Color and Profile Picture!')
  .addStringOption(option => option.setName('scope').setDescription('Amount of Server Roles to Update').addChoices({name: 'For all Servers', value: 'ForAll'}, {name: 'For this Server', value: 'ForOne'}))
  .setDMPermission(false),

  async execute(interaction, roles) {
    var scope = (interaction.options.getString('scope') ?? 'ForAll');
    if (scope === 'ForOne') {var memberPaletteGuilds = interaction.client.guilds.cache.filter(guild => guild === interaction.guild)}
    else {var memberPaletteGuilds = interaction.client.guilds.cache.filter(guild => guild.members.cache.get(interaction.user.id) && guild.members.cache.get(interaction.user.id).roles.cache.find(role => role.name.startsWith("🎨") && role.name.endsWith("🎨")))}

    var page = 0;
    function colorPalette(colors) {return ('<@' + interaction.user.id + '>, Pick a New Color!\nhttps://encycolorpedia.com/' + colors[0 + (page * 5)] .toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[1 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[2 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[3 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[4 + (page * 5)].toString().substring(1))}

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

    await getColors(interaction.user.displayAvatarURL({extension: 'png', forceStatic: true}), getColors.paletteColorOptions).then(colors => {
    interaction.replyOrFollow({content: colorPalette(colors), components: [colorRow, optionRow]}).then(function (nInteraction) {

      const collector = interaction.channel.createMessageComponentCollector({time: 1800000});
      collector.on('collect', async cInteraction => {
        if (cInteraction.member.id != interaction.user.id) {return;}
        await cInteraction.deferUpdate();

        var btn = (parseInt(cInteraction.customId) || cInteraction.customId);
        switch (btn) {
          case '+':
            if (page < 4) {
              page++;
              nInteraction.edit(colorPalette(colors))}
          break;

          case '-':
            if (page > 0) {
              page--;
              nInteraction.edit(colorPalette(colors))}
          break;

          case 'x':
            collector.stop();
            nInteraction.edit({content: ('Cancelled!'), components: []});
          break;

          default:
            collector.stop();
            memberPaletteGuilds.forEach(guild => guild.members.cache.get(interaction.user.id).roles.color.setColor(colors[(btn + (page * 5) - 1)].toString()));
            nInteraction.edit({content: (colors[(btn + (page * 5) - 1)] + ' Selected!'), components: []});
          break;}
        })
    })})
  }}