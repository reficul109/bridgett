const {
  EmbedBuilder: EMBD, 
  SlashCommandBuilder: SLAB
} = require("discord.js");

module.exports = {

  //adminCommand: true,
  //correctMessageCommand: "<usage>",
  //checkPaletteRole: true,
  //colorRoleRequired: true,
  //checkColorEditable: true,
  //protectColorRole: true,
  //warnMultipleEffect: true,
  
  data: new SLAB()
	.setName("help")
  .setDMPermission(false)
	.setDescription("Discover how to Start!")
  .addStringOption(option => option.setName("section")
  .setDescription("Area of Interest").addChoices(
    {name: "For Users", value: "Users"},
    {name: "For Admins", value: "Admin"},
    {name: "Set-Up", value: "Setup"},
    {name: "Role Protection", value: "Protection"})),

  async execute(cmd) {
    var section = (cmd.argRes ?? cmd.options.getString("section") ?? "Users").toLowerCase();

    var helpEmbed = new EMBD()
    .setColor("#f2003c")
    .setAuthor({name: "How to Start", iconURL: SLAB.imagePath + "Palette.png"})

    if (section.includes("admin")) {
      helpEmbed.addFields(
        {name: "/setup", value: "```Create the 🎨 Auto-Palette 🎨 Role and Gives Users Access to the Other Commands when Enabled```"},
        {name: "/color", value: "```Updates the Color of the User's Color Role\nIf said Role is Protected, a New Role will be Created Above the 🎨 Auto-Palette 🎨 Role```"},
        {name: "/name", value: "```Updates the Name of the User's Color Role\nIf said Role is Protected, a New Role will be Created Above the 🎨 Auto-Palette 🎨 Role```"},
        {name: "/palette and /search", value: "```Updates the Color Role of the User, Unless said Role is Protected```"},
        {name: "/autopalette", value: "```Grants the User the 🎨 Auto-Palette 🎨 Role (if the Color Role of the User is Not Protected)```"})
      .setImage(SLAB.imagePath + "ScreenNewRoles.png")} //Make New Admin Pic

    else if (section.includes("protect")) {
      helpEmbed.addFields(
        {name: "¿What is a Protected Role?", value: "```It Includes any Roles the Admins Decide i should not Edit.```"},
        {name: "¿What Commands does this Affect?", value: "```/autopalette and /palette will __not__ Work if your Color Role is Protected...```"},
        {name: "¿How to Protect / Unprotect a Role?", value: "```Every Role I am Given in a Server by an Admin is Protected!```"},
        {name: "¿What Roles should I Protect?", value: "```Roles I did not Create, Specially Important and Colored Ones!```"},
        {name: "¿So I cannot use Commands?", value: "```You can Get a Custom Role with /color if the Server was Set-Up!```"})
      .setImage(SLAB.imagePath + "ProtectedRoleList.png")}

    else if (section.includes("setup")) {
      helpEmbed.addFields(
        {name: "¿How to Set-up?", value: "```Someone with Permission to Edit the Roles of the Server has to Use /setup!```"},
        {name: "¿What are the Changes?", value: "```A New Role Called 🎨 Auto-Palette 🎨 Will be Created and Distributed through Commands!\n(This Role has no Extra Permissions)```"},
        {name: "¿Can the 🎨 Auto-Palette 🎨 Role be Edited?", value: "```Yes!, You should Place This Role in the Position You want New Color Roles In!\n```"})
      .setImage(SLAB.imagePath + "ScreenNewRoles.png")}

    else {
      helpEmbed.addFields(
        {name: "/setup", value: "```Allow Everyone to Create and Customize their Own Color Role!```"},
        {name: "/color", value: "```Update your Color Role!\nInput a Hexadecimal Color!```"},
        {name: "/name", value: "```Update your Color Role!\nInput the Name you Want!```"},
        {name: "/search", value: "```Find Pretty Colors for your Color Role!```"},
        {name: "/palette", value: "```Find Pretty Colors for your Color Role!, Based on an Image or your Current Profile Picture!```"},
        {name: "/autopalette", value: "```Get Color Recomendations the Moment you Change Profile Picture!```"})
      .setImage(SLAB.imagePath + "MatchYourColors.png")}

    SLAB.smartReply(cmd, {embeds: [helpEmbed]})
}}