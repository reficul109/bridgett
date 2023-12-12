const {SlashCommandBuilder} = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()
	  .setName('customrole')
	  .setDescription('Customize your Custom Role!')
    .addStringOption(option => option.setName('name').setDescription('Name to Display in the Role'))
    .addStringOption(option => option.setName('color').setDescription('Color to Assign to the Role').setMinLength(6).setMaxLength(8)),
  
  async execute(interaction) {
    var roles = interaction.member.roles;
    if (roles.color.id === "1182907738708258916") {
      var name = (interaction.options.getString('name') ?? 'My Role')
      var color = (interaction.options.getString('color') ?? '#ffffff');
      
      if (parseInt(color.toString()) === 0 || color === '#000000') {return interaction.reply("Discord Doesn't Like This Color...");}
      await interaction.guild.roles.create({name: name, color: color, position: 17, permissions: []}).catch(() => {return interaction.reply('Invalid Color (Must be Hexadecimal or Decimal...)');});
      
      if (!(interaction.replied || interaction.deferred)) {
        roles.add(interaction.guild.roles.cache.find(role => role.position === 17));
        interaction.reply('Created!')}
      
    } else {
      var name = (interaction.options.getString('name') ?? roles.color.name);
      var color = (interaction.options.getString('color') ?? roles.color.color);
      
      roles.color.setName(name);
      if (parseInt(color.toString()) === 0 || color === '#000000') {return interaction.reply("Discord Doesn't Like This Color...");}
      roles.color.setColor(color).catch(() => {return interaction.reply('Invalid Color (Must be Hexadecimal or Decimal...)');})
      
      if (!(interaction.replied || interaction.deferred)) {
        interaction.reply('Updated!')}}
  }}