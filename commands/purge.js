const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes messages')
    .addIntegerOption(option => option
      .setName('amount')
      .setDescription('Number of messages to delete')
      .setRequired(true)),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    if (!interaction.member.permissions.has('ManageMessages')) {
      return interaction.reply({ content: 'You need Manage Messages permission to use this.', ephemeral: true });
    }

    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: 'You must delete between 1 and 100 messages.', ephemeral: true });
    }

    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true });
  },
};
