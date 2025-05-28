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
  //correctMessageCommand: '<usage>',

  data: new SLAB()
	.setName('palette')
	.setDescription('Match your Color and Profile Picture!')
  .addStringOption(option => option.setName('scope').setDescription('Amount of Server Roles to Update').addChoices(
    {name: 'For all Servers', value: 'All'}, 
    {name: 'For this Server', value: 'One'}))
  .setDMPermission(false),

  async execute(cmd, roles) {
    var user = (null || cmd.member.user)
    var scope = (cmd.args ?? cmd.options.getString('scope') ?? 'All').toLowerCase();
    if (scope.includes('one')) {var memberPaletteGuilds = cmd.client.guilds.cache.filter(guild => guild === cmd.guild)}
    else {var memberPaletteGuilds = cmd.client.guilds.cache.filter(guild => guild.members.cache.get(user) && guild.members.cache.get(user).roles.cache.find(role => role.name.startsWith("🎨") && role.name.endsWith("🎨")))}
   
    var page = 0;
    await getColors(user.displayAvatarURL({extension: 'png', forceStatic: true}), getColors.paletteCount).then(colors => {
    SLAB.smartReply(cmd, {content: '<@' + user.id + '>, Pick a New Color!', embeds: EMBD.paletteEmbeds(colors, page), components: ROWS.paletteUI}).then(function (botReply) {

      const collector = cmd.channel.createMessageComponentCollector({time: 1800000});
      collector.on('collect', async userReply => {
        if (userReply.user.id != user.id) {return;}
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
            memberPaletteGuilds.forEach(guild => guild.members.cache.get(user).roles.color.setColor(colors[(btn + (page * 5) - 1)].toString()));
            botReply.edit({content: (colors[(btn + (page * 5) - 1)] + ' Selected!'), embeds: [], components: []});
          break;}
        })
    })})
  }}