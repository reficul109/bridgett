const {ActionRowBuilder, SlashCommandBuilder} = require('discord.js');
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
    await getColors(interaction.user.displayAvatarURL({extension: 'png', forceStatic: true}), getColors.paletteCount).then(colors => {
    function colorPalette(colors) {return ('<@' + interaction.user.id + '>, Pick a New Color!\nhttps://encycolorpedia.com/' + colors[0 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[1 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[2 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[3 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[4 + (page * 5)].toString().substring(1))}
    interaction.replyOrFollow({content: colorPalette(colors), components: ActionRowBuilder.paletteUI}).then(function (nInteraction) {

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