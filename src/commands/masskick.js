const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
    name: 'masskick',
    description: 'Mass kick users from the main guild',
    async execute(message, args) {
        // Check if command is used in main guild
        if (message.guild.id !== config.mainGuildId) {
            return message.reply('This command can only be used in the main guild.');
        }

        // Check user permissions
        const userRoles = message.member.roles.cache;
        const hasPermission = Object.values(config.roles).some(role => 
            userRoles.has(role.id) && role.commands.includes('masskick')
        );

        if (!hasPermission) {
            return message.reply('You do not have permission to use this command.');
        }

        // Get users to kick
        const users = message.mentions.users;
        if (users.size === 0) {
            return message.reply('Please mention the users you want to kick.');
        }

        // Create kick log embed
        const logEmbed = new EmbedBuilder()
            .setTitle('Mass Kick Executed')
            .setColor('#FFA500')
            .setTimestamp()
            .addFields(
                { name: 'Moderator', value: message.author.tag },
                { name: 'Users Kicked', value: users.map(user => user.tag).join('\\n') }
            );

        // Execute kicks
        const results = [];
        for (const [_, user] of users) {
            const member = message.guild.members.cache.get(user.id);
            if (!member) continue;

            try {
                await member.kick(`Mass kick by ${message.author.tag}`);
                results.push(`✅ Kicked ${user.tag}`);
            } catch (error) {
                results.push(`❌ Failed to kick ${user.tag}: ${error.message}`);
            }
        }

        // Send results
        const logChannel = message.guild.channels.cache.get(config.channels.masskickLogs);
        if (logChannel) {
            logChannel.send({ embeds: [logEmbed] });
        }

        message.reply(results.join('\\n'));
    },
};
