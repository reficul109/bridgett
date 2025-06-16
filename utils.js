const {
  ActionRowBuilder: ROWS, 
  ButtonBuilder: BTNS, 
  ButtonStyle: BSTY, 
  EmbedBuilder: EMBD, 
  SlashCommandBuilder: SLAB
} = require('discord.js');

const nearestColor = require('nearest-color');
const {colornames} = require('color-name-list');

const colors = colornames.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});
nearestColor.find = function () {return nearestColor.from(colors)};

//Images
SLAB.imgNames = 'https://cdn.discordapp.com/attachments/530524839321010188/1253076430493847664/AutoPaletteNames.png';
SLAB.imgMatch = 'https://cdn.discordapp.com/attachments/530524839321010188/1253076430762414122/MatchYourColors.png';
SLAB.imgProtect = 'https://cdn.discordapp.com/attachments/530524839321010188/1253076431013937192/ProtectedRoleList.png';
SLAB.imgNew = 'https://cdn.discordapp.com/attachments/530524839321010188/1253076431240695890/ScreenNewRoles.png';

//Palette Embeds
const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
EMBD.paletteEmbeds = function(colors, page) {
  var paletteEmbeds = []
  for (var i = 0; i < 5; i++) {
    var color = colors[i + (page * 5)].toString()
    const embed = new EMBD()
    .setTitle(color)
    .setColor(color)
    .setDescription(emoji[i])
    .setURL('https://encycolorpedia.com/' + color.substring(1))
    .setThumbnail('https://encycolorpedia.com/' + color.substring(1) + '.png')
    paletteEmbeds.push(embed)}
return paletteEmbeds;}

//Palette UI
const more = new BTNS().setCustomId('+').setEmoji('➕').setStyle(BSTY.Success);
const less = new BTNS().setCustomId('-').setEmoji('➖').setStyle(BSTY.Success);
const none = new BTNS().setCustomId('x').setEmoji('✖️').setStyle(BSTY.Danger);
const color1 = new BTNS().setCustomId('1').setEmoji('1️⃣').setStyle(BSTY.Primary);
const color2 = new BTNS().setCustomId('2').setEmoji('2️⃣').setStyle(BSTY.Primary);
const color3 = new BTNS().setCustomId('3').setEmoji('3️⃣').setStyle(BSTY.Primary);
const color4 = new BTNS().setCustomId('4').setEmoji('4️⃣').setStyle(BSTY.Primary);
const color5 = new BTNS().setCustomId('5').setEmoji('5️⃣').setStyle(BSTY.Primary);
const colorsRow = new ROWS().addComponents(color1, color2, color3, color4, color5);
const selectRow = new ROWS().addComponents(more, less, none);
ROWS.paletteUI = [colorsRow, selectRow];

//Warning Embed
EMBD.warningEmbed = function(roles) {
  const warningEmbed = new EMBD()
  .setColor("#f2003c")
  .addFields({name: "Caution!", value: roles.color.members.size + ' Users have the <@&' + roles.color.id + '> Role...\nYour Command could change the Display Color for all of them, Proceed?'})
return [warningEmbed];}

//Warning UI
const yeah = new BTNS().setCustomId('y').setEmoji('✔️').setStyle(BSTY.Success);
const nope = new BTNS().setCustomId('n').setEmoji('✖️').setStyle(BSTY.Danger);
const proceedRow = new ROWS().addComponents(yeah, nope);
ROWS.proceedUi = [proceedRow];