const {
  ActionRowBuilder: ROWS, 
  EmbedBuilder: EMBD,
  PermissionsBitField: PBIT,
  SlashCommandBuilder: SLAB
} = require("discord.js");

const db = require("better-sqlite3")("./resources/BrittData.db");
const editRow = db.prepare("UPDATE paletteRoles SET roleID = ?, pauseFunc = ?, funAllowed = ? WHERE guildID = ?")

module.exports = {

  //checkPaletteRole: true,
  //colorRoleRequired: true,
  //checkColorEditable: true,
  //protectColorRole: true,
  //warnMultipleEffect: true,
  //correctMessageCommand: "<usage>",
  //adminCommand: true,
  
  data: new SLAB()
  .setName("setup")
  .setDMPermission(false)
  .setDescription("Allow Bridgett to Start Working!"),

  async execute(cmd, roles) {
    if (!cmd.member.permissions.has(PBIT.Flags.ManageRoles)) {return SLAB.smartReply(cmd, "**You** do not have Permission to Create New Roles...");}

    var settings = cmd.guildConfig;
    await SLAB.smartReply(cmd, {content: "Editing your Server Settings...", 
    embeds: EMBD.setupEmbed(settings, cmd.paletteRole), 
    components: ROWS.setupUI}).then(function (botReply) {

      //Filter Message
      if (cmd.id !== botReply.id) {botReply.filterMessage = botReply.id;}
      else {cmd.fetchReply().then(reply => {botReply.filterMessage = reply.id;})}

      //Filtered Collector
      const collector = cmd.channel.createMessageComponentCollector({time: 600000});
      collector.on("collect", async userReply => {
        if (userReply.message.id !== botReply.filterMessage) {return;}
        await userReply.deferUpdate()
        if (userReply.user.id !== cmd.member.id) {return;}
        collector.stop()

        if (userReply.customId === "Pause") {
          if (settings.pauseFunc === "Enabled") {settings.pauseFunc = "Disabled";}
          else {settings.pauseFunc = "Enabled";}

          editRow.run(settings.roleID, settings.pauseFunc, settings.funAllowed, cmd.guild.id)
          botReply.edit({content: "Pause Setting " + settings.pauseFunc + "!", embeds: [], components: []})}

        else if (userReply.customId === "Fun") {
          if (settings.funAllowed === "Enabled") {settings.funAllowed = "Disabled";}
          else {settings.funAllowed = "Enabled";}

          editRow.run(settings.roleID, settings.pauseFunc, settings.funAllowed, cmd.guild.id)
          botReply.edit({content: "Reactions Setting " + settings.funAllowed + "!", embeds: [], components: []})}

        else {
          if (cmd.paletteRole) {
            botReply.edit({content: "...Your Server was Already Set-Up!", embeds: [], components: []})
    
          } else {
            var newRole = {name: "🎨 Auto-Palette 🎨", permissions: []};
            try {await cmd.guild.roles.create(newRole)} catch {return SLAB.smartReply(cmd, "I Need Permission to Create New Roles...");}
            var paletteRole = cmd.guild.roles.cache.find(role => role.name === "🎨 Auto-Palette 🎨");
      
            editRow.run(paletteRole.id, "Disabled", settings.funAllowed, cmd.guild.id)

            cmd.me.roles.add(paletteRole)
            botReply.edit({content: "Done!", embeds: EMBD.setupSuccess(paletteRole.id), components: []})
          }
        }
      })
    })
}}