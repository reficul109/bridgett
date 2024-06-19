const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');

module.exports = {
  
  data: new SlashCommandBuilder()
	.setName('help')
	.setDescription('Discover how to Start!')
  .addStringOption(option => option.setName('section').setDescription('Hierarchy of Interest').addChoices(
    {name: 'For Users', value: 'Users'},
    {name: 'For Admins', value: 'Admin'},
    {name: 'Set-Up', value: 'Setup'},
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
          {name: "/customrole", value: "Updates the Name And Color of the User's **Color Role**\nIf said Role is Protected, it will Create a **New Role** Above the 🎨 Auto-Palette 🎨 Role (if such Role Exists)"},
          {name: "/palette", value: "Updates the **Color Role** of the User, Unless said Role is Protected"},
          {name: "/autopalette", value: "Grants the User the 🎨 Auto-Palette 🎨 Role (if such Role Exists and the **Color Role** of the User is Not Protected)"})
        .setImage(SlashCommandBuilder.imgNew);
      break;

      case 'Protection':
        helpEmbed.addFields(
          {name: "¿What is a Protected Role?", value: "It Includes any Roles the Admins Decide i should not Edit."},
          {name: "¿What Commands does this Affect?", value: "/autopalette and /palette will __not__ Work if your **Color Role** is Protected..."},
          {name: "¿How to Protect / Unprotect a Role?", value: "Every Role I am Given in a Server by an Admin is Protected!"},
          {name: "¿So I Just cannot use Commands?", value: "You can Get a **New Role** with /customrole if the Server was Set-Up!"})
        .setImage(SlashCommandBuilder.imgProtect);
      break;

      case 'Setup':
        helpEmbed.addFields(
          {name: "¿How to Set-up?", value: "Someone with Permission to Edit the Roles of the Server has to Use /setup!"},
          {name: "¿What are the Changes?", value: "A New Role Called 🎨 Auto-Palette 🎨 Will be Created and Distributed through Commands!\n(This Role has no Extra Permissions)"},
          {name: "¿Can the 🎨 Auto-Palette 🎨 Role be Edited?", value: "We Recommend you Edit the Position!\nThe Name is Editable, but the Emojis **Have** to Stay"})
        .setImage(SlashCommandBuilder.imgNames);
      break;

      default:
        helpEmbed.addFields(
          {name: "/customrole", value: "Update your **Color Role!**\nOptions:\n- Name\n- Color (Hex / Decimal)"},
          {name: "/palette", value: "Find Pretty Colors for your **Color Role**\nOptions:\n- Scope (In Case of Sharing Multiple Servers)"},
          {name: "/autopalette", value: "Get Color Recomendations when you Change Profile Picture"})
        .setImage(SlashCommandBuilder.imgMatch);
      break;}

    interaction.replyOrFollow({embeds: [helpEmbed]});
}}