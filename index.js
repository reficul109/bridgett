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
const {Client, Events, GatewayIntentBits, Collection, REST, Routes, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages];
const client = new Client({intents: intents, allowedMentions: {parse: ['users', 'roles']}});
const rest = new REST().setToken(token);
const getColors = require('get-image-colors');
getColors.paletteCount = {count: 30}

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
});

//Slash Command Answer
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) {return;}
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {return;}

  //Flexible Response
  interaction.replyOrFollow = function(...args) {
    if (interaction.replied) {return interaction.followUp(...args);}
    else {return interaction.reply(...args);}}

  //Check if Server is Set-Up Correctly
  interaction.paletteRole = interaction.guild.roles.cache.find(role => role.name.startsWith("🎨") && role.name.endsWith("🎨"));
  if (command.checkPaletteRole && !interaction.paletteRole) {
    return interaction.replyOrFollow('Your Server is not Set-Up! (/setup)');
  }

  var roles = interaction.member.roles;  
  if (!roles.color) {

    if (command.colorRoleRequired) {
      return interaction.replyOrFollow('You do not have ANY Color Role!?\nI cannot Work under these Conditions!\n(/customrole)');
    }

  } else {
    
    if (command.checkColorEditable && !roles.color.editable) {
      return interaction.replyOrFollow('Not Enough Permissions to Update your Color Role...');
    }

    if (command.protectColorRole && interaction.guild.members.me.roles.cache.get(roles.color.id)) {
      return interaction.replyOrFollow('I have Instructions to not Edit your Color Role...\nObtain a Custom Role First!\n(/customrole)');
    }

    if (command.warnMultipleEffect && roles.color.members.size > 1) {
      await interaction.replyOrFollow({embeds: EmbedBuilder.warningEmbed(roles), components: ActionRowBuilder.proceedUi}).then(function (nInteraction) {
        const collector = interaction.channel.createMessageComponentCollector({time: 600000});
        collector.on('collect', async cInteraction => {

          if (cInteraction.user.id != interaction.user.id) {return;}
            await cInteraction.deferUpdate();
            collector.stop();

          if (cInteraction.customId === 'y') {
            nInteraction.edit({content: ('Proceeding...'), embeds: [], components: []})
            try {await command.execute(interaction, roles)}

            catch (error) {
                console.error(error);
              interaction.followUp({content: 'Error...', ephemeral: true})}} 
            
          else {nInteraction.edit({content: ('Cancelled!'), embeds: [], components: []})}
        })
      });
    return;
    }
  }

  try {await command.execute(interaction, roles)}

  catch (error) {
    console.error(error);
    interaction.replyOrFollow({content: 'Error...', ephemeral: true})}
});

//Auto-Palette
client.on('userUpdate', async (oldUser, newUser) => {
  if (oldUser.avatarURL() === newUser.avatarURL()) {return;}
  var memberPaletteGuilds = client.guilds.cache.filter(guild => guild.members.cache.get(newUser.id) && guild.members.cache.get(newUser.id).roles.cache.find(role => role.name.startsWith("🎨") && role.name.endsWith("🎨")));
  if (!memberPaletteGuilds.size) {return;}
  
  var page = 0;
  await getColors(newUser.displayAvatarURL({extension: 'png', forceStatic: true}), getColors.paletteCount).then(colors => {
  newUser.send({content: '<@' + newUser.id + '>, Pick a New Color!', embeds: EmbedBuilder.paletteEmbeds(colors, page), components: ActionRowBuilder.paletteUI}).then(function (nInteraction) {

    const collector = nInteraction.channel.createMessageComponentCollector({time: 1800000});
    collector.on('collect', async cInteraction => {
      if (cInteraction.message.id != nInteraction.id) {return;}
      await cInteraction.deferUpdate();

      var btn = (parseInt(cInteraction.customId) || cInteraction.customId);
      switch (btn) {
        case '+':
          if (page < 4) {
            page++;
            nInteraction.edit({embeds: EmbedBuilder.paletteEmbeds(colors, page)})}
        break;

        case '-':
          if (page > 0) {
            page--;
            nInteraction.edit({embeds: EmbedBuilder.paletteEmbeds(colors, page)})}
        break;

        case 'x':
          collector.stop();
          nInteraction.edit({content: ('Cancelled!'), embeds: [], components: []})
        break;

        default:
          collector.stop();
          memberPaletteGuilds.forEach(guild => guild.members.cache.get(newUser.id).roles.color.setColor(colors[(btn + (page * 5) - 1)].toString()));
          nInteraction.edit({content: (colors[(btn + (page * 5) - 1)] + ' Selected!'), embeds: [], components: []})
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

  //Safety Filter 1
  reefs = client.guilds.cache.get("412116759668064256").members.cache.get(message.author.id)
  if (!reefs || !reefs.roles.cache.get("458840596988035072")) {return;}

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

  //Color -- Unrestricted --
  else if (msgCon.startsWith(prefix + 'color ')) {
    if (!message.guild) {return;}
    if (argresult === "000000") {return message.reply("Discord doesn't like this color...")}
    message.member.roles.color.setColor(argresult).catch(() => message.reply('Error.'))
    message.reply("Set!")}
   
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