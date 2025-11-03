//Packages
const fs = require("node:fs");
const path = require("node:path");
const {
  Client, Events, 
  GatewayIntentBits: GBIT, 
  Collection, 
  REST, Routes, 
  ActionRowBuilder: ROWS, 
  EmbedBuilder: EMBD,
  SlashCommandBuilder: SLAB
} = require("discord.js");

const db = require("better-sqlite3")("./resources/BrittData.db");

//Client Setup Stuff
const intents = [GBIT.Guilds, GBIT.GuildMessages, GBIT.GuildMembers, GBIT.GuildPresences, GBIT.MessageContent, GBIT.DirectMessages];
const client = new Client({intents: intents, allowedMentions: {parse: ["users", "roles"]}});
const {token} = require("./token.json");
const rest = new REST().setToken(token);

//Bot Variables
SLAB.prefix = "br!";
const bID = "530502122190405652", rID = "320398018060746752";
const games = ["with boxes!", "boxie!", "with more boxes!", "boxie?", "b word", "📦", "Sokoban", "with Lootboxes", "Balatro ajsajdjas", "zzz..."];
const wBritt = ["britt", "bridgett", "530502122190405652"], wBox = ["box", "caja", "boite", "kahon", "kiste", "caixa", "scatola", "箱", "hako", "📦"];

//Functions and Utils
const utils = require("./resources/utils.js")
const colorUtils = require("./resources/colorUtils.js");
const colorBrowse = require("./resources/colorBrowse.js")

//Slash Command Files Gather
const globalCommands = [];
client.commands = new Collection();
  const commandsPath = path.join(__dirname, "commands/global");
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
  for (const file of commandFiles) {
	  const filePath = path.join(commandsPath, file);
	  const command = require(filePath);
	  if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command)
	    globalCommands.push(command.data.toJSON())}
    else {console.log("Error en " + filePath + "...")}
  }

//Slash Command Files Loader
(async () => {
  try {
    console.log("Cargando " + globalCommands.length + " Comandos...")
    await rest.put(Routes.applicationCommands(bID), {body: globalCommands})
    console.log("Comandos Cargados con Exito!")} 
  catch (error) {
    console.error(error)}
})();

//Ready
client.once(Events.ClientReady, () => {
  client.user.setPresence({activities: [{name: games[Math.floor(Math.random() * games.length)]}], status: "online"})
  console.log("🐙")
});

//Server Check (Assigns .guildConfig)
findGuildConfig = function(cmd) {
  if (!db.guildConfigs.get(cmd.guild.id)) {db.newRow.run(cmd.guild.id, "None", "Enabled", "Enabled")}
  cmd.guildConfig = db.guildConfigs.get(cmd.guild.id);
}

//Flexible Response
SLAB.smartReply = function(cmd, ...args) {
  if (!cmd.guild) {return cmd.send(...args);}
  else if (cmd.replied) {return cmd.followUp(...args);}
  else {return cmd.reply(...args);}
}

/* Validity
Returns an Error Message String if the Command Cannot Continue
Returns Nothing if the Command Can Continue
*/
isInvalid = async function(cmd, instructs) {

  //Check if User is Allowed to Use this Command
  if (instructs.adminCommand && cmd.member.id !== rID) {
    return "You are not Allowed to do That!";}

  //Check if There is Enough User Input
  if (!cmd.options && !cmd.argRes) {
    
    //No User Input Error (Message Commands)
    if (instructs.correctMessageCommand) {return instructs.correctMessageCommand;}
    else {cmd.argRes = "No Args";}}

  //Check if Server is Set-Up Correctly
  cmd.paletteRole = cmd.guild.roles.cache.get(cmd.guildConfig.roleID);
  if (instructs.checkPaletteRole && !cmd.paletteRole) {
    if (instructs.skipChecks_disableUI) {cmd.isLimited = true;}
    
    return "Your Server is not Set-Up! (/setup)";}

  //Check if Role Editing is Needed and Paused
  if (instructs.checkColorEditable && cmd.guildConfig.pauseFunc === "Enabled")  {
    if (instructs.skipChecks_disableUI) {cmd.isLimited = true;}

    return "Your Server is Currently not Allowing Role Color Editing...";}

  //Check if A Color Role is Needed for this Command
  if (!cmd.color) {

    if (instructs.colorRoleRequired) {
      if (instructs.skipChecks_disableUI) {cmd.isLimited = true;}

      return "You do not have ANY Color Role!?\nGet a Role so I can Edit It!\n(/help)";}

  } else {
    
    //Check if Role Editing is Needed for this Command
    if (instructs.checkColorEditable && !cmd.color.editable) {
      if (instructs.skipChecks_disableUI) {cmd.isLimited = true;}

      return "Not Enough Permissions for Me to Update your Color Role...";}

    //Check if Role Protection Should Stop this Command
    if (instructs.protectColorRole && cmd.me.roles.cache.get(cmd.color.id)) {
      if (instructs.skipChecks_disableUI) {cmd.isLimited = true;}

      return "I have Instructions to not Edit your Color Role...\nObtain a Custom Role First!\n(/help)";}

    //Warn Users if this Command Will Affect Multiple Users 
    if (instructs.warnMultipleEffect && cmd.color.members.size > 1) {
      await SLAB.smartReply(cmd, {embeds: EMBD.warningEmbed(cmd.color), 
      components: ROWS.proceedUi}).then(function (botReply) {

        //Filter Message
        SLAB.findCollectorFilter(cmd, botReply)

        //Filtered Collector
        const collector = cmd.channel.createMessageComponentCollector({time: 600000});
        collector.on("collect", async userReply => {
          if (userReply.message.id !== botReply.filterMessage) {return;}
          await userReply.deferUpdate()
          if (userReply.user.id !== cmd.member.id) {return;}
          collector.stop()

          ///Execute Command Under Caution 
          if (userReply.customId === "Yes") {
            botReply.edit({content: "Proceeding...", embeds: [], components: []})
            try {await instructs.execute(cmd)}

            catch (error) {
              console.error(error)
              SLAB.smartReply(cmd, {content: "Error...", ephemeral: true})}}
          
          //Abort Execution
          else {botReply.edit({content: "Cancelled!", embeds: [], components: []})}
        })
      })
      return "Executing Remotely...";
    }
  }
}

//Command Handler (Slash and Text)
handleCommand = async function(cmd, instructs) {
  cmd.color = cmd.member.roles.color
  cmd.me = cmd.guild.members.me;

  //Run Global Failsafes + Executions Under Caution 
  var errorResponse = await isInvalid(cmd, instructs);
  if (errorResponse && !cmd.isLimited) {

    //Invalid Command Response
    if (errorResponse !== "Executing Remotely...") {
      SLAB.smartReply(cmd, errorResponse)}

  } else {

    //Perform Valid Commands + Limited Commands
    cmd.isLimited = errorResponse;
    try {await instructs.execute(cmd)}

    catch (error) {
      console.error(error);
      SLAB.smartReply(cmd, {content: "Error...", ephemeral: true})
    }
  }
}

//Slash Command Answer
client.on(Events.InteractionCreate, async iCom => {
  if (!iCom.isChatInputCommand()) {return;}
  const instructs = client.commands.get(iCom.commandName);
  if (!instructs) {return;}

  await findGuildConfig(iCom);

  handleCommand(iCom, instructs)
});

//Auto-Palette
client.on("userUpdate", async (oldUser, newUser) => {
  if (newUser.bot || newUser.system) {return;}
  if (oldUser.avatarURL() === newUser.avatarURL()) {return;}
  const autoPalette = client.commands.get("palette");
  
  autoPalette.execute(newUser)
});

//Silly Britt Stuff + Text Command Answer
client.on(Events.MessageCreate, async mCom => {
  if (mCom.author.bot || mCom.system || !mCom.guild) {return;}

  await findGuildConfig(mCom);
  var msgCon = mCom.content.toLowerCase();

  //Message Reactions
  if (mCom.guildConfig.funAllowed === "Enabled") {
    if (wBox.some(word => msgCon.includes(word))) {
      mCom.react("📦")
      mCom.channel.send("Boxie!")

    } else if (wBritt.some(word => msgCon.includes(word))) {
      mCom.channel.send("Me!")}}

  //Non-Prefix
  if (!msgCon.startsWith(SLAB.prefix)) {return;}
  var args = mCom.content.split(" ");
  mCom.argRes = args.slice(1).join(" ");
  if (mCom.attachments.size) {var msgAtt = Array.from(mCom.attachments.values(), x => x.url)}

  //Say
  if (msgCon.startsWith(SLAB.prefix + "say") && (mCom.argRes || msgAtt)) {
    if (client.channels.cache.get(args[1])) {
      client.channels.cache.get(args[1]).send({content: (args.slice(2).join(" ")), files: msgAtt})
      mCom.reply("Done!")

    } else if (client.users.cache.get(args[1])) {
      client.users.cache.get(args[1]).send({content: (args.slice(2).join(" ")), files: msgAtt})
      mCom.reply("Done!")

    } else {
      mCom.channel.send({content: mCom.argRes, files: msgAtt})
      mCom.delete()}}

  //Text Command Answer
  const instructs = client.commands.get(args[0].substring(SLAB.prefix.length));
  if (!instructs) {return;}

  handleCommand(mCom, instructs)
});

//Token
client.login(token)