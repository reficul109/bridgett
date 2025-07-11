const {
  ActionRowBuilder: ROWS, 
  ButtonBuilder: BTNS, 
  ButtonStyle: BSTY, 
  EmbedBuilder: EMBD, 
  SlashCommandBuilder: SLAB
} = require("discord.js");

//Image (URLs)
SLAB.imagePath = "https://raw.githubusercontent.com/reficul109/bridgett/refs/heads/main/images/"

//Collector Filter (Assigns .filterMessage)
SLAB.findCollectorFilter = function(cmd, botReply) {
  if (cmd.id !== botReply.id) {botReply.filterMessage = botReply.id;}
  else {cmd.fetchReply().then(reply => {botReply.filterMessage = reply.id;})}}

//
// --- Database Stuff ---
//
const db = require("better-sqlite3")("./resources/BrittData.db");
const guildConfigs = db.prepare("SELECT * FROM paletteRoles WHERE guildID = ?")
const newRow = db.prepare("INSERT INTO paletteRoles (guildID, roleID, pauseFunc, funAllowed) VALUES (?, ?, ?, ?)")

//Guild Check (Assigns .guildConfig)
SLAB.findGuildConfig = function(cmd) {
  if (!guildConfigs.get(cmd.guild.id)) {newRow.run(cmd.guild.id, "None", "Enabled", "Enabled")}
  cmd.guildConfig = guildConfigs.get(cmd.guild.id);}

//Palette Filter
SLAB.filterPalette = function(cmd, guild, user) {
  var member = guild.members.cache.get(user.id), settings = guildConfigs.get(guild.id);
  if (member && settings && member.roles.color) {
    if (!member.roles.cache.get(settings.roleID)) {return (guild === cmd.guild);}
    else {return (settings.pauseFunc !== "Enabled" && member.roles.color.editable);}}}

//
// --- Setup Embed ---
//
EMBD.setupEmbed = function(settings, role) {
  const setupEmbed = new EMBD()
  .setColor("#f2003c")
  .addFields(
    {name: "🎨 Your Palette Role is: " + (role ? role.name : "None Yet!"), value: "```Create the 🎨 Auto-Palette 🎨 Role\nGive Users Access to the Other Commands```"},
    {name: "⏯️ Pause is " + settings.pauseFunc + "!", value: "```Stop Users from Running Color Customization Commands```"},
    {name: "📦 Reactions are " + settings.funAllowed + "!", value: "```Stop Bridgett from Reacting to Certain Words```"})
return [setupEmbed];}

//Success Setup Embed 
EMBD.setupSuccess = function(roleID) {
  const setupSuccess = new EMBD()
  .setColor("#f2003c")
  .setImage(SLAB.imagePath + "ScreenNewRoles.png")
  .addFields({name: "Your Server is Set-Up!", value: "I Created a New Role: <@&" + roleID + ">\nPosition it Wisely! From Now, Any Color Role I Create Will be Placed Above This One!"})
return [setupSuccess];}

//Setup UI
const setup = new BTNS().setCustomId("Setup").setEmoji("🎨").setStyle(BSTY.Success);
const pause = new BTNS().setCustomId("Pause").setEmoji("⏯️").setStyle(BSTY.Success);
const fun = new BTNS().setCustomId("Fun").setEmoji("📦").setStyle(BSTY.Success);
const setupRow = new ROWS().addComponents(setup, pause, fun);
ROWS.setupUI = [setupRow];

//
// --- Warning Embed ---
//
EMBD.warningEmbed = function(role) {
  const warningEmbed = new EMBD()
  .setColor("#f2003c")
  .addFields({name: "Caution!", value: role.members.size + " Users have the <@&" + role.id + "> Role...\nYour Command could change the Display Color for All of Them, Proceed?"})
return [warningEmbed];}

//Warning UI
const yeah = new BTNS().setCustomId("Yes").setEmoji("✔️").setStyle(BSTY.Success);
const nope = new BTNS().setCustomId("Nah").setEmoji("✖️").setStyle(BSTY.Danger);
const proceedRow = new ROWS().addComponents(yeah, nope);
ROWS.proceedUi = [proceedRow];