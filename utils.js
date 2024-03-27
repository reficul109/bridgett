const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder} = require('discord.js');

//Palette Utils
const getColors = require('get-image-colors');
getColors.paletteCount = {count: 30}
getColors.paletteMessage = function(colors, page, usID) {return ('<@' + usID + '>, Pick a New Color!\nhttps://encycolorpedia.com/' + colors[0 + (page * 5)] .toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[1 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[2 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[3 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[4 + (page * 5)].toString().substring(1));}

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
const warningEmbed = new EmbedBuilder()
.setColor("#f2003c")
.addFields({name: "Caution!", value: roles.color.members.size + ' Users have the <@&' + roles.color.id + '> Role...\nYour Command could change the Display Color for all of them, Proceed?'})
EmbedBuilder.warningEmbed = [warningEmbed];

//Warning UI
const yeah = new ButtonBuilder().setCustomId('y').setEmoji('✔️').setStyle(ButtonStyle.Success);
const nope = new ButtonBuilder().setCustomId('n').setEmoji('✖️').setStyle(ButtonStyle.Danger);
const proceedRow = new ActionRowBuilder().addComponents(yeah, nope);
ActionRowBuilder.proceedUi = [proceedRow];