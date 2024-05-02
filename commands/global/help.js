const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');

module.exports = {
  
  data: new SlashCommandBuilder()
	.setName('help')
	.setDescription('Discover how to Start!')
  .addStringOption(option => option.setName('section').setDescription('Hierarchy of Interest').addChoices(
    {name: 'For Users', value: 'Users'},
    {name: 'For Admins', value: 'Admin'},
    {name: 'Role Protection', value: 'Protection'}))
  .setDMPermission(false),

  async execute(interaction, roles) {
    var section = (interaction.options.getString('section') ?? 'Users');

    const helpEmbed = new EmbedBuilder()
    .setColor("#f2003c")
    .setAuthor({name: 'How to Start', iconURL: 'https://discord.com/assets/8b73ea3af2ce6fdf5622.svg'})

    switch (section) {
      case 'Admin':
        helpEmbed.addFields(
          {name: "/customrole", value: "Updates the Name And Color of the User's **Color Role**\nIf said Role is Protected, it will Create a New Role Above the 🎨 Auto-Palette 🎨 Role (if such Role Exists)"},
          {name: "/palette", value: "Updates the **Color Role** of the User, Unless said Role is Protected"},
          {name: "/autopalette", value: "Grants the User the 🎨 Auto-Palette 🎨 Role (if such Role Exists and the **Color Role** of the User is Not Protected)"});
      break;

      case 'Protection':
        helpEmbed.addFields(
          {name: "¿What is a Protected Role?", value: "It includes any Roles the Admins Decide i should not Edit."},
          {name: "¿What Commands does this Affect?", value: "/autopalette and /palette will __not__ Work if your **Color Role** is Protected..."},
          {name: "¿How to Protect / Unprotect a Role?", value: "Every Role I am Given in a Server by an Admin is Protected!"},
          {name: "¿So i Just Cannot use Commands?", value: "You can Get a New Role with /customrole if the Server was Setup!"});
      break;

      case 'Setup':
        helpEmbed.addFields(
          {name: "", value: ""},
          {name: "", value: ""},
          {name: "", value: ""});
      break;

      default:
        helpEmbed.addFields(
          {name: "/customrole", value: "Update your **Color Role!**\nOptions:\n- Name\n- Color (Hex / Decimal)"},
          {name: "/palette", value: "Find Pretty Colors for your **Color Role**\nOptions:\n- Scope (In Case of Sharing Multiple Servers)"},
          {name: "/autopalette", value: "Get Color Recomendations when you Change Profile Picture"});
      break;}

    interaction.reply({embeds: [helpEmbed]});
}}