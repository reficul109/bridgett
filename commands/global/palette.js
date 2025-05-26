const {
  ActionRowBuilder: ROWS, 
  EmbedBuilder: EMBD, 
  SlashCommandBuilder: SLAB
} = require('discord.js');
const getColors = require('get-image-colors');

module.exports = {

  checkPaletteRole: true,
  colorRoleRequired: true,
  checkColorEditable: true,
  protectColorRole: true,
  warnMultipleEffect: true,

  data: new SLAB()
	.setName('palette')
	.setDescription('Match your Color and Profile Picture!')
  .addStringOption(option => option.setName('scope').setDescription('Amount of Server Roles to Update').addChoices({name: 'For all Servers', value: 'ForAll'}, {name: 'For this Server', value: 'ForOne'}))
  .setDMPermission(false),

  async execute(cmd, roles) {
    var scope = (cmd.options.getString('scope') ?? 'ForAll');
    if (scope === 'ForOne') {var memberPaletteGuilds = cmd.client.guilds.cache.filter(guild => guild === cmd.guild)}
    else {var memberPaletteGuilds = cmd.client.guilds.cache.filter(guild => guild.members.cache.get(cmd.user.id) && guild.members.cache.get(cmd.user.id).roles.cache.find(role => role.name.startsWith("🎨") && role.name.endsWith("🎨")))}
   
    var page = 0;
    await getColors(cmd.user.displayAvatarURL({extension: 'png', forceStatic: true}), getColors.paletteCount).then(colors => {
    SLAB.smartReply(cmd, {content: '<@' + cmd.user.id + '>, Pick a New Color!', embeds: EMBD.paletteEmbeds(colors, page), components: ROWS.paletteUI}).then(function (botReply) {

      const collector = cmd.channel.createMessageComponentCollector({time: 1800000});
      collector.on('collect', async userReply => {
        if (userReply.user.id != cmd.user.id) {return;}
        await userReply.deferUpdate();

        var btn = (parseInt(userReply.customId) || userReply.customId);
        switch (btn) {
          case '+':
            if (page < 4) {
              page++;
              botReply.edit({embeds: EMBD.paletteEmbeds(colors, page)})}
          break;

          case '-':
            if (page > 0) {
              page--;
              botReply.edit({embeds: EMBD.paletteEmbeds(colors, page)})}
          break;

          case 'x':
            collector.stop();
            botReply.edit({content: ('Cancelled!'), embeds: [], components: []})
          break;

          default:
            collector.stop();
            memberPaletteGuilds.forEach(guild => guild.members.cache.get(cmd.user.id).roles.color.setColor(colors[(btn + (page * 5) - 1)].toString()));
            botReply.edit({content: (colors[(btn + (page * 5) - 1)] + ' Selected!'), embeds: [], components: []});
          break;}
        })
    })})
  }}