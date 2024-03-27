//Variables
const prefix = 'br!';
const bID = "530502122190405652", rID = "320398018060746752";
const games = ['with boxes!', 'boxie!', 'with more boxes!', 'boxie?', 'b word', '📦', 'cartitas pedorras', 'slay the spi-...', 'zzz...'];
const wBritt = ['britt', 'bridgett', '530502122190405652'], wBox = ['box', 'caja', 'boite', 'kahon', 'kiste', 'caixa', 'scatola', '箱', 'hako', '📦'];
const utils = require('./utils.js');
const {token} = require('./token.json');

//Packages
const fs = require('node:fs');
const path = require('node:path');
const {Client, Events, GatewayIntentBits, Collection, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages];
const client = new Client({intents: [intents], allowedMentions: {parse: ['users', 'roles']}});

const getColors = require('get-image-colors');
getColors.paletteCount = {count: 30}
getColors.paletteMessage = function(colors, page, usID) {return ('<@' + usID + '>, Pick a New Color!\nhttps://encycolorpedia.com/' + colors[0 + (page * 5)] .toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[1 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[2 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[3 + (page * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[4 + (page * 5)].toString().substring(1));}

//Slash Command Gather
const globalCommands = [];
client.commands = new Collection();
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
	      const filePath = path.join(commandsPath, file);
	      const command = require(filePath);
	      if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
	        globalCommands.push(command.data.toJSON())}
        else {console.log('Error en ' + filePath + '...')}}}

const rest = new REST().setToken(token);

//Slash Command Loader
(async () => {
  try {
    console.log('Cargando ' + globalCommands.length + ' Comandos...');
    const data = await rest.put(Routes.applicationCommands(bID), {body: globalCommands});
    await console.log('Comandos Cargados con Exito!')
  } catch (error) {console.error(error)}
})();

//Ready
client.once(Events.ClientReady, readyClient => {
  client.user.setPresence({activities: [{name: games[Math.floor(Math.random() * games.length)]}], status: 'online'});
  console.log('🐙');
  console.log(getColors.superSecretFunny)
});

//Slash Command Answer
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) {return;}
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {return;}

  interaction.replyOrFollow = function(...args) {
    if (interaction.replied) {return interaction.followUp(...args);}
    else {return interaction.reply(...args);}}

  var roles = interaction.member.roles;
  
  if (!roles.color) {

    if (command.colorRoleRequired) {
      return interaction.reply('You do not have ANY Color Role!?\nI cannot Work under these Conditions!\n(/customrole)');
    }

  } else {

    if (command.checkColorEditable && !roles.color.editable) {
      return interaction.reply('Not Enough Permissions to Update your Color Role...');
    }

    if (command.protectColorRole && interaction.guild.members.me.roles.cache.get(roles.color.id)) {
      return interaction.reply('I have Instructions to not Edit your Color Role...\nObtain a Custom Role First!\n(/customrole)');
    }

    if (command.warnMultipleEffect) {
      if (roles.color.members.size > 1) {
        const warningEmbed = new EmbedBuilder()
        .setColor("#f2003c")
        .addFields({name: "Caution!", value: roles.color.members.size + ' Users have the <@&' + roles.color.id + '> Role...\nYour Command could change the Display Color for all of them, Proceed?'})

        const yeah = new ButtonBuilder().setCustomId('y').setEmoji('✔️').setStyle(ButtonStyle.Success);
        const nope = new ButtonBuilder().setCustomId('n').setEmoji('✖️').setStyle(ButtonStyle.Danger);
        const optionRow = new ActionRowBuilder().addComponents(yeah, nope);

        await interaction.reply({embeds: [warningEmbed], components: [optionRow]}).then(function (nInteraction) {

          const collector = interaction.channel.createMessageComponentCollector({time: 600000});
          collector.on('collect', async cInteraction => {
            if (cInteraction.member.id != interaction.user.id) {return;}
            await cInteraction.deferUpdate();
            collector.stop();

            if (cInteraction.customId === 'y') {
              nInteraction.edit({content: ('Proceeding...'), embeds: [], components: []})
              try {await command.execute(interaction, roles)}

              catch (error) {
                console.error(error);
                interaction.followUp({content: 'Error...', ephemeral: true})}} 
            
            else {return nInteraction.edit({content: ('Cancelled!'), embeds: [], components: []});}})});

        return;

    }}
  }

  try {await command.execute(interaction, roles)}

  catch (error) {
    console.error(error);
    interaction.replyOrFollow({content: 'Error...', ephemeral: true})}
});

//Auto-Palette
const more = new ButtonBuilder().setCustomId('+').setEmoji('➕').setStyle(ButtonStyle.Success);
const less = new ButtonBuilder().setCustomId('-').setEmoji('➖').setStyle(ButtonStyle.Success);
const none = new ButtonBuilder().setCustomId('x').setEmoji('✖️').setStyle(ButtonStyle.Danger);

const color1 = new ButtonBuilder().setCustomId('1').setEmoji('1️⃣').setStyle(ButtonStyle.Primary);
const color2 = new ButtonBuilder().setCustomId('2').setEmoji('2️⃣').setStyle(ButtonStyle.Primary);
const color3 = new ButtonBuilder().setCustomId('3').setEmoji('3️⃣').setStyle(ButtonStyle.Primary);
const color4 = new ButtonBuilder().setCustomId('4').setEmoji('4️⃣').setStyle(ButtonStyle.Primary);
const color5 = new ButtonBuilder().setCustomId('5').setEmoji('5️⃣').setStyle(ButtonStyle.Primary);

const colorRow = new ActionRowBuilder().addComponents(color1, color2, color3, color4, color5);
const optionRow = new ActionRowBuilder().addComponents(more, less, none);

client.on('userUpdate', async (oldUser, newUser) => {
  if (oldUser.avatarURL() === newUser.avatarURL()) {return;}

  var memberPaletteGuilds = client.guilds.cache.filter(guild => guild.members.cache.get(newUser.id) && guild.members.cache.get(newUser.id).roles.cache.find(role => role.name.startsWith("🎨") && role.name.endsWith("🎨")));
  if (!memberPaletteGuilds.size) {return;}
  
  var page = 0;
  await getColors(newUser.displayAvatarURL({extension: 'png', forceStatic: true}), getColors.paletteCount).then(colors => {
  newUser.send({content: getColors.paletteMessage(colors, page, newUser.id), components: [colorRow, optionRow]}).then(function (nInteraction) {

    const collector = nInteraction.channel.createMessageComponentCollector({time: 1800000});
    collector.on('collect', async cInteraction => {
      await cInteraction.deferUpdate();

      var btn = (parseInt(cInteraction.customId) || cInteraction.customId);
      switch (btn) {
        case '+':
          if (page < 4) {
            page++;
            nInteraction.edit(getColors.paletteMessage(colors, page, newUser.id))}
        break;

        case '-':
          if (page > 0) {
            page--;
            nInteraction.edit(getColors.paletteMessage(colors, page, newUser.id))}
        break;

        case 'x':
          collector.stop();
          nInteraction.edit({content: ('Cancelled!'), components: []});
        break;

        default:
          collector.stop();
          memberPaletteGuilds.forEach(guild => guild.members.cache.get(newUser.id).roles.color.setColor(colors[(btn + (page * 5) - 1)].toString()));
          nInteraction.edit({content: (colors[(btn + (page * 5) - 1)] + ' Selected!'), components: []});
        break;}
      })
  })})
})

//Britt Stuff
client.on(Events.MessageCreate, message => {
  if (message.author.bot || message.system) {return;}
  var msgCon = message.content.toLowerCase();

  //Boxie
  if (wBox.some(word => msgCon.includes(word))) {
    message.react('📦');
    message.channel.send('Boxie!')}

  //Britt
  else if (wBritt.some(word => msgCon.includes(word))) {
    message.channel.send('Me!')}

  //Non-Prefix
  if (!msgCon.startsWith(prefix)) {return;}
  var args = message.content.split(' ');
  var argresult = args.slice(1).join(' ');
  if (message.attachments.size) {var msgAtt = Array.from(message.attachments.values(), x => x.url)}

  //Say
  if (msgCon.startsWith(prefix + 'say') && (argresult || msgAtt)) {
    if (client.channels.cache.get(args[1])) {
      client.channels.cache.get(args[1]).send({content: (args.slice(2).join(' ')), files: msgAtt});
      message.reply('Done!');

    } else if (client.users.cache.get(args[1])) {
      client.users.cache.get(args[1]).send({content: (args.slice(2).join(' ')), files: msgAtt});
      message.reply('Done!');

    } else {
      message.channel.send({content: argresult, files: msgAtt});
      if (message.guild) {message.delete()}}}

  //Eval
  if (msgCon.startsWith(prefix + 'eval ') && message.author.id === rID) {
    try {
      eval(argresult);
      message.reply('Done!')} 
    catch (error) {
      console.log(error);
      message.reply("Error...")}}
})

//Token
client.login(token);