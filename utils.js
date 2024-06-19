const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder} = require('discord.js');

//Images
SlashCommandBuilder.imgNames = 'https://cdn.discordapp.com/attachments/530524839321010188/1253076430493847664/AutoPaletteNames.png';
SlashCommandBuilder.imgMatch = 'https://cdn.discordapp.com/attachments/530524839321010188/1253076430762414122/MatchYourColors.png';
SlashCommandBuilder.imgProtect = 'https://cdn.discordapp.com/attachments/530524839321010188/1253076431013937192/ProtectedRoleList.png';
SlashCommandBuilder.imgNew = 'https://cdn.discordapp.com/attachments/530524839321010188/1253076431240695890/ScreenNewRoles.png';

//Palette Embeds
const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
EmbedBuilder.paletteEmbeds = function(colors, page) {
  var paletteEmbeds = []
  for (var i = 0; i < 5; i++) {
    var color = colors[i + (page * 5)].toString()
    const embed = new EmbedBuilder()
    .setTitle(color)
    .setColor(color)
    .setDescription(emoji[i])
    .setURL('https://encycolorpedia.com/' + color.substring(1))
    .setThumbnail('https://encycolorpedia.com/' + color.substring(1) + '.png')
    paletteEmbeds.push(embed)}
return paletteEmbeds;}

//Palette UI
const more = new ButtonBuilder().setCustomId('+').setEmoji('➕').setStyle(ButtonStyle.Success);
const less = new ButtonBuilder().setCustomId('-').setEmoji('➖').setStyle(ButtonStyle.Success);
const none = new ButtonBuilder().setCustomId('x').setEmoji('✖️').setStyle(ButtonStyle.Danger);
const color1 = new ButtonBuilder().setCustomId('1').setEmoji('1️⃣').setStyle(ButtonStyle.Primary);
const color2 = new ButtonBuilder().setCustomId('2').setEmoji('2️⃣').setStyle(ButtonStyle.Primary);
const color3 = new ButtonBuilder().setCustomId('3').setEmoji('3️⃣').setStyle(ButtonStyle.Primary);
const color4 = new ButtonBuilder().setCustomId('4').setEmoji('4️⃣').setStyle(ButtonStyle.Primary);
const color5 = new ButtonBuilder().setCustomId('5').setEmoji('5️⃣').setStyle(ButtonStyle.Primary);
const colorsRow = new ActionRowBuilder().addComponents(color1, color2, color3, color4, color5);
const selectRow = new ActionRowBuilder().addComponents(more, less, none);
ActionRowBuilder.paletteUI = [colorsRow, selectRow];

//Warning Embed
EmbedBuilder.warningEmbed = function(roles) {
  const warningEmbed = new EmbedBuilder()
  .setColor("#f2003c")
  .addFields({name: "Caution!", value: roles.color.members.size + ' Users have the <@&' + roles.color.id + '> Role...\nYour Command could change the Display Color for all of them, Proceed?'})
return [warningEmbed];}

//Warning UI
const yeah = new ButtonBuilder().setCustomId('y').setEmoji('✔️').setStyle(ButtonStyle.Success);
const nope = new ButtonBuilder().setCustomId('n').setEmoji('✖️').setStyle(ButtonStyle.Danger);
const proceedRow = new ActionRowBuilder().addComponents(yeah, nope);
ActionRowBuilder.proceedUi = [proceedRow];