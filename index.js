//Variables
const prefix = 'br!';
const bID = "530502122190405652", rID = "320398018060746752";
const games = ['with boxes!', 'boxie!', 'with more boxes!', 'boxie?', 'b word', '📦', 'cartitas pedorras', 'zzz'];
const wBritt = ['britt', 'bridgett', '530502122190405652'], wBox = ['box', 'caja', 'boite', 'kahon', 'kiste', 'caixa', 'scatola', '箱', 'hako', '📦'];
const avyGuilds = ["412116759668064256", "707295290461257760"], avyRoles = ["584594259550797824", "737786182116573185"];

//Packages
const fs = require('node:fs');
const path = require('node:path');
const {Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages];
const client = new Client({intents: [intents], allowedMentions: {parse: ['users', 'roles']}});
const getColors = require('get-image-colors');

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
		  	globalCommands.push(command.data.toJSON())
		  } else {
		  	console.log('Error en ' + filePath + '...')}}}

const rest = new REST().setToken(process.env.TOKEN);

//Slash Command Loader
(async () => {
	try {
		console.log('Cargando ' + (globalCommands.length) + ' Comandos.');
		const data = await rest.put(Routes.applicationCommands(bID), {body: globalCommands});
		await console.log('Comandos Cargados con Exito!');
	} catch (error) {
		console.error(error);}})();

//Ready
client.once(Events.ClientReady, readyClient => {
  client.user.setPresence({activities: [{name: games[Math.floor(Math.random() * games.length)]}], status: 'online'});            
  console.log('🐙')});

//Slash Command Receiver
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {return;}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({content: 'Error...', ephemeral: true});
		} else {
			await interaction.reply({content: 'Error...', ephemeral: true})}}
  });

//Auto-Palette
client.on('userUpdate', async (oldUser, newUser) => {
  if (oldUser.avatarURL() === newUser.avatarURL()) {return;}
  
  var cq80 = false, mutacolor = false;
  var reefs = await client.guilds.cache.get(avyGuilds[0]);
  var reefsMember = await reefs.members.cache.get(newUser.id);
  if (reefsMember) {
    if (reefsMember.roles.cache.get(avyRoles[0])) {cq80 = true;}}

  var SDJ = await client.guilds.cache.get(avyGuilds[1]);
  var SDJMember = await SDJ.members.cache.get(newUser.id);
  if (SDJMember) {
    if (SDJMember.roles.cache.get(avyRoles[1])) {mutacolor = true;}}
  
  if (!(cq80 || mutacolor)) {return;}

  var pagina = 0;
  const colorOptions = {count: 30}
  function colorPalette(colors) {return ('<@' + newUser.id + '>, Pick a New Color!\nhttps://encycolorpedia.com/' + colors[0 + (pagina * 5)] .toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[1 + (pagina * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[2 + (pagina * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[3 + (pagina * 5)].toString().substring(1) + '\nhttps://encycolorpedia.com/' + colors[4 + (pagina * 5)].toString().substring(1));}

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
  
  await getColors(newUser.displayAvatarURL({extension: 'png', forceStatic: true}), colorOptions).then(colors => {
  newUser.send({content: colorPalette(colors), components: [colorRow, optionRow]}).then(function (nInteraction) {

      const collector = nInteraction.channel.createMessageComponentCollector({time: 1800000});
      collector.on('collect', async cInteraction => {
        await cInteraction.deferUpdate();

        var btn = (parseInt(cInteraction.customId) || cInteraction.customId);
        switch (btn) {

          case '+':
            if (pagina < 4) {
              pagina++;
              nInteraction.edit(colorPalette(colors))}
          break;

          case '-':
            if (pagina > 0) {
              pagina--;
              nInteraction.edit(colorPalette(colors))}
          break;

          case 'x':
            collector.stop();
            nInteraction.edit({content: ('Cancelled!'), components: []});
          break;

          default:
            if (cq80) {reefsMember.roles.color.setColor(colors[(btn + (pagina * 5) - 1)].toString());}
            if (mutacolor) {SDJMember.roles.color.setColor(colors[(btn + (pagina * 5) - 1)].toString());}
            collector.stop();
            nInteraction.edit({content: (colors[(btn + (pagina * 5) - 1)] + ' Selected!'), components: []});
          break;}
        })
    })})
})

//Britt Stuff
client.on(Events.MessageCreate, message => {
  if (message.author.bot || message.system) return;
  var msgCon = message.content.toLowerCase();
  
  //Boxie
  if (wBox.some(word => msgCon.includes(word))) {
    message.react('📦')
    message.channel.send('Boxie!')}
  
  //Britt
  else if (wBritt.some(word => msgCon.includes(word))) {
    message.channel.send('Me!')}
  
  //Non-Prefix
  if (!msgCon.startsWith(prefix)) return;
  var args = message.content.split(' ')
  var argresult = args.slice(1).join(' ')
  if (message.attachments.size) {var msgAtt = Array.from(message.attachments.values(), x => x.url)}
  
  //Say
  if (msgCon.startsWith(prefix + 'say') && (argresult || msgAtt)) {
    if (client.channels.cache.get(args[1])) {
      client.channels.cache.get(args[1]).send({content: (args.slice(2).join(' ')), attachments: msgAtt});
      message.reply('Done!')}
    
    else if (client.users.cache.get(args[1])) {
      client.users.cache.get(args[1]).send({content: (args.slice(2).join(' ')), files: msgAtt});
      message.reply('Done!')}
    
    else {
      message.channel.send({content: argresult, files: msgAtt})
      if (message.guild) {message.delete()}}}
  
  //Eval
  if (msgCon.startsWith(prefix + 'eval ') && message.author.id === rID) {
    eval(argresult)
    message.reply('Done!')}
  
})

//Token
client.login(process.env.TOKEN);