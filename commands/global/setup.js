const {
  ActionRowBuilder: ROWS, 
  EmbedBuilder: EMBD,
  PermissionsBitField: PBIT,
  SlashCommandBuilder: SLAB
} = require("discord.js");

const db = require("better-sqlite3")("./resources/BrittData.db");

module.exports = {

  //adminCommand: true,
  //correctMessageCommand: "<usage>",
  //checkPaletteRole: true,
  //colorRoleRequired: true,
  //checkColorEditable: true,
  //protectColorRole: true,
  //warnMultipleEffect: true,
  
  data: new SLAB()
  .setName("setup")
  .setDMPermission(false)
  .setDescription("Allow Bridgett to Start Working!"),

  async execute(cmd) {
    if (!cmd.member.permissions.has(PBIT.Flags.ManageRoles)) {return SLAB.smartReply(cmd, "**You** do not have Permission to Create New Roles...");}
    var settings = cmd.guildConfig;
    
    //Interactive Message
    await SLAB.smartReply(cmd, {content: "Editing your Server Settings...", 
    embeds: EMBD.setupEmbed(settings, cmd.paletteRole), 
    components: ROWS.setupUI}).then(function (botReply) {

      //Filter Message
      SLAB.findCollectorFilter(cmd, botReply)

      //Filtered Collector
      const collector = cmd.channel.createMessageComponentCollector({time: 600000});
      collector.on("collect", async userReply => {
        if (userReply.message.id !== botReply.filterMessage) {return;}
        await userReply.deferUpdate()
        if (userReply.user.id !== cmd.member.id) {return;}
        collector.stop()

        //Actions
        var btn = (userReply.customId);
        switch (btn) {
          case "Pause":
            settings.pauseFunc = (settings.pauseFunc === "Enabled") ? "Disabled" : "Enabled";

            db.editRow.run(settings.roleID, settings.pauseFunc, settings.funAllowed, cmd.guild.id)
            botReply.edit({content: "Pause Setting " + settings.pauseFunc + "!", embeds: [], components: []})
          break;

          case "Fun":
            settings.funAllowed = (settings.funAllowed === "Enabled") ? "Disabled" : "Enabled";

            db.editRow.run(settings.roleID, settings.pauseFunc, settings.funAllowed, cmd.guild.id)
            botReply.edit({content: "Reactions Setting " + settings.funAllowed + "!", embeds: [], components: []})
          break;

          case "Setup":
            if (cmd.paletteRole) {
              botReply.edit({content: "...Your Server was Already Set-Up!", embeds: [], components: []})
            
            } else {
              var newRole = {name: "🎨 Auto-Palette 🎨", permissions: []};
              try {await cmd.guild.roles.create(newRole)} catch {return SLAB.smartReply(cmd, "I Need Permission to Create New Roles...");}
              var paletteRole = cmd.guild.roles.cache.find(role => role.name === "🎨 Auto-Palette 🎨");
      
              db.editRow.run(paletteRole.id, "Disabled", settings.funAllowed, cmd.guild.id)

              cmd.me.roles.add(paletteRole)
              botReply.edit({content: "Done!", embeds: EMBD.setupSuccess(paletteRole.id), components: []})
            }
          break;
        }
      })
    })
  }
}