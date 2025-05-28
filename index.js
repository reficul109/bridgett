//Packages
const fs = require('node:fs');
const path = require('node:path');
const {
  Client, Events, 
  GatewayIntentBits: GBIT, 
  Collection, 
  REST, Routes, 
  ActionRowBuilder: ROWS, 
  EmbedBuilder: EMBD,
  SlashCommandBuilder: SLAB
} = require('discord.js');

const intents = [GBIT.Guilds, GBIT.GuildMessages, GBIT.GuildMembers, GBIT.GuildPresences, GBIT.MessageContent, GBIT.DirectMessages];
const client = new Client({intents: intents, allowedMentions: {parse: ['users', 'roles']}});
const {token} = require('./token.json');
const rest = new REST().setToken(token);
const getColors = require('get-image-colors');
getColors.paletteCount = {count: 30}

//Variables and Utils
SLAB.prefix = 'br!';
SLAB.bID = "530502122190405652", SLAB.rID = "320398018060746752";
const games = ['with boxes!', 'boxie!', 'with more boxes!', 'boxie?', 'b word', '📦', 'Sokoban', 'with Lootboxes', 'cartitas pedorras', 'slay the spi-...', 'zzz...'];
const wBritt = ['britt', 'bridgett', '530502122190405652'], wBox = ['box', 'caja', 'boite', 'kahon', 'kiste', 'caixa', 'scatola', '箱', 'hako', '📦'];
const utils = require('./utils.js');

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
        else {console.log('Error en ' + filePath + '...')}
      }
  }

//Slash Command Loader
(async () => {
  try {
    console.log('Cargando ' + globalCommands.length + ' Comandos...');
    const data = await rest.put(Routes.applicationCommands(SLAB.bID), {body: globalCommands});
    await console.log('Comandos Cargados con Exito!')
  } catch (error) {console.error(error)}
})();

//Ready
client.once(Events.ClientReady, readyClient => {
  client.user.setPresence({activities: [{name: games[Math.floor(Math.random() * games.length)]}], status: 'online'});
  console.log('🐙');
});

//Flexible Response
SLAB.smartReply = function(cmd, ...args) {
  if (cmd.replied) {return cmd.followUp(...args);}
  else {return cmd.reply(...args);}
}

//Validity
isInvalid = async function(cmd, roles, command) {

  //Check if Arguments are Met (Message Commands)
  if (!cmd.options && !cmd.args) {
    
    if (command.correctMessageCommand) {
      return command.correctMessageCommand;}

    else {cmd.args = 'null'}
  
  }

  //Check if Server is Set-Up Correctly
  cmd.paletteRole = cmd.guild.roles.cache.find(role => role.name.startsWith("🎨") && role.name.endsWith("🎨"));
  if (command.checkPaletteRole && !cmd.paletteRole) {
    return 'Your Server is not Set-Up! (/setup)';}

  if (!roles.color) {

    //Check if A Color Role is Needed for the Command
    if (command.colorRoleRequired) {
      return 'You do not have ANY Color Role!?\nI cannot Work under these Conditions!\n(/customrole)';}

  } else {
    
    //Check if Role Editing is Needed for the Command
    if (command.checkColorEditable && !roles.color.editable) {
      return 'Not Enough Permissions to Update your Color Role...';}

    //Check if Role Protection Should Stop the Command
    if (command.protectColorRole && cmd.guild.members.me.roles.cache.get(roles.color)) {
      return 'I have Instructions to not Edit your Color Role...\nObtain a Custom Role First!\n(/customrole)';}

    //Warn Users if the Command Will Affect Multiple Users 
    if (command.warnMultipleEffect && roles.color.members.size > 1) {
      await SLAB.smartReply(cmd, {embeds: EMBD.warningEmbed(roles), components: ROWS.proceedUi}).then(function (botReply) {
        const collector = cmd.channel.createMessageComponentCollector({time: 600000});
        collector.on('collect', async userReply => {

          if (userReply.user.id != cmd.user.id) {return;}
          await userReply.deferUpdate();
          collector.stop();

          if (userReply.customId === 'y') {
            botReply.edit({content: ('Proceeding...'), embeds: [], components: []})
            try {await command.execute(cmd, roles)}

            catch (error) {
              console.error(error);
              SLAB.smartReply(cmd, {content: 'Error...', ephemeral: true})}}
            
          else {botReply.edit({content: ('Cancelled!'), embeds: [], components: []})}
        })
      });

      return 'Executing Remotely...';
    }
  }
}

//Slash Command Answer
client.on(Events.InteractionCreate, async iCom => {
  if (!iCom.isChatInputCommand()) {return;}
  const command = client.commands.get(iCom.commandName);
  if (!command) {return;}

  //Command Caution Handler
  var roles = iCom.member.roles;
  errorResponse = await isInvalid(iCom, roles, command);
  if (typeof errorResponse === 'string') {

    //Invalid Command Response
    if (errorResponse !== 'Executing Remotely...') {
      return SLAB.smartReply(iCom, errorResponse);}

  } else {

    //Perform Valid Commands
    try {await command.execute(iCom, roles)}

    catch (error) {
      console.error(error);
      SLAB.smartReply(iCom, {content: 'Error...', ephemeral: true})
    }
  }
});

//Auto-Palette
client.on('userUpdate', async (oldUser, newUser) => {
  if (oldUser.avatarURL() === newUser.avatarURL()) {return;}
  var memberPaletteGuilds = client.guilds.cache.filter(guild => guild.members.cache.get(newUser) && guild.members.cache.get(newUser).roles.cache.find(role => role.name.startsWith("🎨") && role.name.endsWith("🎨")));
  if (!memberPaletteGuilds.size) {return;}
  
  var page = 0;
  await getColors(newUser.displayAvatarURL({extension: 'png', forceStatic: true}), getColors.paletteCount).then(colors => {
  newUser.send({content: '<@' + newUser.id + '>, Pick a New Color!', embeds: EMBD.paletteEmbeds(colors, page), components: ROWS.paletteUI}).then(function (botReply) {

    const collector = botReply.channel.createMessageComponentCollector({time: 1800000});
    collector.on('collect', async userReply => {
      if (userReply.user.id != newUser.id) {return;}
      await userReply.deferUpdate();

      var btn = (parseInt(userReply.customId) || userReply.customId);
      switch (btn) {
        case '+':
          if (page < 4) {
            page++;
            botReply.edit({embeds: EMBD.paletteEmbeds(colors, page)})}
        break;

        case '-':
          if (page > 0) {
            page--;
            botReply.edit({embeds: EMBD.paletteEmbeds(colors, page)})}
        break;

        case 'x':
          collector.stop();
          botReply.edit({content: ('Cancelled!'), embeds: [], components: []})
        break;

        default:
          collector.stop();
          memberPaletteGuilds.forEach(guild => guild.members.cache.get(newUser).roles.color.setColor(colors[(btn + (page * 5) - 1)].toString()));
          botReply.edit({content: (colors[(btn + (page * 5) - 1)] + ' Selected!'), embeds: [], components: []})
        break;}
      })
  })})
})

//Britt Stuff
client.on(Events.MessageCreate, async mCom => {
  if (mCom.author.bot || mCom.system || !mCom.guild) {return;}
  var msgCon = mCom.content.toLowerCase();

  //Boxie
  if (wBox.some(word => msgCon.includes(word))) {
    mCom.react('📦');
    mCom.channel.send('Boxie!')}

  //Britt
  else if (wBritt.some(word => msgCon.includes(word))) {
    mCom.channel.send('Me!')}

  //Non-Prefix
  if (!msgCon.startsWith(SLAB.prefix)) {return;}
  var args = mCom.content.split(' ');
  var argresult = args.slice(1).join(' ');
  if (mCom.attachments.size) {var msgAtt = Array.from(mCom.attachments.values(), x => x.url)}

  //Safety Filter 1
  //reefs = client.guilds.cache.get("412116759668064256").members.cache.get(mCom.author)
  //if (!reefs || !reefs.roles.cache.get("458840596988035072")) {return;}

  //Say
  if (msgCon.startsWith(SLAB.prefix + 'say') && (argresult || msgAtt)) {
    if (client.channels.cache.get(args[1])) {
      client.channels.cache.get(args[1]).send({content: (args.slice(2).join(' ')), files: msgAtt});
      mCom.reply('Done!');

    } else if (client.users.cache.get(args[1])) {
      client.users.cache.get(args[1]).send({content: (args.slice(2).join(' ')), files: msgAtt});
      mCom.reply('Done!');

    } else {
      mCom.channel.send({content: argresult, files: msgAtt});
      mCom.delete()}}

  //Eval
  if (msgCon.startsWith(SLAB.prefix + 'eval ') && mCom.author.id === SLAB.rID) {
    try {
      eval(argresult);
      mCom.reply('Done!')} 
    catch (error) {
      console.log(error);
      mCom.reply("Error...")}}

  //Text Command Answer
  const command = client.commands.get(args[0].substring(SLAB.prefix.length));
  if (!command) {return;}

  //Command Caution Handler
  var roles = mCom.member.roles;
  mCom.args = argresult;
  errorResponse = await isInvalid(mCom, roles, command);
  if (typeof errorResponse === 'string') {

    //Invalid Command Response
    if (errorResponse !== 'Executing Remotely...') {
      return SLAB.smartReply(mCom, errorResponse);}

  } else {

    //Perform Valid Commands
    try {await command.execute(mCom, roles)}

    catch (error) {
      console.error(error);
      SLAB.smartReply(mCom, {content: 'Error...', ephemeral: true})
    }
  }
})

//Token
client.login(token);