const {
  EmbedBuilder: EMBD, 
  SlashCommandBuilder: SLAB
} = require('discord.js');

module.exports = {

  //checkPaletteRole: true,
  //colorRoleRequired: true,
  //checkColorEditable: true,
  //protectColorRole: true,
  //warnMultipleEffect: true,
  //correctMessageCommand: '<usage>',
  //adminCommand: true,
  
  data: new SLAB()
	.setName('help')
  .setDMPermission(false)
	.setDescription('Discover how to Start!')
  .addStringOption(option => option.setName('section')
  .setDescription('Area of Interest').addChoices(
    {name: 'For Users', value: 'Users'},
    {name: 'For Admins', value: 'Admin'},
    {name: 'Set-Up', value: 'Setup'},
    {name: 'Role Protection', value: 'Protection'})),

  async execute(cmd, roles) {
    var section = (cmd.args ?? cmd.options.getString('section') ?? 'Users').toLowerCase();

    const helpEmbed = new EMBD()
    .setColor("#f2003c")
    .setAuthor({name: 'How to Start', iconURL: 'https://discord.com/assets/8b73ea3af2ce6fdf5622.svg'})

    if (section.includes('admin')) {
      helpEmbed.addFields(
        {name: "/setup", value: "Creates the 🎨 Auto-Palette 🎨 Role and Gives Users Access to the Other Commands"},
        {name: "\u200B", value: "\u200B"},
        {name: "/color", value: "Updates the Color of the User's **Color Role**\nIf said Role is Protected, a **New Role** will be Created Above the 🎨 Auto-Palette 🎨 Role"},
        {name: "\u200B", value: "\u200B"},
        {name: "/name", value: "Updates the Name of the User's **Color Role**\nIf said Role is Protected, a **New Role** will be Created Above the 🎨 Auto-Palette 🎨 Role"},
        {name: "\u200B", value: "\u200B"},
        {name: "/palette", value: "Updates the **Color Role** of the User, Unless said Role is Protected"},
        {name: "\u200B", value: "\u200B"},
        {name: "/autopalette", value: "Grants the User the 🎨 Auto-Palette 🎨 Role (if the **Color Role** of the User is Not Protected)"})
      .setImage(SLAB.imgNew)}

    else if (section.includes('protect')) {
      helpEmbed.addFields(
        {name: "¿What is a Protected Role?", value: "It Includes any Roles the Admins Decide i should not Edit."},
        {name: "\u200B", value: "\u200B"},
        {name: "¿What Commands does this Affect?", value: "/autopalette and /palette will __not__ Work if your **Color Role** is Protected..."},
        {name: "\u200B", value: "\u200B"},
        {name: "¿How to Protect / Unprotect a Role?", value: "Every Role I am Given in a Server by an Admin is Protected!"},
        {name: "\u200B", value: "\u200B"},
        {name: "¿So I cannot use Commands?", value: "You can Get a **Custom Role** with /color if the Server was Set-Up!"})
      .setImage(SLAB.imgProtect)}

    else if (section.includes('setup')) {
      helpEmbed.addFields(
        {name: "¿How to Set-up?", value: "Someone with Permission to Edit the Roles of the Server has to Use /setup!"},
        {name: "\u200B", value: "\u200B"},
        {name: "¿What are the Changes?", value: "A New Role Called 🎨 Auto-Palette 🎨 Will be Created and Distributed through Commands!\n(This Role has no Extra Permissions)"},
        {name: "\u200B", value: "\u200B"},
        {name: "¿Can the 🎨 Auto-Palette 🎨 Role be Edited?", value: "We Recommend you Edit the Position!\nThe Name is Editable, but the Emojis **Have** to Stay"})
      .setImage(SLAB.imgNames)}

    else {
      helpEmbed.addFields(
        {name: "/setup", value: "Allow Everyone to Create and Customize their Own **Color Role**!"},
        {name: "\u200B", value: "\u200B"},
        {name: "/color", value: "Update your **Color Role!**\nInput a Hexadecimal Color!"},
        {name: "\u200B", value: "\u200B"},
        {name: "/name", value: "Update your **Color Role!**\nInput the Name you Want!"},
        {name: "\u200B", value: "\u200B"},
        {name: "/palette", value: "Find Pretty Colors for your **Color Role**\nOptions:\n- Scope (In Case of Sharing Multiple Servers)"},
        {name: "\u200B", value: "\u200B"},
        {name: "/autopalette", value: "Get Color Recomendations the Moment you Change Profile Picture!"})
      .setImage(SLAB.imgMatch)}

    SLAB.smartReply(cmd, {embeds: [helpEmbed]})
}}