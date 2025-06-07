const fs = require('node:fs');
const path = require('node:path');
const http = require('http');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // Allows local .env use, safe on Render too

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load all commands from /commands folder
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[WARNING] The command at ${filePath} is missing required properties.`);
  }
}

// Event: Ready
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Event: Slash command interaction
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return interaction.reply({ content: '❌ Command not found.', ephemeral: true });
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error executing ${interaction.commandName}:`, error);
    await interaction.reply({ content: '❌ There was an error while executing this command.', ephemeral: true });
  }
});

// Start the bot
client.login(process.env.TOKEN);

// Minimal HTTP server to keep Render happy
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running!');
}).listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});
