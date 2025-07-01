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

//Client Stuff
const intents = [GBIT.Guilds, GBIT.GuildMessages, GBIT.GuildMembers, GBIT.GuildPresences, GBIT.MessageContent, GBIT.DirectMessages];
const client = new Client({intents: intents, allowedMentions: {parse: ['users', 'roles']}});
const {token} = require('token.json');
const rest = new REST().setToken(token);

//Variables and Utils
SLAB.prefix = 'br!';
SLAB.bID = "530502122190405652", SLAB.rID = "320398018060746752";
const games = ['with boxes!', 'boxie!', 'with more boxes!', 'boxie?', 'b word', '📦', 'Sokoban', 'with Lootboxes', 'Balatro ajsajdjas', 'zzz...'];
const wBritt = ['britt', 'bridgett', '530502122190405652'], wBox = ['box', 'caja', 'boite', 'kahon', 'kiste', 'caixa', 'scatola', '箱', 'hako', '📦'];
const utils = require('resources/utils.js');

//Slash Command Gather
const globalCommands = [];
client.commands = new Collection();
  const commandsPath = path.join(__dirname, 'commands/global');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
	  const filePath = path.join(commandsPath, file);
	  const command = require(filePath);
	  if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
	    globalCommands.push(command.data.toJSON())}
    else {console.log('Error en ' + filePath + '...')}
  }

//Slash Command Loader
(async () => {
  try {
    console.log('Cargando ' + globalCommands.length + ' Comandos...');
    await rest.put(Routes.applicationCommands(SLAB.bID), {body: globalCommands});
    console.log('Comandos Cargados con Exito!')} 
  catch (error) {
    console.error(error)}
})();

//Ready
client.once(Events.ClientReady, () => {
  client.user.setPresence({activities: [{name: games[Math.floor(Math.random() * games.length)]}], status: 'online'});
  console.log('🐙');
});

//Flexible Response
SLAB.smartReply = function(cmd, ...args) {
  if (typeof cmd.discriminator === 'string') {return cmd.send(...args).catch(() => {return;})}
  else if (cmd.replied) {return cmd.followUp(...args);}
  else {return cmd.reply(...args);}
}

//Database Check
checkData = async function(cmd) {
  if (!db.guildConfig.get(cmd.guild.id)) {
    const newRow = db.prepare("INSERT INTO paletteRoles (guildID, roleID, pauseFunc, funAllowed) VALUES (?, ?, ?, ?)")
    newRow.run(cmd.guild.id, 'N', 'N', 'Y')}
  cmd.guild.config = db.guildConfig.get(cmd.guild.id)
}

/* Validity
Returns an Error Message String if the Command Cannot Continue
Returns Nothing if the Command Can Continue
*/
isInvalid = async function(cmd, roles, command) {

  //Check if User is Allowed to Use this Command
  if (command.adminCommand && cmd.member.id !== SLAB.rID) {
    return 'You are not Allowed to do That!';}

  //Check if There is Enough User Input
  if (!cmd.options && !cmd.args) {
    
    //No User Input Error (Message Commands)
    if (command.correctMessageCommand) {
      return command.correctMessageCommand;}

    else {cmd.args = 'No Args'}}

  //Check if Server is Set-Up Correctly
  cmd.paletteRole = cmd.guild.roles.cache.find(role => role.name.startsWith("🎨") && role.name.endsWith("🎨"));
  if (command.checkPaletteRole && !cmd.paletteRole) {
    return 'Your Server is not Set-Up! (/setup)';}

  //Check if A Color Role is Needed for this Command
  if (!roles.color) {

    if (command.colorRoleRequired) {
      return 'You do not have ANY Color Role!?\nI cannot Work under these Conditions!\n(/help)';}

  } else {
    
    //Check if Role Editing is Needed for this Command
    if (command.checkColorEditable && !roles.color.editable) {
      return 'Not Enough Permissions to Update your Color Role...';}

    //Check if Role Protection Should Stop this Command
    if (command.protectColorRole && cmd.guild.members.me.roles.cache.get(roles.color)) {
      return 'I have Instructions to not Edit your Color Role...\nObtain a Custom Role First!\n(/help)';}

    //Warn Users if this Command Will Affect Multiple Users 
    if (command.warnMultipleEffect && roles.color.members.size > 1) {
      await SLAB.smartReply(cmd, {embeds: EMBD.warningEmbed(roles), components: ROWS.proceedUi}).then(function (botReply) {
        
        var filterMessage = botReply;
        if (typeof cmd.commandName === 'string') {cmd.fetchReply().then(reply => {filterMessage = reply;})}

        const collector = cmd.channel.createMessageComponentCollector({time: 600000});
        collector.on('collect', async userReply => {
          if (userReply.message != filterMessage.id) {return;}
          await userReply.deferUpdate();
          if (userReply.user.id != cmd.member.id) {return;}
          collector.stop();

          if (userReply.customId === 'y') {
            botReply.edit({content: ('Proceeding...'), embeds: [], components: []})
            try {await command.execute(cmd, roles);}

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

//Command Handler
handleCommand = async function(cmd, command) {

  //Perform with Caution
  var roles = cmd.member.roles;
  var errorResponse = await isInvalid(cmd, roles, command);
  if (typeof errorResponse === 'string') {

    //Invalid Command Response
    if (errorResponse !== 'Executing Remotely...') {
      return SLAB.smartReply(cmd, errorResponse);}

  } else {

    //Perform Valid Commands
    try {await command.execute(cmd, roles);}

    catch (error) {
      console.error(error);
      SLAB.smartReply(cmd, {content: 'Error...', ephemeral: true})
    }
  }
}

//Slash Command Answer
client.on(Events.InteractionCreate, async iCom => {
  if (!iCom.isChatInputCommand()) {return;}
  const command = client.commands.get(iCom.commandName);
  if (!command) {return;}

  checkData(iCom);

  handleCommand(iCom, command);
});

//Auto-Palette
client.on('userUpdate', async (oldUser, newUser) => {
  if (oldUser.avatarURL() === newUser.avatarURL()) {return;}
  const autoPalette = client.commands.get('palette');
  newUser.args = 'No Args';
  
  await autoPalette.execute(newUser, null)
});

//Britt Stuff
client.on(Events.MessageCreate, async mCom => {
  if (mCom.author.bot || mCom.system || !mCom.guild) {return;}
  var msgCon = mCom.content.toLowerCase();

  checkData(mCom);

  if (mCom.guild.config.funAllowed === 'Y') {
    //Boxie
    if (wBox.some(word => msgCon.includes(word))) {
      mCom.react('📦');
      mCom.channel.send('Boxie!')}

    //Britt
    else if (wBritt.some(word => msgCon.includes(word))) {
      mCom.channel.send('Me!')}}

  //Non-Prefix
  if (!msgCon.startsWith(SLAB.prefix)) {return;}
  var args = mCom.content.split(' ');
  var argresult = args.slice(1).join(' ');
  if (mCom.attachments.size) {var msgAtt = Array.from(mCom.attachments.values(), x => x.url)}

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

  //Text Command Answer
  const command = client.commands.get(args[0].substring(SLAB.prefix.length));
  if (!command) {return;}
  mCom.args = argresult;

  handleCommand(mCom, command);
});

//Token
client.login(token);