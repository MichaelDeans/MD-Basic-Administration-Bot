const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
    name: 'massban',
    description: 'Mass ban users from the main guild',
    async execute(message, args) {
        // Check if command is used in main guild
        if (message.guild.id !== config.mainGuildId) {
            return message.reply('This command can only be used in the main guild.');
        }

        // Check user permissions
        const userRoles = message.member.roles.cache;
        const hasPermission = Object.values(config.roles).some(role => 
            userRoles.has(role.id) && role.commands.includes('massban')
        );

        if (!hasPermission) {
            return message.reply('You do not have permission to use this command.');
        }

        // Get users to ban
        const users = message.mentions.users;
        if (users.size === 0) {
            return message.reply('Please mention the users you want to ban.');
        }

        // Create ban log embed
        const logEmbed = new EmbedBuilder()
            .setTitle('Mass Ban Executed')
            .setColor('#FF0000')
            .setTimestamp()
            .addFields(
                { name: 'Moderator', value: message.author.tag },
                { name: 'Users Banned', value: users.map(user => user.tag).join('\\n') }
            );

        // Execute bans
        const results = [];
        for (const [_, user] of users) {
            try {
                await message.guild.members.ban(user, { reason: `Mass ban by ${message.author.tag}` });
                results.push(`✅ Banned ${user.tag}`);
            } catch (error) {
                results.push(`❌ Failed to ban ${user.tag}: ${error.message}`);
            }
        }

        // Send results
        const logChannel = message.guild.channels.cache.get(config.channels.massbanLogs);
        if (logChannel) {
            logChannel.send({ embeds: [logEmbed] });
        }

        message.reply(results.join('\\n'));
    },
};
