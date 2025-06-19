const {
  ActionRowBuilder: ROWS, 
  ButtonBuilder: BTNS, 
  ButtonStyle: BSTY, 
  EmbedBuilder: EMBD, 
  SlashCommandBuilder: SLAB
} = require('discord.js');

//Color Stuff
const getColors = require('get-image-colors');
getColors.paletteCount = {count: 30};
const colorList = require('./colornames.json');
const nearestColor = require('nearest-color');
const colorObjects = colorList.reduce((o, {name, hex}) => Object.assign(o, {[name]: hex}), {});
nearestColor.find = nearestColor.from(colorObjects);

//Color Chips
EMBD.colorChip = function(color, emoji) {
  var match = nearestColor.find(color)
  const embed = new EMBD()
  .setTitle(emoji + '     ' + color)
  .setColor(color)
  .setDescription('This Color looks like... [' + match.name + '](https://encycolorpedia.com/' + match.value.substring(1) + ')!')
  .setURL('https://encycolorpedia.com/' + color.substring(1))
return embed;}

//Palette Embeds
const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
EMBD.paletteEmbeds = function(colors, page, size) {
  var paletteEmbeds = []
  for (var i = 0; i < size; i++) {
    var color = colors[i + (page * size)].toString()
    embed = EMBD.colorChip(color, emoji[i])
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

//Images
SLAB.imgNames = 'https://raw.githubusercontent.com/reficul109/bridgett/refs/heads/main/images/AutoPaletteNames.png';
SLAB.imgMatch = 'https://raw.githubusercontent.com/reficul109/bridgett/refs/heads/main/images/MatchYourColors.png';
SLAB.imgProtect = 'https://raw.githubusercontent.com/reficul109/bridgett/refs/heads/main/images/ProtectedRoleList.png';
SLAB.imgNew = 'https://raw.githubusercontent.com/reficul109/bridgett/refs/heads/main/images/ScreenNewRoles.png';