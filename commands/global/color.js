const {
  EmbedBuilder: EMBD,
  SlashCommandBuilder: SLAB
} = require("discord.js");

module.exports = {

  //adminCommand: true,
  correctMessageCommand: ("Correct usage is: " + SLAB.prefix + "color <hexColor>"),
  checkPaletteRole: true,
  //colorRoleRequired: true,
  checkColorEditable: true,
  //protectColorRole: true,
  warnMultipleEffect: true,

  data: new SLAB()
	.setName("color")
  .setDMPermission(false)
	.setDescription("Color your Custom Role!")
  .addStringOption(option => option.setName("color").setRequired(true)
  .setDescription("Color to Assign to the Role").setMinLength(6).setMaxLength(7)),

  async execute(cmd) {
    var color = (cmd.argRes ?? cmd.options.getString("color"));
    if (parseInt(color.toString()) === 0 || color === "#000000") {return SLAB.smartReply(cmd, "Discord does not like this Color...");}

    //New Role Properties
    if (!cmd.color || cmd.me.roles.cache.get(cmd.color.id)) {
      var name = "My Color Role", position = (cmd.paletteRole.position + 1);
      var newRole = {name: name, color: color, position: position, permissions: []};
      try {await cmd.guild.roles.create(newRole)} catch {return SLAB.smartReply(cmd, "Invalid Color (Must be Hexadecimal...)");}

      //Protect New Role
      cmd.member.roles.add(cmd.guild.roles.cache.find(role => role.position === position))
      SLAB.smartReply(cmd, {content: "Role Created!", embeds: [EMBD.colorChip(color, "🎨")]})

    //Role Updates
    } else {
      try {await cmd.color.setColor(color)} catch {return SLAB.smartReply(cmd, "Invalid Color (Must be Hexadecimal...)");}
      SLAB.smartReply(cmd, {content: "Role Updated!", embeds: [EMBD.colorChip(color, "🎨")]})
    }
}}