const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');

module.exports = {
  
  data: new SlashCommandBuilder()
  .setName('setup')
  .setDescription('...')
  .setDMPermission(false),

  async execute(interaction, roles) {
    interaction.replyOrFollow('Not done yet...');
}}