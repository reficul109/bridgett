const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder} = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()
	  .setName('autopalette')
	  .setDescription('Enable Automatic Color Recomendations!')
      .setDMPermission(false),

  async execute(interaction) {
    var roles = interaction.member.roles;
    if (!roles.color) {return interaction.reply('You do not have ANY Color Role!?\nI cannot Work under these Conditions!\n(/customrole)');}
    if (interaction.guild.members.me.roles.cache.get(roles.color.id)) {return interaction.reply('I Have Instructions to not Edit your Color Role...\nObtain a Custom Role First!\n(/customrole)');}
    
    var paletteRole = await interaction.guild.roles.cache.find(role => role.name.startsWith("🎨") && role.name.endsWith("🎨"));
    if (paletteRole) {
      if (!roles.cache.find(role => role.id === paletteRole.id)) {
        if (roles.color.members.size > 1) {
          const warningEmbed = new EmbedBuilder()
          .setColor("#f2003c")
          .addFields({name: "Caution!", value: roles.color.members.size + ' Users have the <@&' + roles.color.id + '> Role...\nThis Will Update the Display Color for all of them, Proceed?'})

          const yeah = new ButtonBuilder().setCustomId('y').setEmoji('✔️').setStyle(ButtonStyle.Success);
          const nope = new ButtonBuilder().setCustomId('n').setEmoji('✖️').setStyle(ButtonStyle.Danger);
          const optionRow = new ActionRowBuilder().addComponents(yeah, nope);

          await interaction.reply({embeds: [warningEmbed], components: [optionRow]});
          interaction.fetchReply().then(function (nInteraction) {

            const collector = nInteraction.channel.createMessageComponentCollector({time: 300000});
            collector.on('collect', async cInteraction => {
              if (cInteraction.member.id != interaction.user.id) {return;}
              await cInteraction.deferUpdate();
              collector.stop();
                
              if (cInteraction.customId === 'y') {
                roles.add(paletteRole.id);
                nInteraction.edit({content: ('Set!'), embeds: [], components: []})} 
              else {nInteraction.edit({content: ('Cancelled!'), embeds: [], components: []})}})})
            
        } else {
          roles.add(paletteRole.id);
          interaction.reply('Set!')}
          
      } else {
        roles.remove(paletteRole.id);
        interaction.reply('Removed!')}}

    else {interaction.reply('There is no Auto-Palette Role in this Server... (/help)')}}}