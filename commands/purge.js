const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes a number of messages from a channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setRequired(true)),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: '⚠️ Please provide a number between 1 and 100.', ephemeral: true });
    }

    // Defer reply to avoid timeouts
    await interaction.deferReply({ ephemeral: true });

    try {
      const deletedMessages = await interaction.channel.bulkDelete(amount, true);
      await interaction.editReply(`🧹 Successfully deleted ${deletedMessages.size} messages.`);
    } catch (error) {
      console.error('Purge Error:', error);
      await interaction.editReply('❌ Failed to delete messages. I might not have permission or messages are too old (14+ days).');
    }
  }
};
