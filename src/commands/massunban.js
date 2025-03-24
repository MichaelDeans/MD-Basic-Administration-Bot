const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
    name: 'massunban',
    description: 'Mass unban users from the main guild',
    async execute(message, args) {
        // Check if command is used in main guild
        if (message.guild.id !== config.mainGuildId) {
            return message.reply('This command can only be used in the main guild.');
        }

        // Check user permissions
        const userRoles = message.member.roles.cache;
        const hasPermission = Object.values(config.roles).some(role => 
            userRoles.has(role.id) && role.commands.includes('massunban')
        );

        if (!hasPermission) {
            return message.reply('You do not have permission to use this command.');
        }

        // Get user IDs to unban
        if (args.length === 0) {
            return message.reply('Please provide the user IDs to unban.');
        }

        const userIds = args;
        const results = [];
        const unbannedUsers = [];

        // Execute unbans
        for (const userId of userIds) {
            try {
                await message.guild.bans.remove(userId, `Mass unban by ${message.author.tag}`);
                results.push(`✅ Unbanned user ID: ${userId}`);
                unbannedUsers.push(userId);
            } catch (error) {
                results.push(`❌ Failed to unban user ID ${userId}: ${error.message}`);
            }
        }

        // Create unban log embed
        const logEmbed = new EmbedBuilder()
            .setTitle('Mass Unban Executed')
            .setColor('#00FF00')
            .setTimestamp()
            .addFields(
                { name: 'Moderator', value: message.author.tag },
                { name: 'Users Unbanned', value: unbannedUsers.join('\\n') || 'None' }
            );

        // Send results
        const logChannel = message.guild.channels.cache.get(config.channels.massunbanLogs);
        if (logChannel) {
            logChannel.send({ embeds: [logEmbed] });
        }

        message.reply(results.join('\\n'));
    },
};
