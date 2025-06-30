const {
  ActionRowBuilder: ROWS, 
  ButtonBuilder: BTNS, 
  ButtonStyle: BSTY, 
  EmbedBuilder: EMBD, 
  SlashCommandBuilder: SLAB
} = require('discord.js');

//Database Stuff
const db = require('better-sqlite3')('./resources/BrittData.db');
db.guildConfig = db.prepare("SELECT * FROM paletteRoles WHERE guildID = ?")

//Color Stuff
const getColors = require('get-image-colors');
getColors.paletteCount = {count: 30};
const colorList = require('./resources/colornames.json');
const nearestColor = require('nearest-color');
const colorObjects = colorList.reduce((o, {name, hex}) => Object.assign(o, {[name]: hex}), {});
nearestColor.find = nearestColor.from(colorObjects);

//Color Chips
EMBD.colorChip = function(color, emoji) {
  var match = nearestColor.find(color)
  const embed = new EMBD()
  .setTitle(emoji + '   ' + color)
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
    var embed = EMBD.colorChip(color, emoji[i])
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

//Harmony UI
const triad = new BTNS().setCustomId('Triadic').setEmoji('📚').setStyle(BSTY.Primary);
const squre = new BTNS().setCustomId('Tetradic').setEmoji('🧮').setStyle(BSTY.Primary);
const anlog = new BTNS().setCustomId('Analogous').setEmoji('🚦').setStyle(BSTY.Primary);
const recta = new BTNS().setCustomId('Rectangle').setEmoji('🧬').setStyle(BSTY.Primary);
const cmplt = new BTNS().setCustomId('Complementary').setEmoji('📓').setStyle(BSTY.Primary);
const sidec = new BTNS().setCustomId('Side-Complementary').setEmoji('💈').setStyle(BSTY.Primary);
const split = new BTNS().setCustomId('Split-Complementary').setEmoji('🍡').setStyle(BSTY.Primary);
const penta = new BTNS().setCustomId('Double-Split-Complementary').setEmoji('🌈').setStyle(BSTY.Primary);
const simpleHarm = new ROWS().addComponents(cmplt, sidec, triad, anlog);
const complxHarm = new ROWS().addComponents(squre, recta, split, penta);
ROWS.harmonyUI = [simpleHarm, complxHarm];

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