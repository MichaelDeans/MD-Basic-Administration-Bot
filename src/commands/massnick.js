const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
    name: 'massnick',
    description: 'Mass change nicknames for users',
    async execute(message, args) {
        // Check if command is used in main guild
        if (message.guild.id !== config.mainGuildId) {
            return message.reply('This command can only be used in the main guild.');
        }

        // Check user permissions
        const userRoles = message.member.roles.cache;
        const hasPermission = Object.values(config.roles).some(role => 
            userRoles.has(role.id) && role.commands.includes('massnick')
        );

        if (!hasPermission) {
            return message.reply('You do not have permission to use this command.');
        }

        // Get new nickname
        const newNickname = args.join(' ');
        if (!newNickname) {
            return message.reply('Please provide the new nickname.');
        }

        // Get users to change nickname
        const users = message.mentions.users;
        if (users.size === 0) {
            return message.reply('Please mention the users to change nicknames for.');
        }

        // Execute nickname changes
        const results = [];
        const changedUsers = [];

        for (const [_, user] of users) {
            const member = message.guild.members.cache.get(user.id);
            if (!member) continue;

            try {
                await member.setNickname(newNickname, `Mass nickname change by ${message.author.tag}`);
                results.push(`✅ Changed nickname for ${user.tag}`);
                changedUsers.push(user.tag);
            } catch (error) {
                results.push(`❌ Failed to change nickname for ${user.tag}: ${error.message}`);
            }
        }

        // Create log embed
        const logEmbed = new EmbedBuilder()
            .setTitle('Mass Nickname Change Executed')
            .setColor('#0099FF')
            .setTimestamp()
            .addFields(
                { name: 'Moderator', value: message.author.tag },
                { name: 'New Nickname', value: newNickname },
                { name: 'Users Changed', value: changedUsers.join('\\n') || 'None' }
            );

        // Send results
        const logChannel = message.guild.channels.cache.get(config.channels.massnickLogs);
        if (logChannel) {
            logChannel.send({ embeds: [logEmbed] });
        }

        message.reply(results.join('\\n'));
    },
};
