const {SlashCommandBuilder} = require('discord.js');
const avyGuilds = ["412116759668064256", "707295290461257760"], avyRoles = ["584594259550797824", "737786182116573185"];

module.exports = {

  data: new SlashCommandBuilder()
	  .setName('autopalette')
	  .setDescription('Enable Automatic Color Recomendations!')
    .setDMPermission(false),

  async execute(interaction) {
    var roles = interaction.member.roles;
    if (roles.color.id === "1182907738708258916") {return interaction.reply('You Need a Custom Role First! (/role)')}
    
    var roleID = avyRoles[avyGuilds.indexOf(interaction.guild.id)];
    if (!roles.cache.find(role => role.id === roleID)) {
      roles.add(roleID);
      interaction.reply('Set!')}
    else {
      roles.remove(roleID);
      interaction.reply('Removed!')}
}}