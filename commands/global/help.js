const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');

module.exports = {
    
  data: new SlashCommandBuilder()
	  .setName('help')
	  .setDescription('Discover where to Start!')
      .addStringOption(option => option.setName('section').setDescription('Hierarchy of Interest').addChoices({name: 'For Users', value: 'Users'}, {name: 'For Admins', value: 'Admin'})),
    
  async execute(interaction) {
    var section = (interaction.options.getString('section') ?? 'Users');
                   
    const helpEmbed = new EmbedBuilder()
    .setColor("#f2003c")
    .setAuthor({name: 'How to Start', iconURL: 'https://discord.com/assets/8b73ea3af2ce6fdf5622.svg'})
      
    switch (section) {
      case 'Admin':
        helpEmbed.addFields({name: "/customrole", value: "Updates the Name And Color of the User's **Color Role**\nIf said Role is Protected, it will Create a New Role Above the 🎨 Auto-Palette 🎨 Role, if such Role Exists"},
                            {name: "/palette", value: "Updates the **Color Role** of the User, Unless said Role is Protected"},
                            {name: "/autopalette", value: "Grants the User the 🎨 Auto-Palette 🎨 Role, If such Role Exists and the **Color Role** of the User is not Protected"});
      break;
      
      default:
        helpEmbed.addFields({name: "/customrole", value: "ddd"},
                            {name: "/palette", value: "fff"},
                            {name: "/autopalette", value: "eee"});
      break;}
   
    interaction.reply({embeds: [helpEmbed]});
}}